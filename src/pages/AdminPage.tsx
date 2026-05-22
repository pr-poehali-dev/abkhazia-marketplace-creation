import { useState } from "react";
import Icon from "@/components/ui/icon";
import { products, sellers, orders } from "@/data/mockData";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const adminStats = [
  { label: "Выручка (май)", value: "284,500 ₽", change: "+18%", icon: "TrendingUp", color: "bg-green-100 text-green-700" },
  { label: "Заказов за месяц", value: "1,247", change: "+12%", icon: "Package", color: "bg-blue-100 text-blue-700" },
  { label: "Активных продавцов", value: "248", change: "+5", icon: "Store", color: "bg-yellow-100 text-yellow-700" },
  { label: "Новых пользователей", value: "389", change: "+24%", icon: "Users", color: "bg-purple-100 text-purple-700" },
];

const pendingSellers = [
  { id: 101, name: "Лариса Агрба", location: "Гагра", category: "Косметика", date: "20 мая 2026", docs: true },
  { id: 102, name: "Темур Звамбая", location: "Сухум", category: "Вина", date: "22 мая 2026", docs: false },
  { id: 103, name: "Манана Хагба", location: "Очамчира", category: "Продукты питания", date: "23 мая 2026", docs: true },
];

type AdminTab = "dashboard" | "sellers" | "products" | "orders" | "delivery";

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sellerAction, setSellerAction] = useState<Record<number, string>>({});

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "sellers", label: "Продавцы", icon: "Store" },
    { id: "products", label: "Товары", icon: "ShoppingBag" },
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "delivery", label: "Доставки", icon: "Truck" },
  ];

  const statusColors: Record<string, string> = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Sidebar */}
      <div className="sidebar-admin w-64 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-golos mb-4 transition-colors">
            <Icon name="ArrowLeft" size={14} />
            На сайт
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center font-oswald font-bold text-brand-dark text-sm">А</div>
            <div>
              <div className="text-white font-golos font-bold text-sm">АбхазМаркет</div>
              <div className="text-white/40 text-[10px] font-golos">Панель управления</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-golos transition-all ${
                activeTab === tab.id
                  ? "bg-brand-gold text-brand-dark font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon name={tab.icon as any} size={17} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
            <div>
              <div className="text-white text-xs font-golos font-medium">Администратор</div>
              <div className="text-white/40 text-[10px] font-golos">admin@abkhazmarket.ru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="md:hidden bg-brand-dark px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-golos transition-all ${
                activeTab === tab.id ? "bg-brand-gold text-brand-dark font-bold" : "text-white/60"
              }`}
            >
              <Icon name={tab.icon as any} size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 max-w-6xl">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-oswald text-3xl font-bold text-foreground">Дашборд</h1>
                <div className="text-sm text-muted-foreground font-golos">23 мая 2026</div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {adminStats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon name={stat.icon as any} size={18} />
                      </div>
                      <span className="text-xs font-golos text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="font-oswald text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-golos mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Pending verifications */}
              <div className="bg-white rounded-2xl border border-border p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-oswald text-xl font-bold text-foreground">Заявки на верификацию</h2>
                  <span className="badge-verified bg-brand-coral text-white">{pendingSellers.length} ожидают</span>
                </div>
                <div className="space-y-3">
                  {pendingSellers.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-base flex-shrink-0">👤</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-golos font-semibold text-foreground text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-golos">{s.location} · {s.category} · {s.date}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {s.docs ? (
                          <span className="badge-verified">📄 Документы</span>
                        ) : (
                          <span className="text-xs text-brand-coral font-golos">⚠️ Нет документов</span>
                        )}
                      </div>
                      {sellerAction[s.id] ? (
                        <span className={`text-xs font-golos font-medium px-3 py-1 rounded-full ${sellerAction[s.id] === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {sellerAction[s.id] === "approved" ? "✓ Одобрено" : "✗ Отклонено"}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSellerAction({ ...sellerAction, [s.id]: "approved" })}
                            className="px-3 py-1.5 bg-brand-green text-white text-xs font-golos font-medium rounded-lg hover:bg-green-700 transition-all"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => setSellerAction({ ...sellerAction, [s.id]: "rejected" })}
                            className="px-3 py-1.5 border border-destructive/30 text-destructive text-xs font-golos rounded-lg hover:bg-destructive/5 transition-all"
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-oswald text-xl font-bold text-foreground mb-4">Последние заказы</h2>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                      <div className="font-oswald font-bold text-foreground text-sm">{order.id}</div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground font-golos">{order.seller} · {order.date}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-golos ${statusColors[order.status]}`}>
                        {order.statusLabel}
                      </span>
                      <div className="font-golos font-bold text-sm">{order.total.toLocaleString()} ₽</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SELLERS */}
          {activeTab === "sellers" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-oswald text-3xl font-bold text-foreground">Управление продавцами</h1>
                <button className="px-4 py-2 bg-brand-green text-white font-golos font-medium text-sm rounded-xl hover:bg-green-700 transition-all flex items-center gap-2">
                  <Icon name="Plus" size={15} />
                  Добавить
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-5 bg-muted px-5 py-3 text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-2">Продавец</div>
                  <div>Статус</div>
                  <div>Заказов</div>
                  <div>Действия</div>
                </div>
                {sellers.map((seller) => (
                  <div key={seller.id} className="grid grid-cols-5 px-5 py-4 items-center border-b border-border last:border-0">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-lg">{seller.avatar}</div>
                      <div>
                        <div className="font-golos font-semibold text-foreground text-sm">{seller.name}</div>
                        <div className="text-xs text-muted-foreground font-golos">{seller.location}</div>
                      </div>
                    </div>
                    <div>
                      <span className={`badge-verified ${seller.verifiedLevel === "gold" ? "badge-gold" : ""}`}>
                        {seller.verifiedLevel === "gold" ? "🥇 Золотой" : "✓ Проверен"}
                      </span>
                    </div>
                    <div className="font-golos text-foreground text-sm">{seller.completedOrders}</div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Icon name="Eye" size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Icon name="Pencil" size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-oswald text-3xl font-bold text-foreground">Управление товарами</h1>
                <button className="px-4 py-2 bg-brand-green text-white font-golos font-medium text-sm rounded-xl hover:bg-green-700 transition-all flex items-center gap-2">
                  <Icon name="Plus" size={15} />
                  Добавить товар
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-5 bg-muted px-5 py-3 text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-2">Товар</div>
                  <div>Цена</div>
                  <div>Статус</div>
                  <div>Действия</div>
                </div>
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-5 px-5 py-4 items-center border-b border-border last:border-0">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-cream flex items-center justify-center text-xl">{product.image}</div>
                      <div>
                        <div className="font-golos font-semibold text-foreground text-sm leading-tight">{product.name}</div>
                        <div className="text-xs text-muted-foreground font-golos">{product.seller}</div>
                      </div>
                    </div>
                    <div className="font-golos font-bold text-foreground">{product.price.toLocaleString()} ₽</div>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-golos font-medium ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.inStock ? "В наличии" : "Нет"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Icon name="Pencil" size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div>
              <h1 className="font-oswald text-3xl font-bold text-foreground mb-6">Управление заказами</h1>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-oswald font-bold text-foreground">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-golos font-medium ${statusColors[order.status]}`}>
                          {order.statusLabel}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <select className="text-sm px-3 py-1.5 rounded-lg border border-border font-golos focus:outline-none">
                          <option>Изменить статус</option>
                          <option>Обрабатывается</option>
                          <option>В пути</option>
                          <option>Доставлен</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm font-golos text-muted-foreground">
                      <div><span className="text-foreground font-medium">Продавец:</span> {order.seller}</div>
                      <div><span className="text-foreground font-medium">Доставка:</span> {order.delivery}</div>
                      <div><span className="text-foreground font-medium">Сумма:</span> <span className="text-brand-green font-bold">{order.total.toLocaleString()} ₽</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERY */}
          {activeTab === "delivery" && (
            <div>
              <h1 className="font-oswald text-3xl font-bold text-foreground mb-6">Управление доставками</h1>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "В пути", count: 34, color: "bg-blue-100 text-blue-700" },
                  { label: "Ожидают курьера", count: 12, color: "bg-yellow-100 text-yellow-700" },
                  { label: "Доставлены сегодня", count: 18, color: "bg-green-100 text-green-700" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-border p-5 text-center">
                    <div className={`text-2xl font-oswald font-bold ${s.color.split(' ')[1]} mb-1`}>{s.count}</div>
                    <div className="text-sm text-muted-foreground font-golos">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="font-oswald text-xl font-bold text-foreground mb-2">Карта доставок</h3>
                <p className="text-muted-foreground font-golos text-sm">Интерактивная карта с отображением всех активных доставок — подключается в следующей версии</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
