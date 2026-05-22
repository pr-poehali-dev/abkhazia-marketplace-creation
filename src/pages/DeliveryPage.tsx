import Icon from "@/components/ui/icon";
import { deliveryMethods, DELIVERY_IMAGE } from "@/data/mockData";

interface DeliveryPageProps {
  onNavigate: (page: string) => void;
}

const zones = [
  { city: "Сухум", time: "1-2 дня", price: "от 150 ₽", express: true },
  { city: "Гагра", time: "1-3 дня", price: "от 200 ₽", express: true },
  { city: "Гудаута", time: "2-3 дня", price: "от 200 ₽", express: false },
  { city: "Новый Афон", time: "2-4 дня", price: "от 250 ₽", express: false },
  { city: "Очамчира", time: "3-4 дня", price: "от 300 ₽", express: false },
  { city: "Ткуарчал", time: "4-5 дней", price: "от 350 ₽", express: false },
];

export default function DeliveryPage({ onNavigate }: DeliveryPageProps) {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden mesh-bg py-16 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${DELIVERY_IMAGE})`, backgroundSize: "cover" }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark rounded-full px-3 py-1 text-xs font-bold font-golos mb-4">
            🚀 Быстрая и надёжная
          </div>
          <h1 className="font-oswald text-5xl sm:text-6xl font-bold text-white mb-4">Доставка по<br />всей Абхазии</h1>
          <p className="text-white/60 font-golos text-lg max-w-xl">
            4 способа доставки — от курьера до личной передачи от продавца. Отслеживайте заказ в реальном времени.
          </p>
        </div>
      </div>

      {/* Delivery methods */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-oswald text-3xl font-bold text-foreground mb-6">Способы доставки</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {deliveryMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-2xl border border-border p-6 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center text-3xl flex-shrink-0">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-oswald font-bold text-foreground text-lg">{method.label}</h3>
                    <div className={`font-bold font-golos text-base ${method.price === 0 ? "text-brand-green" : "text-foreground"}`}>
                      {method.price === 0 ? "Бесплатно" : `${method.price} ₽`}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-golos mt-1">{method.description}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-brand-teal font-golos">
                    <Icon name="Clock" size={13} />
                    {method.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Personal delivery special section */}
        <div className="bg-brand-dark rounded-3xl p-8 mb-12 grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark rounded-full px-3 py-1 text-xs font-bold font-golos mb-4">
              🤝 Уникальная функция
            </div>
            <h2 className="font-oswald text-3xl font-bold text-white mb-4">Личная доставка от продавца</h2>
            <p className="text-white/60 font-golos mb-4">
              Продавец доставляет товар лично — вы можете пообщаться, задать вопросы и узнать больше о продукте прямо при получении.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Бесплатная доставка",
                "Личное знакомство с продавцом",
                "Гарантия подлинности при получении",
                "Возможность попробовать товар",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-golos text-white/80">
                  <div className="w-4 h-4 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={10} className="text-brand-dark" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate("catalog")}
              className="px-6 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-xl transition-all hover:scale-105"
            >
              Найти товары с личной доставкой
            </button>
          </div>
          <div className="hidden sm:flex justify-center">
            <div className="w-48 h-48 rounded-3xl bg-white/10 flex items-center justify-center text-8xl">
              🤝
            </div>
          </div>
        </div>

        {/* Zones */}
        <h2 className="font-oswald text-3xl font-bold text-foreground mb-6">Зоны и сроки доставки</h2>
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-12">
          <div className="grid grid-cols-4 bg-muted px-6 py-3 text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wide">
            <div>Город</div>
            <div>Срок</div>
            <div>Стоимость</div>
            <div>Экспресс</div>
          </div>
          {zones.map((zone, i) => (
            <div
              key={zone.city}
              className={`grid grid-cols-4 px-6 py-4 items-center border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/30" : ""}`}
            >
              <div className="font-golos font-semibold text-foreground">📍 {zone.city}</div>
              <div className="text-sm font-golos text-muted-foreground">{zone.time}</div>
              <div className="text-sm font-golos font-medium text-foreground">{zone.price}</div>
              <div>
                {zone.express ? (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-golos font-medium">
                    ⚡ Доступно
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs font-golos">—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tracking */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Icon name="MapPin" size={22} className="text-brand-green" />
            </div>
            <div>
              <h2 className="font-oswald text-2xl font-bold text-foreground">Отслеживание заказа</h2>
              <p className="text-sm text-muted-foreground font-golos">В реальном времени через личный кабинет</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: "1", label: "Заказ принят", icon: "ShoppingCart", color: "bg-blue-100 text-blue-700" },
              { step: "2", label: "У продавца", icon: "Store", color: "bg-yellow-100 text-yellow-700" },
              { step: "3", label: "В пути", icon: "Truck", color: "bg-orange-100 text-orange-700" },
              { step: "4", label: "Доставлен", icon: "CheckCircle", color: "bg-green-100 text-green-700" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon name={s.icon as any} size={24} />
                </div>
                <div className="text-xs text-muted-foreground font-golos mb-1">Шаг {s.step}</div>
                <div className="font-golos font-semibold text-foreground text-sm">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate("profile")}
              className="px-6 py-3 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
            >
              Отследить мой заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
