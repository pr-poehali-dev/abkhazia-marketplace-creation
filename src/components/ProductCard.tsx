import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviews: number;
  seller: string;
  verified: boolean;
  image: string;
  badge?: string | null;
  badgeType?: string | null;
  inStock: boolean;
  weight?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

const badgeColors: Record<string, string> = {
  gold: "bg-brand-gold text-brand-dark",
  green: "gradient-card border border-green-200 text-green-700",
  coral: "bg-brand-coral text-white",
};

export default function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-brand-green/30"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-brand-cream to-amber-50 flex items-center justify-center">
        <span className="text-6xl">{product.image}</span>
        {product.badge && (
          <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            badgeColors[product.badgeType || "green"] || "bg-muted text-foreground"
          }`}>
            {product.badge}
          </div>
        )}
        {discount && (
          <div className="absolute top-3 right-3 bg-brand-coral text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-white px-3 py-1 rounded-full border">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] text-muted-foreground mb-1 font-golos">
          {product.weight}
        </p>
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 font-golos line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={12}
                className={i < Math.floor(product.rating) ? "text-brand-gold fill-brand-gold" : "text-gray-200 fill-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-golos">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs text-muted-foreground font-golos truncate">{product.seller}</span>
          {product.verified && (
            <span className="badge-verified flex-shrink-0">
              <Icon name="BadgeCheck" size={9} /> ✓
            </span>
          )}
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-foreground font-golos">
              {product.price.toLocaleString()} ₽
            </div>
            {product.oldPrice && (
              <div className="text-xs text-muted-foreground line-through font-golos">
                {product.oldPrice.toLocaleString()} ₽
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock && onAddToCart) onAddToCart(product);
            }}
            disabled={!product.inStock}
            className="w-10 h-10 rounded-xl bg-brand-green hover:bg-green-700 disabled:bg-muted text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <Icon name="Plus" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
