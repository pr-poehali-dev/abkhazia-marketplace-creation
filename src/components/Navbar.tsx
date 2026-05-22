import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, Category } from "@/lib/api";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  favCount?: number;
}

export default function Navbar({ currentPage, onNavigate, cartCount, favCount = 0 }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    api.getCategories().then(r => setCategories(r.categories)).catch(() => {});
  }, []);

  const categoryIcons: Record<string, string> = {
    food: "🍊", spices: "🌶️", wines: "🍷", cosmetics: "🌿",
    souvenirs: "🏺", textile: "🧵", honey: "🍯", nuts: "🌰",
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b" style={{ borderColor: "var(--ozon-border)" }}>
      {/* Top info bar */}
      <div className="py-1.5 px-4 hidden sm:block" style={{ backgroundColor: "var(--ozon-blue)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/80 font-golos">
          <div className="flex items-center gap-5">
            <span>📍 Абхазия</span>
            <span>🚚 Доставка 1-3 дня</span>
            <span>✅ Проверенные продавцы</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("sellers")} className="hover:text-white">Продавцам</button>
            <button onClick={() => onNavigate("contacts")} className="hover:text-white">Поддержка</button>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-oswald font-bold text-lg transition-colors" style={{ backgroundColor: "var(--ozon-blue)" }}>А</div>
          <span className="hidden sm:block font-oswald font-bold text-xl" style={{ color: "var(--ozon-text)" }}>АбхазМаркет</span>
        </button>

        <div className="relative hidden md:block flex-shrink-0">
          <button
            onClick={() => setShowCatalog(!showCatalog)}
            className="flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-golos font-semibold transition-colors"
            style={{ backgroundColor: "var(--ozon-blue)" }}
          >
            <Icon name="LayoutGrid" size={15} />
            Каталог
          </button>
          {showCatalog && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl z-50 py-2 animate-fade-in" style={{ border: "1px solid var(--ozon-border)" }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { onNavigate("catalog"); setShowCatalog(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-blue-50">
                  <span className="text-lg">{categoryIcons[cat.slug] || "📦"}</span>
                  <span className="text-sm font-golos flex-1" style={{ color: "var(--ozon-text)" }}>{cat.name}</span>
                  <span className="text-xs" style={{ color: "var(--ozon-text-secondary)" }}>{cat.products_count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && search) onNavigate("catalog"); }}
            placeholder="Поиск товаров, продавцов..."
            className="w-full pl-4 pr-12 py-2.5 rounded-xl border-2 outline-none text-sm font-golos transition-colors"
            style={{ borderColor: "var(--ozon-border)", color: "var(--ozon-text)", backgroundColor: "var(--ozon-surface)" }}
            onFocus={e => e.target.style.borderColor = "var(--ozon-blue)"}
            onBlur={e => e.target.style.borderColor = "var(--ozon-border)"}
          />
          <button
            onClick={() => search && onNavigate("catalog")}
            className="absolute right-1 top-1 bottom-1 px-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: "var(--ozon-blue)" }}
          >
            <Icon name="Search" size={16} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[
            { id: "profile", icon: "User", label: "Профиль", badge: 0 },
            { id: "profile", icon: "Heart", label: "Избранное", badge: favCount },
            { id: "cart", icon: "ShoppingCart", label: "Корзина", badge: cartCount },
          ].map((btn, i) => (
            <button key={i} onClick={() => onNavigate(btn.id)}
              className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-50 group">
              <Icon name={btn.icon as "User"} size={20} className="text-gray-500 group-hover:text-blue-600" />
              {btn.badge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--ozon-orange)" }}>{btn.badge}</span>
              )}
              <span className="text-[10px] font-golos text-gray-400 hidden sm:block">{btn.label}</span>
            </button>
          ))}
          <button onClick={() => onNavigate("admin")}
            className="relative flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-50 group hidden sm:flex">
            <Icon name="LayoutDashboard" size={20} className="text-gray-500 group-hover:text-blue-600" />
            <span className="text-[10px] font-golos text-gray-400">Админ</span>
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} style={{ color: "var(--ozon-text)" }} />
          </button>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="hidden md:block border-t" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
          {[
            { id: "home", label: "Главная" }, { id: "catalog", label: "Все товары" },
            { id: "sellers", label: "Продавцы" }, { id: "delivery", label: "Доставка" },
            { id: "reviews", label: "Отзывы" }, { id: "contacts", label: "Поддержка" },
          ].map(l => (
            <button key={l.id} onClick={() => onNavigate(l.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-golos border-b-2 transition-all ${
                currentPage === l.id ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
              style={{ borderBottomColor: currentPage === l.id ? "var(--ozon-blue)" : "transparent" }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t py-1 animate-fade-in" style={{ borderColor: "var(--ozon-border)" }}>
          {[
            { id: "home", label: "Главная", icon: "Home" }, { id: "catalog", label: "Каталог", icon: "LayoutGrid" },
            { id: "sellers", label: "Продавцы", icon: "Store" }, { id: "delivery", label: "Доставка", icon: "Truck" },
            { id: "reviews", label: "Отзывы", icon: "Star" }, { id: "contacts", label: "Поддержка", icon: "MessageCircle" },
            { id: "admin", label: "Админ-панель", icon: "LayoutDashboard" },
          ].map(l => (
            <button key={l.id} onClick={() => { onNavigate(l.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-golos transition-colors ${
                currentPage === l.id ? "text-blue-600 bg-blue-50" : "hover:bg-gray-50"}`}
              style={{ color: currentPage === l.id ? "var(--ozon-blue)" : "var(--ozon-text)" }}>
              <Icon name={l.icon as "Home"} size={18} />
              {l.label}
            </button>
          ))}
        </div>
      )}
      {showCatalog && <div className="fixed inset-0 z-40" onClick={() => setShowCatalog(false)} />}
    </nav>
  );
}
