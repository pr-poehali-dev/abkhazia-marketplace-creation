import { useState } from "react";
import Icon from "@/components/ui/icon";
import { orders } from "@/data/mockData";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Иван Козленко",
    phone: "+7 940 123-45-67",
    email: "ivan.kozlenko@mail.ru",
    address: "Сухум, ул. Ленина, 45, кв. 12",
  });

  const tabs = [
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "tracking", label: "Отслеживание", icon: "MapPin" },
    { id: "reviews", label: "Отзывы", icon: "Star" },
    { id: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Header */}
      <div className="mesh-bg py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-2xl font-oswald font-bold text-brand-dark flex-shrink-0">
            ИК
          </div>
          <div>
            <h1 className="font-oswald text-3xl font-bold text-white">{profile.name}</h1>
            <p className="text-white/50 font-golos text-sm">{profile.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="badge-verified badge-gold">
                ★ Постоянный покупатель
              </span>
              <span className="text-white/40 text-xs font-golos">
                {orders.length} заказов
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-golos font-medium border-b-2 transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={tab.icon as any} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-oswald text-2xl font-bold text-foreground">Мои заказы</h2>
              <span className="text-sm text-muted-foreground font-golos">{orders.length} заказа</span>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center text-xl flex-shrink-0">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-oswald font-bold text-foreground">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-golos font-medium ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                        {order.statusLabel}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-golos mt-1">
                      {order.date} · {order.seller} · {order.items.length} товар(а)
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold font-golos text-foreground">{order.total.toLocaleString()} ₽</div>
                    <div className="text-xs text-muted-foreground font-golos">{order.delivery}</div>
                  </div>
                  <Icon name={expandedOrder === order.id ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0" />
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t border-border p-5 space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm font-golos">
                          <span className="text-foreground">{item.name} × {item.qty}</span>
                          <span className="text-muted-foreground">{(item.price * item.qty).toLocaleString()} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3 space-y-1 text-xs font-golos text-muted-foreground">
                      <div>📍 {order.address}</div>
                      <div>🚚 {order.delivery}</div>
                    </div>
                    <button
                      onClick={() => setActiveTab("tracking")}
                      className="text-sm font-golos text-brand-green hover:text-green-700 flex items-center gap-1"
                    >
                      <Icon name="MapPin" size={14} />
                      Отследить заказ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === "tracking" && (
          <div className="space-y-6">
            <h2 className="font-oswald text-2xl font-bold text-foreground">Отслеживание заказов</h2>
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="font-oswald font-bold text-foreground text-lg">{order.id}</span>
                    <div className="text-xs text-muted-foreground font-golos mt-0.5">{order.seller}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-golos font-medium ${statusColors[order.status]}`}>
                    {order.statusLabel}
                  </span>
                </div>
                <div className="relative">
                  {order.trackingSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          step.done ? "bg-brand-green text-white" : "bg-muted border-2 border-border text-muted-foreground"
                        }`}>
                          {step.done ? <Icon name="Check" size={14} /> : <span className="text-xs font-golos">{i + 1}</span>}
                        </div>
                        {i < order.trackingSteps.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-1 ${step.done ? "bg-brand-green" : "bg-border"}`} />
                        )}
                      </div>
                      <div className={`pb-2 ${step.done ? "tracking-step completed" : "tracking-step"}`}>
                        <div className={`font-golos font-semibold text-sm ${step.done ? "text-brand-green" : "text-muted-foreground"}`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-muted-foreground font-golos">{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold text-foreground">Мои отзывы</h2>
            <div className="bg-white rounded-2xl border border-border p-10 text-center">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-oswald text-xl font-bold text-foreground mb-2">У вас пока нет отзывов</h3>
              <p className="text-muted-foreground font-golos text-sm mb-4">
                После получения заказа вы сможете оставить отзыв о товаре
              </p>
              <button
                onClick={() => onNavigate("reviews")}
                className="px-5 py-2.5 bg-brand-green text-white font-golos font-medium rounded-xl hover:bg-green-700 transition-all"
              >
                Смотреть отзывы других
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-oswald text-2xl font-bold text-foreground">Мой профиль</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-golos hover:bg-muted transition-all"
              >
                <Icon name={isEditing ? "X" : "Pencil"} size={14} />
                {isEditing ? "Отмена" : "Редактировать"}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              {Object.entries(profile).map(([key, value]) => {
                const labels: Record<string, string> = {
                  name: "Имя", phone: "Телефон", email: "Email", address: "Адрес",
                };
                return (
                  <div key={key}>
                    <label className="text-xs font-golos text-muted-foreground uppercase tracking-wide">{labels[key]}</label>
                    {isEditing ? (
                      <input
                        value={value}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <div className="mt-1 font-golos text-foreground">{value}</div>
                    )}
                  </div>
                );
              })}
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
                >
                  Сохранить изменения
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-golos font-bold text-foreground mb-3">Безопасность</h3>
              <button className="text-sm font-golos text-brand-green hover:text-green-700">Изменить пароль</button>
            </div>

            <button className="w-full py-3 border border-destructive/30 text-destructive font-golos rounded-2xl hover:bg-destructive/5 transition-all flex items-center justify-center gap-2">
              <Icon name="LogOut" size={16} />
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
