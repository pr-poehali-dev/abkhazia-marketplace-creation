import { useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/mockData";

interface CatalogPageProps {
  onAddToCart: (product: (typeof products)[0]) => void;
}

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" },
];

export default function CatalogPage({ onAddToCart }: CatalogPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("popular");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (verifiedOnly && !p.verified) return false;
    if (inStockOnly && !p.inStock) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Каталог товаров</h1>
          <p className="text-white/50 font-golos">Найдено {sorted.length} товаров</p>

          {/* Search */}
          <div className="mt-6 relative max-w-2xl">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по товарам..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 font-golos focus:outline-none focus:border-brand-gold transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Categories scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-golos font-medium transition-all ${
              !selectedCategory
                ? "bg-brand-green text-white"
                : "bg-white border border-border text-foreground hover:border-brand-green"
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-golos font-medium transition-all ${
                selectedCategory === cat.name
                  ? "bg-brand-green text-white"
                  : "bg-white border border-border text-foreground hover:border-brand-green"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-golos font-medium border transition-all ${
                showFilters ? "bg-brand-green text-white border-brand-green" : "bg-white border-border text-foreground hover:border-brand-green"
              }`}
            >
              <Icon name="SlidersHorizontal" size={15} />
              Фильтры
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-10 h-5 rounded-full transition-colors relative ${verifiedOnly ? "bg-brand-green" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm font-golos text-foreground">Проверенные</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 rounded-full transition-colors relative ${inStockOnly ? "bg-brand-green" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inStockOnly ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm font-golos text-foreground">В наличии</span>
            </label>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm font-golos border border-border bg-white text-foreground focus:outline-none focus:border-brand-green"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-border p-5 mb-6 animate-fade-in">
            <h3 className="font-golos font-semibold text-foreground mb-4">Цена, ₽</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-28 px-3 py-2 rounded-lg border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
                placeholder="От"
              />
              <div className="flex-1 h-0.5 bg-gray-200 rounded" />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-28 px-3 py-2 rounded-lg border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
                placeholder="До"
              />
            </div>
          </div>
        )}

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-oswald text-2xl font-bold text-foreground mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground font-golos">Попробуйте изменить фильтры или поисковый запрос</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(null); setVerifiedOnly(false); setInStockOnly(false); }}
              className="mt-4 px-5 py-2.5 bg-brand-green text-white font-golos font-medium rounded-xl hover:bg-green-700 transition-all"
            >
              Сбросить всё
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
