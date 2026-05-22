import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: number) => void;
  isFavorite?: boolean;
  onClick?: () => void;
}

const badgeStyles: Record<string, string> = {
  gold: "bg-amber-400 text-amber-900",
  green: "bg-green-100 text-green-700",
  coral: "bg-orange-100 text-orange-700",
};

export default function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite, onClick }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.in_stock || !onAddToCart) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--ozon-border)" }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 flex items-center justify-center" style={{ backgroundColor: "var(--ozon-surface)" }}>
        <span className="text-6xl">{product.image_emoji || "📦"}</span>

        {/* Badges */}
        {discount && (
          <div className="absolute top-2 left-2 bg-[var(--ozon-orange)] text-white text-xs font-bold px-2 py-0.5 rounded-md">
            -{discount}%
          </div>
        )}
        {product.badge && !discount && (
          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md ${badgeStyles[product.badge_type || "green"]}`}>
            {product.badge}
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite?.(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <Icon
            name="Heart"
            size={14}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-golos font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border text-center">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Price */}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-xl font-bold font-golos" style={{ color: "var(--ozon-text)" }}>
            {product.price.toLocaleString()} ₽
          </span>
          {product.old_price && (
            <span className="text-sm font-golos line-through" style={{ color: "var(--ozon-text-secondary)" }}>
              {product.old_price.toLocaleString()} ₽
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-golos leading-snug line-clamp-2 mb-2" style={{ color: "var(--ozon-text)" }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="Star" size={11}
                className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
            ))}
          </div>
          <span className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
            {product.rating} ({product.reviews_count})
          </span>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs font-golos truncate" style={{ color: "var(--ozon-text-secondary)" }}>{product.seller_name}</span>
          {product.seller_verified && (
            <Icon name="BadgeCheck" size={12} className="text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Delivery badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.has_personal_delivery && (
            <span className="text-[10px] bg-blue-50 text-blue-600 font-golos px-2 py-0.5 rounded-full">
              🤝 Личная доставка
            </span>
          )}
          {product.in_stock && (
            <span className="text-[10px] font-golos px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e6f7e6", color: "var(--ozon-green)" }}>
              В наличии
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full py-2 rounded-lg text-sm font-golos font-semibold transition-all ${
            added
              ? "bg-green-500 text-white"
              : product.in_stock
              ? "text-white hover:opacity-90 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          style={product.in_stock && !added ? { backgroundColor: "var(--ozon-blue)" } : {}}
        >
          {added ? "✓ Добавлено" : product.in_stock ? "В корзину" : "Нет в наличии"}
        </button>
      </div>
    </div>
  );
}
