const BASE_URL = "https://functions.poehali.dev/453057f7-74a3-4f3a-822c-cd2f6c6553ce";

function getSessionId(): string {
  let sid = localStorage.getItem("abk_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem("abk_session", sid);
  }
  return sid;
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": getSessionId(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  rating: number;
  reviews_count: number;
  seller_name: string;
  seller_verified: boolean;
  verified_level?: string;
  category_name?: string;
  category_slug?: string;
  image_emoji: string;
  badge?: string | null;
  badge_type?: string | null;
  in_stock: boolean;
  weight?: string;
  has_personal_delivery?: boolean;
  description?: string;
  orders_count?: number;
}

export interface Seller {
  id: number;
  name: string;
  owner_name?: string;
  avatar_emoji: string;
  description?: string;
  location?: string;
  rating: number;
  reviews_count: number;
  products_count: number;
  completed_orders: number;
  response_time?: string;
  verified: boolean;
  verified_level: string;
  since_year?: number;
  status: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_emoji?: string;
  products_count: number;
  sort_order: number;
}

export interface Review {
  id: number;
  product_id: number;
  reviewer_name: string;
  rating: number;
  review_text?: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  product_name?: string;
  seller_name?: string;
}

export interface Order {
  id: string;
  status: string;
  delivery_method: string;
  delivery_price: number;
  address?: string;
  total: number;
  created_at: string;
  seller_name?: string;
  items?: Array<{ name: string; qty: number; price: number }>;
}

export interface AdminStats {
  products: number;
  sellers: number;
  orders: number;
  revenue: number;
  pending_applications: number;
}

// ── API methods ────────────────────────────────────────────────

export const api = {
  // Products
  getProducts: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req<{ products: Product[]; total: number }>(`/products${qs ? "?" + qs : ""}`);
  },

  // Sellers
  getSellers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req<{ sellers: Seller[] }>(`/sellers${qs ? "?" + qs : ""}`);
  },

  // Categories
  getCategories: () => req<{ categories: Category[] }>("/categories"),

  // Reviews
  getReviews: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req<{ reviews: Review[] }>(`/reviews${qs ? "?" + qs : ""}`);
  },
  addReview: (data: { product_id: number; reviewer_name: string; rating: number; text: string }) =>
    req<{ id: number }>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  markHelpful: (review_id: number) =>
    req<{ helpful_count: number }>("/reviews/helpful", { method: "POST", body: JSON.stringify({ review_id }) }),

  // Cart
  getCart: () => req<{ items: (Product & { item_id: number; qty: number })[] }>(`/cart?session_id=${getSessionId()}`),
  addToCart: (product_id: number, qty = 1) =>
    req<{ message: string }>("/cart", { method: "POST", body: JSON.stringify({ session_id: getSessionId(), product_id, qty }) }),
  updateCartQty: (item_id: number, qty: number) =>
    req<{ message: string }>("/cart", { method: "PUT", body: JSON.stringify({ item_id, qty }) }),
  removeFromCart: (item_id: number) =>
    req<{ message: string }>("/cart/remove", { method: "POST", body: JSON.stringify({ item_id }) }),

  // Favorites
  getFavorites: () => req<{ favorites: Product[] }>(`/favorites?session_id=${getSessionId()}`),
  toggleFavorite: (product_id: number) =>
    req<{ message: string }>("/favorites", { method: "POST", body: JSON.stringify({ session_id: getSessionId(), product_id }) }),

  // Orders
  getOrders: () => req<{ orders: Order[] }>(`/orders?session_id=${getSessionId()}`),
  createOrder: (data: {
    items: Array<{ product_id: number; name: string; price: number; qty: number }>;
    delivery_method: string;
    delivery_price: number;
    address: string;
    phone: string;
    comment?: string;
  }) => req<{ order_id: string; total: number }>("/orders", { method: "POST", body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => req<AdminStats>("/admin/stats"),
  getAdminOrders: () => req<{ orders: Order[] }>("/admin/orders"),
  getApplications: () => req<{ applications: unknown[] }>("/admin/applications"),
  reviewApplication: (application_id: number, status: string, comment = "") =>
    req<{ message: string }>("/admin/applications/review", { method: "POST", body: JSON.stringify({ application_id, status, comment }) }),
  updateOrderStatus: (order_id: string, status: string) =>
    req<{ message: string }>("/admin/update-order-status", { method: "POST", body: JSON.stringify({ order_id, status }) }),
  seedData: () => req<{ message: string }>("/admin/seed", { method: "POST" }),
};

export { getSessionId };
