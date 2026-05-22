import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/ProductCard";
import { api, Product, Category } from "@/lib/api";

interface CatalogPageProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (id: number) => void;
  favorites?: number[];
  initialSearch?: string;
}

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" },
];

const categoryIcons: Record<string, string> = {
  food: "🍊", spices: "🌶️", wines: "🍷", cosmetics: "🌿",
  souvenirs: "🏺", textile: "🧵", honey: "🍯", nuts: "🌰",
};

export default function CatalogPage({ onAddToCart, onToggleFavorite, favorites = [], initialSearch = "" }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("popular");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { sort };
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (verifiedOnly) params.verified = "true";
    if (inStockOnly) params.in_stock = "true";
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    try {
      const res = await api.getProducts(params);
      setProducts(res.products);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, sort, verifiedOnly, inStockOnly, minPrice, maxPrice]);

  useEffect(() => {
    api.getCategories().then(r => setCategories(r.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const resetFilters = () => {
    setSearch(""); setSelectedCategory(null); setVerifiedOnly(false);
    setInStockOnly(false); setMinPrice(""); setMaxPrice("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--ozon-surface)" }}>
      {/* Header */}
      <div className="bg-white border-b py-5 px-4" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-oswald text-3xl font-bold mb-4" style={{ color: "var(--ozon-text)" }}>
            Каталог товаров
            <span className="ml-3 text-base font-golos font-normal" style={{ color: "var(--ozon-text-secondary)" }}>
              {loading ? "загрузка..." : `${products.length} товаров`}
            </span>
          </h1>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ozon-text-secondary)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск в каталоге..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none text-sm font-golos transition-colors"
              style={{ borderColor: "var(--ozon-border)", color: "var(--ozon-text)" }}
              onFocus={e => e.target.style.borderColor = "var(--ozon-blue)"}
              onBlur={e => e.target.style.borderColor = "var(--ozon-border)"}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b px-4 py-3" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-golos font-medium transition-all border ${
              !selectedCategory ? "text-white border-blue-600" : "bg-white border-gray-200 hover:border-blue-400"
            }`}
            style={{ backgroundColor: !selectedCategory ? "var(--ozon-blue)" : undefined, color: !selectedCategory ? "white" : "var(--ozon-text)" }}
          >
            Все категории
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-golos font-medium transition-all border ${
                selectedCategory === cat.slug ? "text-white" : "bg-white border-gray-200 hover:border-blue-400"
              }`}
              style={{
                backgroundColor: selectedCategory === cat.slug ? "var(--ozon-blue)" : undefined,
                color: selectedCategory === cat.slug ? "white" : "var(--ozon-text)",
                borderColor: selectedCategory === cat.slug ? "var(--ozon-blue)" : undefined
              }}
            >
              <span>{categoryIcons[cat.slug] || "📦"}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-golos font-medium border transition-all ${
                showFilters ? "text-white" : "bg-white hover:border-blue-400"
              }`}
              style={{
                backgroundColor: showFilters ? "var(--ozon-blue)" : undefined,
                borderColor: showFilters ? "var(--ozon-blue)" : "var(--ozon-border)"
              }}
            >
              <Icon name="SlidersHorizontal" size={15} />
              Фильтры
            </button>

            {/* Toggles */}
            {[
              { label: "Проверенные", value: verifiedOnly, setter: setVerifiedOnly },
              { label: "В наличии", value: inStockOnly, setter: setInStockOnly },
            ].map(toggle => (
              <label key={toggle.label} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => toggle.setter(!toggle.value)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${toggle.value ? "" : "bg-gray-200"}`}
                  style={{ backgroundColor: toggle.value ? "var(--ozon-blue)" : undefined }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${toggle.value ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm font-golos" style={{ color: "var(--ozon-text)" }}>{toggle.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-golos hidden sm:block" style={{ color: "var(--ozon-text-secondary)" }}>Сортировка:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm font-golos border bg-white outline-none cursor-pointer"
              style={{ borderColor: "var(--ozon-border)", color: "var(--ozon-text)" }}
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border p-5 mb-5 animate-fade-in" style={{ borderColor: "var(--ozon-border)" }}>
            <h3 className="font-golos font-semibold mb-4" style={{ color: "var(--ozon-text)" }}>Цена, ₽</h3>
            <div className="flex items-center gap-4">
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="От"
                className="w-28 px-3 py-2 rounded-lg border text-sm font-golos outline-none" style={{ borderColor: "var(--ozon-border)" }} />
              <div className="flex-1 h-px bg-gray-200" />
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="До"
                className="w-28 px-3 py-2 rounded-lg border text-sm font-golos outline-none" style={{ borderColor: "var(--ozon-border)" }} />
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                className="text-sm font-golos hover:underline" style={{ color: "var(--ozon-blue)" }}>Сбросить</button>
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border h-80 animate-pulse" style={{ borderColor: "var(--ozon-border)" }}>
                <div className="h-44 rounded-t-xl" style={{ backgroundColor: "var(--ozon-surface)" }} />
                <div className="p-3 space-y-2">
                  <div className="h-5 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-oswald text-2xl font-bold mb-2" style={{ color: "var(--ozon-text)" }}>Ничего не найдено</h3>
            <p className="font-golos mb-4" style={{ color: "var(--ozon-text-secondary)" }}>Попробуйте изменить фильтры</p>
            <button onClick={resetFilters}
              className="px-5 py-2.5 text-white font-golos font-medium rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: "var(--ozon-blue)" }}>
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
