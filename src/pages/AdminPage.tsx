import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, AdminStats, Order } from "@/lib/api";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AdminTab = "dashboard" | "sellers" | "products" | "orders" | "delivery";

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<Record<string, unknown>[]>([]);
  const [appActions, setAppActions] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminStats(),
      api.getAdminOrders(),
      api.getApplications(),
    ]).then(([s, o, a]) => {
      setStats(s);
      setOrders(o.orders);
      setApplications(a.applications as Record<string, unknown>[]);
    }).finally(() => setLoading(false));
  }, []);

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
  const statusLabels: Record<string, string> = {
    delivered: "Доставлен", shipped: "В пути",
    processing: "Обрабатывается", cancelled: "Отменён",
  };

  const handleReview = async (appId: number, status: string) => {
    await api.reviewApplication(appId, status).catch(() => {});
    setAppActions(prev => ({ ...prev, [appId]: status }));
  };

  const handleOrderStatus = async (orderId: string, status: string) => {
    await api.updateOrderStatus(orderId, status).catch(() => {});
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const statCards = stats ? [
    { label: "Выручка", value: `${stats.revenue.toLocaleString()} ₽`, change: "+18%", icon: "TrendingUp", color: "bg-green-50 text-green-600" },
    { label: "Заказов", value: stats.orders.toLocaleString(), change: "+12%", icon: "Package", color: "bg-blue-50 text-blue-600" },
    { label: "Продавцов", value: stats.sellers.toString(), change: "+5", icon: "Store", color: "bg-amber-50 text-amber-600" },
    { label: "Товаров", value: stats.products.toString(), change: "+8%", icon: "ShoppingBag", color: "bg-purple-50 text-purple-600" },
  ] : [];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--ozon-surface)" }}>
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 hidden md:flex flex-col" style={{ backgroundColor: "#1a2744" }}>
        <div className="p-4 border-b border-white/10">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-golos mb-4 transition-colors">
            <Icon name="ArrowLeft" size={13} /> На сайт
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-oswald" style={{ backgroundColor: "var(--ozon-blue)", color: "white" }}>А</div>
            <div>
              <div className="text-white font-golos font-bold text-sm">АбхазМаркет</div>
              <div className="text-white/40 text-[10px] font-golos">Панель управления</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-golos transition-all ${
                activeTab === tab.id ? "text-white font-semibold" : "text-white/50 hover:text-white hover:bg-white/8"
              }`}
              style={activeTab === tab.id ? { backgroundColor: "var(--ozon-blue)" } : {}}>
              <Icon name={tab.icon as "Package"} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">👤</div>
            <div>
              <div className="text-white text-xs font-golos font-medium">Администратор</div>
              <div className="text-white/40 text-[10px] font-golos">admin@abkhazmarket.ru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile tabs */}
        <div className="md:hidden bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide" style={{ borderColor: "var(--ozon-border)" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-golos transition-all ${
                activeTab === tab.id ? "text-white" : "text-gray-500 bg-gray-50"
              }`}
              style={activeTab === tab.id ? { backgroundColor: "var(--ozon-blue)" } : {}}>
              <Icon name={tab.icon as "Package"} size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 max-w-5xl">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="font-oswald text-2xl font-bold" style={{ color: "var(--ozon-text)" }}>Дашборд</h1>
                <div className="text-sm font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                  {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border h-24 animate-pulse" style={{ borderColor: "var(--ozon-border)" }} />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {statCards.map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--ozon-border)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                          <Icon name={stat.icon as "Package"} size={17} />
                        </div>
                        <span className="text-xs font-golos font-semibold text-green-600">{stat.change}</span>
                      </div>
                      <div className="font-oswald text-xl font-bold" style={{ color: "var(--ozon-text)" }}>{stat.value}</div>
                      <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending applications */}
              {stats && stats.pending_applications > 0 && (
                <div className="bg-white rounded-xl border p-5 mb-5" style={{ borderColor: "var(--ozon-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-oswald text-lg font-bold" style={{ color: "var(--ozon-text)" }}>Заявки на верификацию</h2>
                    <span className="text-xs font-golos font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--ozon-orange)" }}>
                      {stats.pending_applications} ожидает
                    </span>
                  </div>
                  {applications.slice(0, 3).map((app) => {
                    const a = app as { id: number; seller_name: string; location: string; docs_submitted: boolean; created_at: string };
                    return (
                      <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl mb-2" style={{ backgroundColor: "var(--ozon-surface)" }}>
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-base flex-shrink-0">👤</div>
                        <div className="flex-1">
                          <div className="font-golos font-semibold text-sm" style={{ color: "var(--ozon-text)" }}>{a.seller_name}</div>
                          <div className="text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                            {a.location} · {new Date(a.created_at).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                        <span className={`text-xs font-golos px-2 py-0.5 rounded-full ${a.docs_submitted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {a.docs_submitted ? "📄 Доки" : "⚠️ Нет документов"}
                        </span>
                        {appActions[a.id] ? (
                          <span className={`text-xs font-golos font-medium px-3 py-1 rounded-full ${appActions[a.id] === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {appActions[a.id] === "approved" ? "✓ Одобрено" : "✗ Отклонено"}
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleReview(a.id, "approved")}
                              className="px-3 py-1.5 text-white text-xs font-golos font-medium rounded-lg hover:opacity-90 transition-all"
                              style={{ backgroundColor: "var(--ozon-green)" }}>
                              Одобрить
                            </button>
                            <button onClick={() => handleReview(a.id, "rejected")}
                              className="px-3 py-1.5 text-xs font-golos rounded-lg border hover:bg-red-50 transition-all"
                              style={{ borderColor: "#fca5a5", color: "var(--ozon-red)" }}>
                              Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent orders */}
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--ozon-border)" }}>
                <h2 className="font-oswald text-lg font-bold mb-4" style={{ color: "var(--ozon-text)" }}>Последние заказы</h2>
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl mb-2" style={{ backgroundColor: "var(--ozon-surface)" }}>
                    <span className="font-oswald font-bold text-sm" style={{ color: "var(--ozon-text)" }}>{order.id}</span>
                    <div className="flex-1 text-xs font-golos" style={{ color: "var(--ozon-text-secondary)" }}>{order.seller_name}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-golos ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-golos font-bold text-sm" style={{ color: "var(--ozon-text)" }}>{order.total.toLocaleString()} ₽</span>
                  </div>
                ))}
                {orders.length === 0 && !loading && (
                  <p className="text-center py-6 font-golos text-sm" style={{ color: "var(--ozon-text-secondary)" }}>Заказов пока нет</p>
                )}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div>
              <h1 className="font-oswald text-2xl font-bold mb-5" style={{ color: "var(--ozon-text)" }}>Управление заказами</h1>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border h-20 animate-pulse" style={{ borderColor: "var(--ozon-border)" }} />)}</div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "var(--ozon-border)" }}>
                  <div className="text-4xl mb-3">📦</div>
                  <p className="font-golos" style={{ color: "var(--ozon-text-secondary)" }}>Заказов пока нет</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--ozon-border)" }}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-oswald font-bold" style={{ color: "var(--ozon-text)" }}>{order.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-golos ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            defaultValue={order.status}
                            onChange={e => handleOrderStatus(order.id, e.target.value)}
                            className="text-sm px-3 py-1.5 rounded-lg border font-golos outline-none cursor-pointer"
                            style={{ borderColor: "var(--ozon-border)" }}>
                            <option value="processing">Обрабатывается</option>
                            <option value="shipped">В пути</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменён</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-2 mt-3 text-sm font-golos" style={{ color: "var(--ozon-text-secondary)" }}>
                        <div><span style={{ color: "var(--ozon-text)" }} className="font-medium">Продавец:</span> {order.seller_name || "—"}</div>
                        <div><span style={{ color: "var(--ozon-text)" }} className="font-medium">Доставка:</span> {order.delivery_method}</div>
                        <div><span style={{ color: "var(--ozon-text)" }} className="font-medium">Сумма:</span> <span style={{ color: "var(--ozon-blue)" }} className="font-bold">{order.total.toLocaleString()} ₽</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === "sellers" || activeTab === "products" || activeTab === "delivery") && (
            <div>
              <h1 className="font-oswald text-2xl font-bold mb-5" style={{ color: "var(--ozon-text)" }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "var(--ozon-border)" }}>
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-oswald text-xl font-bold mb-2" style={{ color: "var(--ozon-text)" }}>В разработке</h3>
                <p className="font-golos text-sm" style={{ color: "var(--ozon-text-secondary)" }}>
                  Раздел будет готов в следующем обновлении
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
