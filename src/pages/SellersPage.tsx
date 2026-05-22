import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sellers } from "@/data/mockData";

export default function SellersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "gold" | "standard">("all");

  const filtered = sellers.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "gold" && s.verifiedLevel !== "gold") return false;
    if (filter === "standard" && s.verifiedLevel !== "standard") return false;
    return true;
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="mesh-bg py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark rounded-full px-3 py-1 text-xs font-bold font-golos mb-4">
            <Icon name="BadgeCheck" size={12} /> Система верификации
          </div>
          <h1 className="font-oswald text-5xl font-bold text-white mb-3">Наши продавцы</h1>
          <p className="text-white/60 font-golos max-w-xl mb-6">
            Каждый продавец проходит проверку документов. Золотые продавцы — наивысший уровень доверия.
          </p>

          <div className="relative max-w-xl">
            <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени или городу..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 font-golos focus:outline-none focus:border-brand-gold"
            />
          </div>
        </div>
      </div>

      {/* Verification info */}
      <div className="bg-white border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "FileText", color: "bg-blue-100 text-blue-700", title: "Проверка документов", desc: "Паспорт, ИНН, адрес в Абхазии" },
            { icon: "Camera", color: "bg-green-100 text-green-700", title: "Верификация товаров", desc: "Фото и видео реальной продукции" },
            { icon: "Star", color: "bg-yellow-100 text-yellow-700", title: "Система рейтингов", desc: "Оценки от реальных покупателей" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={item.icon as any} size={18} />
              </div>
              <div>
                <div className="font-golos font-semibold text-foreground text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground font-golos">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {[
            { value: "all", label: "Все продавцы" },
            { value: "gold", label: "🥇 Золотые" },
            { value: "standard", label: "✅ Проверенные" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-golos font-medium transition-all ${
                filter === f.value ? "bg-brand-green text-white" : "bg-white border border-border text-foreground hover:border-brand-green"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-sm text-muted-foreground font-golos ml-2">{filtered.length} продавцов</span>
        </div>

        {/* Sellers grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((seller) => (
            <div key={seller.id} className="bg-white rounded-2xl border border-border overflow-hidden hover-lift">
              <div className={`h-2 ${seller.verifiedLevel === "gold" ? "gradient-gold" : "bg-brand-green"}`} />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center text-2xl flex-shrink-0">
                    {seller.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-oswald font-bold text-foreground text-lg leading-none">{seller.name}</h3>
                      <span className={`badge-verified ${seller.verifiedLevel === "gold" ? "badge-gold" : ""}`}>
                        {seller.verifiedLevel === "gold" ? "🥇 Золотой" : "✓ Проверено"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-golos mt-1">
                      📍 {seller.location} · С {seller.since} года
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-golos mb-4 leading-relaxed">{seller.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Рейтинг", value: `★ ${seller.rating}` },
                    { label: "Отзывы", value: seller.reviews },
                    { label: "Заказов", value: seller.completedOrders.toLocaleString() },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center bg-muted/50 rounded-xl py-2">
                      <div className="font-oswald font-bold text-foreground text-sm">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground font-golos">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground font-golos border-t border-border pt-3">
                  <span>⏱ Отвечает {seller.responseTime}</span>
                  <span>{seller.products} товаров</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a seller CTA */}
        <div className="mt-10 bg-brand-dark rounded-3xl p-8 text-center">
          <div className="text-4xl mb-3">🏪</div>
          <h2 className="font-oswald text-3xl font-bold text-white mb-3">Станьте продавцом</h2>
          <p className="text-white/60 font-golos mb-6 max-w-md mx-auto">
            Зарегистрируйтесь и начните продавать свои товары тысячам покупателей по всей Абхазии
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-xl transition-all hover:scale-105">
              Подать заявку
            </button>
            <button className="px-6 py-3 glass-card hover:bg-white/15 text-white font-golos rounded-xl transition-all">
              Узнать об условиях
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
