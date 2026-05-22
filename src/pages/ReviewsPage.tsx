import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, Review } from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ product: "", text: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    const params: Record<string, string> = {};
    if (filter) params.rating = filter.toString();
    api.getReviews(params).then(r => setReviews(r.reviews)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async () => {
    if (!newReview.text.trim()) return;
    setSubmitting(true);
    await api.addReview({ product_id: 1, reviewer_name: "Гость", rating: newReview.rating, text: newReview.text }).catch(() => {});
    setShowForm(false);
    setNewReview({ product: "", text: "", rating: 5 });
    setSubmitting(false);
    fetchReviews();
  };

  const handleHelpful = async (id: number) => {
    await api.markHelpful(id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful_count: r.helpful_count + 1 } : r));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--ozon-surface)" }}>
      {/* Header */}
      <div className="bg-white border-b py-8 px-4" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="font-oswald text-4xl font-bold mb-3" style={{ color: "var(--ozon-text)" }}>Отзывы покупателей</h1>

          <div className="flex items-start gap-8 flex-wrap">
            <div>
              <div className="font-oswald text-5xl font-bold" style={{ color: "var(--ozon-blue)" }}>
                {avgRating.toFixed(1)}
              </div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={18} className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <div className="text-xs font-golos mt-1" style={{ color: "var(--ozon-text-secondary)" }}>
                {reviews.length} отзывов
              </div>
            </div>
            <div className="flex-1 max-w-xs space-y-1.5">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-golos w-4" style={{ color: "var(--ozon-text-secondary)" }}>{star}★</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--ozon-surface)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: "var(--ozon-blue)" }} />
                    </div>
                    <span className="text-xs font-golos w-4" style={{ color: "var(--ozon-text-secondary)" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-golos font-medium border transition-all ${!filter ? "text-white" : "bg-white hover:border-blue-400"}`}
              style={{ backgroundColor: !filter ? "var(--ozon-blue)" : undefined, borderColor: !filter ? "var(--ozon-blue)" : "var(--ozon-border)" }}>
              Все
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button key={star} onClick={() => setFilter(filter === star ? null : star)}
                className={`px-3 py-2 rounded-full text-sm font-golos font-medium border transition-all ${filter === star ? "text-white" : "bg-white hover:border-blue-400"}`}
                style={{ backgroundColor: filter === star ? "var(--ozon-blue)" : undefined, borderColor: filter === star ? "var(--ozon-blue)" : "var(--ozon-border)" }}>
                {star}★
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 text-white font-bold font-golos rounded-xl hover:opacity-90 transition-all"
            style={{ backgroundColor: "var(--ozon-blue)" }}>
            <Icon name="PenLine" size={15} />
            Написать отзыв
          </button>
        </div>

        {/* Write review form */}
        {showForm && (
          <div className="bg-white rounded-xl border p-6 mb-5 animate-fade-in" style={{ borderColor: "var(--ozon-border)" }}>
            <h3 className="font-oswald font-bold text-xl mb-4" style={{ color: "var(--ozon-text)" }}>Новый отзыв</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-golos mb-2" style={{ color: "var(--ozon-text-secondary)" }}>Оценка</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setNewReview(p => ({ ...p, rating: s }))}
                      className={`text-2xl transition-transform hover:scale-110 ${s <= newReview.rating ? "text-amber-400" : "text-gray-200"}`}>★</button>
                  ))}
                </div>
              </div>
              <textarea value={newReview.text} onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                placeholder="Ваш отзыв о товаре..." rows={4}
                className="w-full px-4 py-3 rounded-xl border text-sm font-golos outline-none resize-none transition-colors"
                style={{ borderColor: "var(--ozon-border)" }}
                onFocus={e => e.target.style.borderColor = "var(--ozon-blue)"}
                onBlur={e => e.target.style.borderColor = "var(--ozon-border)"} />
              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-3 text-white font-bold font-golos rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
                  style={{ backgroundColor: "var(--ozon-blue)" }}>
                  {submitting ? "Публикация..." : "Опубликовать"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-3 border font-golos rounded-xl hover:bg-gray-50 transition-all"
                  style={{ borderColor: "var(--ozon-border)" }}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl border h-32 animate-pulse" style={{ borderColor: "var(--ozon-border)" }} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-all" style={{ borderColor: "var(--ozon-border)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 font-bold" style={{ backgroundColor: "var(--ozon-blue-light)", color: "var(--ozon-blue)" }}>
                    {review.reviewer_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-golos font-semibold text-sm" style={{ color: "var(--ozon-text)" }}>{review.reviewer_name}</span>
                      {review.verified_purchase && (
                        <span className="text-xs font-golos px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ozon-blue-light)", color: "var(--ozon-blue)" }}>
                          ✓ Покупатель
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                      {new Date(review.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="Star" size={14}
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                    ))}
                  </div>
                </div>

                {review.product_name && (
                  <div className="text-xs font-golos mb-2">
                    <span style={{ color: "var(--ozon-text-secondary)" }}>Товар: </span>
                    <span style={{ color: "var(--ozon-blue)" }} className="font-medium">{review.product_name}</span>
                  </div>
                )}

                <p className="text-sm font-golos leading-relaxed mb-3" style={{ color: "var(--ozon-text)" }}>{review.review_text}</p>

                <div className="flex items-center gap-4 text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                  <button onClick={() => handleHelpful(review.id)} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Icon name="ThumbsUp" size={13} />
                    Полезно ({review.helpful_count})
                  </button>
                  <button className="hover:text-red-500 transition-colors">Пожаловаться</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
