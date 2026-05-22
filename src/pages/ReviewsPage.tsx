import { useState } from "react";
import Icon from "@/components/ui/icon";
import { reviews } from "@/data/mockData";

export default function ReviewsPage() {
  const [filter, setFilter] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ product: "", text: "", rating: 5 });

  const filtered = reviews.filter((r) => !filter || r.rating === filter);

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="mesh-bg py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-oswald text-5xl font-bold text-white mb-3">Отзывы покупателей</h1>
          <p className="text-white/50 font-golos">Реальные мнения о товарах и продавцах</p>
          <div className="flex items-center gap-6 mt-6">
            <div>
              <div className="font-oswald text-5xl font-bold text-brand-gold">{avgRating.toFixed(1)}</div>
              <div className="flex mt-1 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={18}
                    className={i < Math.round(avgRating) ? "text-brand-gold fill-brand-gold" : "text-white/20 fill-white/20"}
                  />
                ))}
              </div>
              <div className="text-white/40 text-xs font-golos mt-1">на основе {reviews.length} отзывов</div>
            </div>
            <div className="space-y-1.5 flex-1 max-w-xs">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = (count / reviews.length) * 100;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-golos w-4">{star}★</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-gold transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-white/40 text-xs font-golos w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-xl text-sm font-golos font-medium transition-all ${!filter ? "bg-brand-green text-white" : "bg-white border border-border text-foreground hover:border-brand-green"}`}
            >
              Все
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilter(filter === star ? null : star)}
                className={`px-3 py-2 rounded-xl text-sm font-golos font-medium transition-all ${filter === star ? "bg-brand-green text-white" : "bg-white border border-border text-foreground hover:border-brand-green"}`}
              >
                {star}★
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
          >
            <Icon name="PenLine" size={15} />
            Написать отзыв
          </button>
        </div>

        {/* Write review form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-border p-6 mb-6 animate-fade-in">
            <h3 className="font-oswald font-bold text-foreground text-xl mb-4">Новый отзыв</h3>
            <div className="space-y-3">
              <input
                value={newReview.product}
                onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                placeholder="Название товара"
                className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
              />
              <div>
                <div className="text-sm font-golos text-muted-foreground mb-2">Оценка</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= newReview.rating ? "text-brand-gold" : "text-gray-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Ваш отзыв о товаре..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
                >
                  Опубликовать
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 border border-border text-foreground font-golos rounded-xl hover:bg-muted transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-border p-6 hover-lift">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-cream flex items-center justify-center text-xl flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-golos font-semibold text-foreground">{review.user}</span>
                    {review.verified && (
                      <span className="badge-verified">✓ Покупатель</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-golos">{review.date}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={i < review.rating ? "text-brand-gold fill-brand-gold" : "text-gray-200 fill-gray-200"}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs font-golos mb-2">
                <span className="text-muted-foreground">Товар: </span>
                <span className="text-brand-green font-medium">{review.product}</span>
                <span className="text-muted-foreground"> · Продавец: </span>
                <span className="text-foreground">{review.seller}</span>
              </div>

              <p className="text-sm font-golos text-foreground leading-relaxed">{review.text}</p>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-golos">
                <button className="flex items-center gap-1 hover:text-brand-green transition-colors">
                  <Icon name="ThumbsUp" size={13} />
                  Полезно ({review.helpful})
                </button>
                <button className="hover:text-foreground transition-colors">Пожаловаться</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
