import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/ProductCard";
import { HERO_IMAGE, PRODUCTS_IMAGE, DELIVERY_IMAGE } from "@/data/mockData";
import { api, Product, Category } from "@/lib/api";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

const categoryIcons: Record<string, string> = {
  food: "🍊", spices: "🌶️", wines: "🍷", cosmetics: "🌿",
  souvenirs: "🏺", textile: "🧵", honey: "🍯", nuts: "🌰",
};

export default function HomePage({ onNavigate, onAddToCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    api.getProducts({ sort: "popular", limit: "8", in_stock: "true" }).then(r => setProducts(r.products)).catch(() => {});
    api.getCategories().then(r => setCategories(r.categories)).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: "var(--ozon-surface)" }}>
      {/* Hero — Ozon-style with big search and promo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})`, opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0041cc 0%, #005bff 50%, #0d9488 100%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-white/80 text-xs font-golos mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Первый маркетплейс Абхазии · {products.length || "8"}+ товаров онлайн
            </div>

            <h1 className="font-oswald text-5xl sm:text-7xl font-bold text-white leading-none mb-4">
              Лучшие товары
              <br />
              <span className="text-amber-300">Абхазии</span>
              <br />
              с доставкой
            </h1>
            <p className="text-white/70 font-golos text-base mb-8 max-w-lg">
              Натуральный мёд, домашняя аджика, местные вина — всё с доставкой. Только проверенные продавцы с верификацией.
            </p>

            {/* Ozon-style search */}
            <div className="flex gap-2 max-w-xl bg-white rounded-2xl p-2 shadow-2xl mb-8">
              <input placeholder="Поиск товаров Абхазии..."
                className="flex-1 px-3 py-2 text-sm font-golos outline-none rounded-xl"
                style={{ color: "var(--ozon-text)" }}
                onKeyDown={e => e.key === "Enter" && onNavigate("catalog")} />
              <button
                onClick={() => onNavigate("catalog")}
                className="px-5 py-2 text-white rounded-xl text-sm font-golos font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--ozon-blue)" }}>
                Найти
              </button>
            </div>

            <div className="flex flex-wrap gap-5">
              {[
                { num: "1500+", label: "Товаров" }, { num: "248", label: "Продавцов" },
                { num: "4.8★", label: "Рейтинг" }, { num: "1-3 дн", label: "Доставка" },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold font-oswald text-amber-300">{s.num}</div>
                  <div className="text-white/50 text-xs font-golos">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner row — Ozon style */}
      <div className="bg-white border-b px-4 py-3" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          {[
            { icon: "Truck", text: "Доставка 1-3 дня", sub: "По всей Абхазии" },
            { icon: "BadgeCheck", text: "Проверенные продавцы", sub: "Верификация документов" },
            { icon: "RotateCcw", text: "Гарантия возврата", sub: "14 дней" },
            { icon: "Shield", text: "Безопасная оплата", sub: "Защита покупателя" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3 flex-shrink-0 py-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--ozon-blue-light)" }}>
                <Icon name={item.icon as "Truck"} size={18} style={{ color: "var(--ozon-blue)" }} />
              </div>
              <div>
                <div className="text-sm font-golos font-semibold" style={{ color: "var(--ozon-text)" }}>{item.text}</div>
                <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories grid */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-oswald text-2xl font-bold" style={{ color: "var(--ozon-text)" }}>Категории</h2>
          <button onClick={() => onNavigate("catalog")} className="text-sm font-golos flex items-center gap-1 hover:underline" style={{ color: "var(--ozon-blue)" }}>
            Смотреть все <Icon name="ChevronRight" size={15} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {(categories.length > 0 ? categories : Array.from({length: 8}, (_, i) => ({id: i, name: "...", slug: "", products_count: 0, sort_order: i, icon_emoji: "📦"}))).map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate("catalog")}
              className="bg-white rounded-xl border p-3 text-center transition-all hover:shadow-md hover:-translate-y-0.5 group"
              style={{ borderColor: "var(--ozon-border)" }}
            >
              <div className="text-3xl mb-1.5">{categoryIcons[cat.slug] || "📦"}</div>
              <div className="text-xs font-golos font-medium leading-tight" style={{ color: "var(--ozon-text)" }}>{cat.name || "..."}</div>
              {cat.products_count > 0 && (
                <div className="text-[10px] font-golos mt-0.5" style={{ color: "var(--ozon-text-secondary)" }}>{cat.products_count}</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="py-4 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-oswald text-2xl font-bold" style={{ color: "var(--ozon-text)" }}>Популярные товары</h2>
          <button onClick={() => onNavigate("catalog")} className="text-sm font-golos flex items-center gap-1 hover:underline" style={{ color: "var(--ozon-blue)" }}>
            Все товары <Icon name="ChevronRight" size={15} />
          </button>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.slice(0, 10).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onClick={() => onNavigate("catalog")} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border h-72 animate-pulse" style={{ borderColor: "var(--ozon-border)" }} />
            ))}
          </div>
        )}
      </section>

      {/* Delivery promo */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Delivery banner */}
          <div className="relative rounded-2xl overflow-hidden h-48">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${DELIVERY_IMAGE})` }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #005bff, #0d9488)" }} />
            <div className="relative p-6">
              <div className="text-white/70 text-xs font-golos mb-1">🚚 Доставка</div>
              <h3 className="font-oswald text-2xl font-bold text-white mb-2">До вашей двери</h3>
              <p className="text-white/70 text-sm font-golos mb-4">Курьер, личная доставка, самовывоз</p>
              <button onClick={() => onNavigate("delivery")}
                className="px-4 py-2 bg-white text-sm font-golos font-semibold rounded-lg hover:bg-gray-100 transition-all"
                style={{ color: "var(--ozon-blue)" }}>
                Подробнее
              </button>
            </div>
          </div>

          {/* Sellers banner */}
          <div className="relative rounded-2xl overflow-hidden h-48">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${PRODUCTS_IMAGE})` }} />
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: "var(--ozon-orange)", opacity: 0.9 }} />
            <div className="relative p-6">
              <div className="text-white/70 text-xs font-golos mb-1">✅ Верификация</div>
              <h3 className="font-oswald text-2xl font-bold text-white mb-2">Только настоящие товары</h3>
              <p className="text-white/70 text-sm font-golos mb-4">Проверяем каждого продавца лично</p>
              <button onClick={() => onNavigate("sellers")}
                className="px-4 py-2 bg-white text-sm font-golos font-semibold rounded-lg hover:bg-gray-100 transition-all"
                style={{ color: "var(--ozon-orange)" }}>
                Наши продавцы
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal delivery section — unique feature */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="rounded-2xl p-8 sm:p-10 grid sm:grid-cols-2 gap-6 items-center" style={{ backgroundColor: "var(--ozon-blue)" }}>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 text-white rounded-full px-3 py-1 text-xs font-golos mb-4">
              ⭐ Уникальная функция
            </div>
            <h2 className="font-oswald text-3xl font-bold text-white mb-3">Личная доставка от продавца</h2>
            <p className="text-white/70 font-golos text-sm mb-5">
              Продавец доставляет сам — вы познакомитесь лично, зададите вопросы и убедитесь в качестве прямо при получении. Бесплатно.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["🆓 Бесплатно", "🤝 Личное знакомство", "💬 Ответы на вопросы", "✅ Проверка при получении"].map(tag => (
                <span key={tag} className="bg-white/15 text-white text-xs font-golos px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <button onClick={() => onNavigate("delivery")}
              className="px-5 py-3 font-bold font-golos rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: "var(--ozon-orange)", color: "white" }}>
              Узнать больше
            </button>
          </div>
          <div className="hidden sm:flex justify-center">
            <div className="w-40 h-40 rounded-3xl bg-white/10 flex items-center justify-center text-8xl">🤝</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 px-4" style={{ backgroundColor: "var(--ozon-blue)" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-oswald text-2xl font-bold text-white mb-2">Лучшие предложения на почту</h2>
          <p className="text-white/60 font-golos text-sm mb-5">Узнавайте о скидках и новинках первыми</p>
          <div className="flex gap-2">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-xl text-sm font-golos outline-none"
              style={{ color: "var(--ozon-text)" }} />
            <button className="px-5 py-3 font-bold font-golos rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: "var(--ozon-orange)", color: "white" }}>
              Подписаться
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-4" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-oswald font-bold" style={{ backgroundColor: "var(--ozon-blue)" }}>А</div>
            <span className="font-oswald font-bold" style={{ color: "var(--ozon-text)" }}>АбхазМаркет</span>
          </div>
          <div className="text-sm font-golos" style={{ color: "var(--ozon-text-secondary)" }}>© 2026 АбхазМаркет. Первый маркетплейс Абхазии</div>
          <div className="flex gap-4">
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="text-sm font-golos hover:underline" style={{ color: "var(--ozon-text-secondary)" }}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
