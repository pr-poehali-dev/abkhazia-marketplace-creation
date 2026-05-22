import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, Seller } from "@/lib/api";

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "gold" | "standard">("all");

  useEffect(() => {
    const params: Record<string, string> = { verified: "true" };
    if (filter !== "all") params.level = filter;
    if (search) params.search = search;
    api.getSellers(params)
      .then(r => setSellers(r.sellers))
      .finally(() => setLoading(false));
  }, [filter, search]);

  const avatarMap: Record<string, string> = {
    bee: "🐝", cook: "👩‍🍳", grape: "🍇", candy: "🍬",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--ozon-surface)" }}>
      {/* Header */}
      <div className="bg-white border-b py-8 px-4" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "var(--ozon-blue)" }}>✓</div>
            <span className="text-sm font-golos font-semibold" style={{ color: "var(--ozon-blue)" }}>Система верификации АбхазМаркет</span>
          </div>
          <h1 className="font-oswald text-4xl font-bold mb-2" style={{ color: "var(--ozon-text)" }}>Продавцы</h1>
          <p className="font-golos" style={{ color: "var(--ozon-text-secondary)" }}>Каждый продавец проходит проверку документов</p>

          <div className="mt-5 relative max-w-xl">
            <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ozon-text-secondary)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или городу..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none text-sm font-golos transition-colors"
              style={{ borderColor: "var(--ozon-border)" }}
              onFocus={e => e.target.style.borderColor = "var(--ozon-blue)"}
              onBlur={e => e.target.style.borderColor = "var(--ozon-border)"} />
          </div>
        </div>
      </div>

      {/* Verification levels info */}
      <div className="bg-white border-b px-4 py-4" style={{ borderColor: "var(--ozon-border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "FileText", color: "bg-blue-50 text-blue-600", title: "Проверка документов", desc: "Паспорт, ИНН, адрес" },
            { icon: "Camera", color: "bg-green-50 text-green-600", title: "Верификация товаров", desc: "Фото и видео продукции" },
            { icon: "Star", color: "bg-amber-50 text-amber-600", title: "Система рейтингов", desc: "Оценки покупателей" },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={item.icon as "Star"} size={17} />
              </div>
              <div>
                <div className="font-golos font-semibold text-sm" style={{ color: "var(--ozon-text)" }}>{item.title}</div>
                <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {([["all", "Все продавцы"], ["gold", "🥇 Золотые"], ["standard", "✅ Проверенные"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-full text-sm font-golos font-medium border transition-all ${
                filter === val ? "text-white" : "bg-white hover:border-blue-400"
              }`}
              style={{
                backgroundColor: filter === val ? "var(--ozon-blue)" : undefined,
                borderColor: filter === val ? "var(--ozon-blue)" : "var(--ozon-border)"
              }}>
              {label}
            </button>
          ))}
          {!loading && <span className="text-sm font-golos ml-2" style={{ color: "var(--ozon-text-secondary)" }}>{sellers.length} продавцов</span>}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border h-48 animate-pulse" style={{ borderColor: "var(--ozon-border)" }} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {sellers.map(seller => (
              <div key={seller.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all" style={{ borderColor: "var(--ozon-border)" }}>
                <div className="h-1" style={{ backgroundColor: seller.verified_level === "gold" ? "var(--ozon-orange)" : "var(--ozon-blue)" }} />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: "var(--ozon-surface)" }}>
                      {avatarMap[seller.avatar_emoji] || "🏪"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-oswald font-bold text-lg leading-none" style={{ color: "var(--ozon-text)" }}>{seller.name}</h3>
                        <span className={`text-xs font-golos font-bold px-2 py-0.5 rounded-full ${
                          seller.verified_level === "gold" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
                        }`}>
                          {seller.verified_level === "gold" ? "🥇 Золотой" : "✓ Проверен"}
                        </span>
                      </div>
                      <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                        📍 {seller.location} · С {seller.since_year} года
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-golos mb-4 leading-relaxed" style={{ color: "var(--ozon-text-secondary)" }}>{seller.description}</p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Рейтинг", value: `★ ${seller.rating}` },
                      { label: "Отзывы", value: seller.reviews_count },
                      { label: "Заказов", value: seller.completed_orders.toLocaleString() },
                    ].map(stat => (
                      <div key={stat.label} className="text-center rounded-lg py-2" style={{ backgroundColor: "var(--ozon-surface)" }}>
                        <div className="font-oswald font-bold text-sm" style={{ color: "var(--ozon-text)" }}>{stat.value}</div>
                        <div className="text-[10px] font-golos" style={{ color: "var(--ozon-text-secondary)" }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-golos border-t pt-3" style={{ borderColor: "var(--ozon-border)", color: "var(--ozon-text-secondary)" }}>
                    <span>⏱ Отвечает {seller.response_time?.replace("hours", "ч").replace("hour", "ч")}</span>
                    <span>{seller.products_count} товаров</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl p-8 text-center" style={{ backgroundColor: "var(--ozon-blue)" }}>
          <div className="text-4xl mb-3">🏪</div>
          <h2 className="font-oswald text-3xl font-bold text-white mb-2">Станьте продавцом</h2>
          <p className="text-white/70 font-golos mb-5 max-w-md mx-auto text-sm">
            Зарегистрируйтесь и начните продавать свои товары тысячам покупателей
          </p>
          <button className="px-6 py-3 font-bold font-golos rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: "var(--ozon-orange)", color: "white" }}>
            Подать заявку
          </button>
        </div>
      </div>
    </div>
  );
}
