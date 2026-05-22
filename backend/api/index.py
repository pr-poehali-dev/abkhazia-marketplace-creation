"""
Главный API-обработчик маркетплейса АбхазМаркет.
Маршруты: /products, /sellers, /categories, /reviews, /orders, /cart, /favorites, /admin/*
"""
import json
import os
import random
import string
import psycopg2
from psycopg2.extras import RealDictCursor

S = os.environ.get("MAIN_DB_SCHEMA", "t_p15847478_abkhazia_marketplace")
P = lambda t: f"{S}.abk_{t}"   # table with schema prefix

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id, X-User-Id",
}

def get_db():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.cursor_factory = RealDictCursor
    return conn

def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, status=400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = (event.get("path", "/") or "/").rstrip("/") or "/"
    qs = event.get("queryStringParameters") or {}
    if path == "/" and qs.get("action"):
        path = "/" + qs["action"]
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── PRODUCTS ──────────────────────────────────────────────────
    if path == "/products" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            filters = []
            vals = []
            if qs.get("category"):
                filters.append("c.slug = %s")
                vals.append(qs["category"])
            if qs.get("search"):
                filters.append("p.name ILIKE %s")
                vals.append(f"%{qs['search']}%")
            if qs.get("verified") == "true":
                filters.append("s.verified = TRUE")
            if qs.get("in_stock") == "true":
                filters.append("p.in_stock = TRUE")
            if qs.get("min_price"):
                filters.append("p.price >= %s")
                vals.append(float(qs["min_price"]))
            if qs.get("max_price"):
                filters.append("p.price <= %s")
                vals.append(float(qs["max_price"]))
            where = "WHERE p.status = 'active'" + (" AND " + " AND ".join(filters) if filters else "")
            sort_map = {"price_asc": "p.price ASC", "price_desc": "p.price DESC",
                        "rating": "p.rating DESC", "popular": "p.orders_count DESC"}
            order_by = sort_map.get(qs.get("sort", "popular"), "p.orders_count DESC")
            limit = min(int(qs.get("limit", 50)), 100)
            offset = int(qs.get("offset", 0))
            cur.execute(f"""
                SELECT p.*, s.name as seller_name, s.verified as seller_verified, s.verified_level,
                       c.name as category_name, c.slug as category_slug
                FROM {P("products")} p
                LEFT JOIN {P("sellers")} s ON p.seller_id = s.id
                LEFT JOIN {P("categories")} c ON p.category_id = c.id
                {where}
                ORDER BY {order_by}
                LIMIT %s OFFSET %s
            """, vals + [limit, offset])
            products = cur.fetchall()
        conn.close()
        return ok({"products": products, "total": len(products)})

    # ── SELLERS ───────────────────────────────────────────────────
    if path == "/sellers" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            filters = ["s.status = 'active'"]
            vals = []
            if qs.get("verified") == "true":
                filters.append("s.verified = TRUE")
            if qs.get("level"):
                filters.append("s.verified_level = %s")
                vals.append(qs["level"])
            if qs.get("search"):
                filters.append("(s.name ILIKE %s OR s.location ILIKE %s)")
                vals += [f"%{qs['search']}%", f"%{qs['search']}%"]
            where = "WHERE " + " AND ".join(filters)
            cur.execute(f"SELECT * FROM {P('sellers')} s {where} ORDER BY s.verified_level DESC, s.rating DESC", vals)
            sellers = cur.fetchall()
        conn.close()
        return ok({"sellers": sellers})

    # ── CATEGORIES ────────────────────────────────────────────────
    if path == "/categories" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"SELECT * FROM {P('categories')} ORDER BY sort_order")
            cats = cur.fetchall()
        conn.close()
        return ok({"categories": cats})

    # ── REVIEWS ───────────────────────────────────────────────────
    if path == "/reviews" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            filters = []
            vals = []
            if qs.get("product_id"):
                filters.append("r.product_id = %s")
                vals.append(int(qs["product_id"]))
            if qs.get("rating"):
                filters.append("r.rating = %s")
                vals.append(int(qs["rating"]))
            where = ("WHERE " + " AND ".join(filters)) if filters else ""
            cur.execute(f"""
                SELECT r.*, p.name as product_name, s.name as seller_name
                FROM {P("reviews")} r
                LEFT JOIN {P("products")} p ON r.product_id = p.id
                LEFT JOIN {P("sellers")} s ON p.seller_id = s.id
                {where}
                ORDER BY r.created_at DESC
                LIMIT 50
            """, vals)
            reviews = cur.fetchall()
        conn.close()
        return ok({"reviews": reviews})

    if path == "/reviews" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                INSERT INTO {P("reviews")} (product_id, reviewer_name, rating, review_text, verified_purchase)
                VALUES (%s, %s, %s, %s, FALSE) RETURNING id
            """, [body.get("product_id"), body.get("reviewer_name", "Гость"),
                  body.get("rating", 5), body.get("text", "")])
            new_id = cur.fetchone()["id"]
            if body.get("product_id"):
                cur.execute(f"""
                    UPDATE {P("products")} SET reviews_count = reviews_count + 1,
                    rating = (SELECT AVG(rating) FROM {P("reviews")} WHERE product_id = %s)
                    WHERE id = %s
                """, [body["product_id"], body["product_id"]])
        conn.commit()
        conn.close()
        return ok({"id": new_id, "message": "Review added"}, 201)

    if path == "/reviews/helpful" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {P('reviews')} SET helpful_count = helpful_count + 1 WHERE id = %s RETURNING helpful_count",
                        [body.get("review_id")])
            row = cur.fetchone()
        conn.commit()
        conn.close()
        return ok({"helpful_count": row["helpful_count"] if row else 0})

    # ── CART ──────────────────────────────────────────────────────
    if path == "/cart" and method == "GET":
        session_id = qs.get("session_id") or event.get("headers", {}).get("X-Session-Id", "")
        if not session_id:
            return ok({"items": []})
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT ci.id, ci.qty, p.id as product_id, p.name, p.price, p.image_emoji, p.in_stock,
                       s.name as seller_name, s.verified as seller_verified
                FROM {P("cart_items")} ci
                JOIN {P("products")} p ON ci.product_id = p.id
                LEFT JOIN {P("sellers")} s ON p.seller_id = s.id
                WHERE ci.session_id = %s
                ORDER BY ci.created_at DESC
            """, [session_id])
            items = cur.fetchall()
        conn.close()
        return ok({"items": items})

    if path == "/cart" and method == "POST":
        session_id = body.get("session_id") or event.get("headers", {}).get("X-Session-Id", "")
        product_id = body.get("product_id")
        qty = int(body.get("qty", 1))
        if not session_id or not product_id:
            return err("session_id and product_id required")
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"SELECT id, qty FROM {P('cart_items')} WHERE session_id = %s AND product_id = %s",
                        [session_id, product_id])
            existing = cur.fetchone()
            if existing:
                cur.execute(f"UPDATE {P('cart_items')} SET qty = qty + %s WHERE id = %s", [qty, existing["id"]])
            else:
                cur.execute(f"INSERT INTO {P('cart_items')} (session_id, product_id, qty) VALUES (%s, %s, %s)",
                            [session_id, product_id, qty])
        conn.commit()
        conn.close()
        return ok({"message": "Added to cart"})

    if path == "/cart" and method == "PUT":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {P('cart_items')} SET qty = %s WHERE id = %s",
                        [body.get("qty", 1), body.get("item_id")])
        conn.commit()
        conn.close()
        return ok({"message": "Updated"})

    if path == "/cart/remove" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {P('cart_items')} SET qty = 0 WHERE id = %s", [body.get("item_id")])
        conn.commit()
        conn.close()
        return ok({"message": "Removed"})

    # ── ORDERS ────────────────────────────────────────────────────
    if path == "/orders" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT o.*, s.name as seller_name,
                       json_agg(json_build_object('name', oi.product_name, 'qty', oi.qty, 'price', oi.price)) as items
                FROM {P("orders")} o
                LEFT JOIN {P("sellers")} s ON o.seller_id = s.id
                LEFT JOIN {P("order_items")} oi ON o.id = oi.order_id
                GROUP BY o.id, s.name
                ORDER BY o.created_at DESC
                LIMIT 50
            """)
            orders = cur.fetchall()
        conn.close()
        return ok({"orders": orders})

    if path == "/orders" and method == "POST":
        order_id = "ABK-" + "".join(random.choices(string.digits, k=4))
        items = body.get("items", [])
        total = sum(float(i.get("price", 0)) * int(i.get("qty", 1)) for i in items)
        delivery_price = float(body.get("delivery_price", 0))
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                INSERT INTO {P("orders")} (id, seller_id, status, delivery_method, delivery_price, address, phone, comment, total)
                VALUES (%s, %s, 'processing', %s, %s, %s, %s, %s, %s)
            """, [order_id, body.get("seller_id"), body.get("delivery_method", "courier"),
                  delivery_price, body.get("address", ""), body.get("phone", ""),
                  body.get("comment", ""), total + delivery_price])
            for item in items:
                cur.execute(f"""
                    INSERT INTO {P("order_items")} (order_id, product_id, product_name, price, qty, subtotal)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, [order_id, item.get("product_id"), item.get("name", ""),
                      float(item.get("price", 0)), int(item.get("qty", 1)),
                      float(item.get("price", 0)) * int(item.get("qty", 1))])
                if item.get("product_id"):
                    cur.execute(f"UPDATE {P('products')} SET orders_count = orders_count + %s WHERE id = %s",
                                [int(item.get("qty", 1)), item["product_id"]])
        conn.commit()
        conn.close()
        return ok({"order_id": order_id, "total": total + delivery_price}, 201)

    # ── FAVORITES ─────────────────────────────────────────────────
    if path == "/favorites" and method == "GET":
        session_id = qs.get("session_id") or event.get("headers", {}).get("X-Session-Id", "")
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT f.id, p.id as product_id, p.name, p.price, p.old_price, p.image_emoji,
                       p.rating, p.reviews_count, p.in_stock, s.name as seller_name, s.verified as seller_verified
                FROM {P("favorites")} f
                JOIN {P("products")} p ON f.product_id = p.id
                LEFT JOIN {P("sellers")} s ON p.seller_id = s.id
                WHERE f.session_id = %s
            """, [session_id])
            favs = cur.fetchall()
        conn.close()
        return ok({"favorites": favs})

    if path == "/favorites" and method == "POST":
        session_id = body.get("session_id") or event.get("headers", {}).get("X-Session-Id", "")
        product_id = body.get("product_id")
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"SELECT id FROM {P('favorites')} WHERE session_id = %s AND product_id = %s",
                        [session_id, product_id])
            if cur.fetchone():
                cur.execute(f"UPDATE {P('favorites')} SET product_id = product_id WHERE session_id = %s AND product_id = %s",
                            [session_id, product_id])
            else:
                cur.execute(f"INSERT INTO {P('favorites')} (session_id, product_id) VALUES (%s, %s)",
                            [session_id, product_id])
        conn.commit()
        conn.close()
        return ok({"message": "Toggled favorite"})

    # ── ADMIN ─────────────────────────────────────────────────────
    if path == "/admin/stats" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) as cnt FROM {P('products')} WHERE status = 'active'")
            products_cnt = cur.fetchone()["cnt"]
            cur.execute(f"SELECT COUNT(*) as cnt FROM {P('sellers')} WHERE status = 'active'")
            sellers_cnt = cur.fetchone()["cnt"]
            cur.execute(f"SELECT COUNT(*) as cnt FROM {P('orders')}")
            orders_cnt = cur.fetchone()["cnt"]
            cur.execute(f"SELECT COALESCE(SUM(total), 0) as total FROM {P('orders')}")
            revenue = cur.fetchone()["total"]
            cur.execute(f"SELECT COUNT(*) as cnt FROM {P('seller_applications')} WHERE status = 'pending'")
            pending = cur.fetchone()["cnt"]
        conn.close()
        return ok({"products": products_cnt, "sellers": sellers_cnt, "orders": orders_cnt,
                   "revenue": float(revenue), "pending_applications": pending})

    if path == "/admin/applications" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT a.*, s.name as seller_name, s.location, s.email
                FROM {P("seller_applications")} a
                JOIN {P("sellers")} s ON a.seller_id = s.id
                WHERE a.status = 'pending'
                ORDER BY a.created_at DESC
            """)
            apps = cur.fetchall()
        conn.close()
        return ok({"applications": apps})

    if path == "/admin/applications/review" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                UPDATE {P("seller_applications")}
                SET status = %s, admin_comment = %s, reviewed_at = NOW()
                WHERE id = %s
            """, [body.get("status"), body.get("comment", ""), body.get("application_id")])
            if body.get("status") == "approved":
                cur.execute(f"""
                    UPDATE {P("sellers")} SET verified = TRUE, verified_level = 'standard', verified_at = NOW(), status = 'active'
                    WHERE id = (SELECT seller_id FROM {P("seller_applications")} WHERE id = %s)
                """, [body.get("application_id")])
        conn.commit()
        conn.close()
        return ok({"message": "Application reviewed"})

    if path == "/admin/seed" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) as cnt FROM {P('categories')}")
            if cur.fetchone()["cnt"] > 0:
                conn.close()
                return ok({"message": "Already seeded"})
        conn.close()
        _seed_data()
        return ok({"message": "Data seeded successfully"})

    if path == "/admin/orders" and method == "GET":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT o.*, s.name as seller_name
                FROM {P("orders")} o
                LEFT JOIN {P("sellers")} s ON o.seller_id = s.id
                ORDER BY o.created_at DESC LIMIT 100
            """)
            orders = cur.fetchall()
        conn.close()
        return ok({"orders": orders})

    if path == "/admin/update-order-status" and method == "POST":
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {P('orders')} SET status = %s, updated_at = NOW() WHERE id = %s",
                        [body.get("status"), body.get("order_id")])
        conn.commit()
        conn.close()
        return ok({"message": "Status updated"})

    return err("Not found", 404)


def _seed_data():
    conn = get_db()
    with conn.cursor() as cur:
        cats = [
            ("Продукты питания", "food", 248, 1),
            ("Специи и соусы", "spices", 94, 2),
            ("Вина и напитки", "wines", 67, 3),
            ("Косметика", "cosmetics", 112, 4),
            ("Сувениры", "souvenirs", 183, 5),
            ("Ткани и одежда", "textile", 56, 6),
            ("Мёд и пасека", "honey", 39, 7),
            ("Орехи и сухофрукты", "nuts", 71, 8),
        ]
        for c in cats:
            cur.execute(f"INSERT INTO {P('categories')} (name, slug, products_count, sort_order) VALUES (%s, %s, %s, %s) ON CONFLICT (slug) DO NOTHING", c)

        sellers = [
            ("Пасека Абхазия", "Ахра Джинджолия", "bee", "Семейная пасека в горах Абхазии. Натуральный мёд без добавок.", "Гудаута", 4.9, 312, 18, 1840, "2 hours", True, "gold", 2021, "active"),
            ("Нина Квициния", "Нина Квициния", "cook", "Домашние специи и аджика по традиционным рецептам.", "Сухум", 4.8, 124, 7, 632, "4 hours", True, "standard", 2022, "active"),
            ("Виноградники Гудауты", "Беслан Агрба", "grape", "Винодельня полного цикла. Красные и белые вина из абхазских сортов.", "Гудаута", 4.9, 445, 23, 2910, "1 hour", True, "gold", 2020, "active"),
            ("Сладкая Абхазия", "Мзия Аргун", "candy", "Традиционные абхазские сладости: чурчхела, нардек, пастила.", "Гагра", 4.7, 87, 12, 398, "6 hours", True, "standard", 2023, "active"),
        ]
        for s in sellers:
            cur.execute(f"""
                INSERT INTO {P("sellers")} (name, owner_name, avatar_emoji, description, location, rating, reviews_count,
                products_count, completed_orders, response_time, verified, verified_level, since_year, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, s)

        prods = [
            (1, 7, "Мёд горный абхазский", "Натуральный горный мёд, собранный на высоте 1500м.", 850, 1100, "🍯", "500 г", "Хит продаж", "gold", True, 50, 4.9, 124, 340, True),
            (2, 2, "Аджика домашняя острая", "Острая аджика по традиционному абхазскому рецепту.", 320, None, "🌶️", "300 г", "Проверено", "green", True, 30, 4.8, 89, 210, False),
            (4, 8, "Чурчхела грецкий орех", "Традиционная чурчхела из грецкого ореха на виноградном соке.", 180, 220, "🍇", "250 г", None, None, True, 80, 4.7, 67, 180, False),
            (3, 3, "Вино Апсны красное", "Красное сухое вино из местных абхазских сортов.", 1200, 1450, "🍷", "750 мл", "Топ рейтинг", "coral", True, 40, 4.9, 201, 520, True),
            (1, 7, "Крем-мёд с фундуком", "Взбитый мёд с добавлением измельчённого фундука.", 980, 1200, "🌰", "400 г", "Новинка", "green", True, 25, 5.0, 156, 290, True),
            (2, 2, "Набор специй абхазских", "Коллекция из 8 традиционных абхазских специй.", 560, 700, "🧂", "250 г", "Скидка 20%", "coral", False, 0, 4.8, 92, 145, False),
            (1, 1, "Чай из горных трав", "Сбор горных трав Абхазии: душица, мята, чабрец.", 290, None, "🍵", "100 г", None, None, True, 60, 4.7, 78, 160, False),
            (3, 3, "Вино Лыхны белое", "Белое полусухое вино с фруктовым букетом.", 950, None, "🥂", "750 мл", None, None, True, 35, 4.8, 134, 310, True),
        ]
        for p in prods:
            cur.execute(f"""
                INSERT INTO {P("products")} (seller_id, category_id, name, description, price, old_price, image_emoji, weight,
                badge, badge_type, in_stock, stock_qty, rating, reviews_count, orders_count, status, has_personal_delivery)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'active', %s)
            """, p)

        revs = [
            (1, "Александр М.", 5, "Превосходный мёд! Аромат горных трав, натуральный и густой.", 34, True),
            (2, "Марина К.", 5, "Настоящая домашняя аджика! Острая в меру, очень ароматная.", 21, True),
            (4, "Дмитрий Р.", 4, "Отличное вино с характерным абхазским вкусом.", 17, True),
            (3, "Елена С.", 5, "Дети в восторге! Вкус настоящий, как с абхазского рынка.", 29, False),
            (5, "Игорь В.", 5, "Крем-мёд просто невероятный! Нежный, ароматный, с хрустом фундука.", 44, True),
            (7, "Наталья П.", 4, "Приятный горный чай, хорошо заваривается.", 12, True),
        ]
        for r in revs:
            cur.execute(f"""
                INSERT INTO {P("reviews")} (product_id, reviewer_name, rating, review_text, helpful_count, verified_purchase)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, r)

    conn.commit()
    conn.close()
