import { useState } from "react";
import Icon from "@/components/ui/icon";
import { deliveryMethods } from "@/data/mockData";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  seller: string;
  verified: boolean;
}

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onNavigate: (page: string) => void;
}

export default function CartPage({ cart, onUpdateQty, onRemove, onNavigate }: CartPageProps) {
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod);
  const deliveryCost = selectedDelivery?.price || 0;
  const total = subtotal + deliveryCost;

  if (step === "success") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full border border-border animate-scale-in shadow-xl">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-brand-green" />
          </div>
          <h2 className="font-oswald text-3xl font-bold text-foreground mb-2">Заказ оформлен!</h2>
          <p className="text-muted-foreground font-golos mb-1">Номер заказа</p>
          <div className="text-brand-green font-oswald font-bold text-2xl mb-4">
            ABK-{Math.floor(Math.random() * 9000) + 1000}
          </div>
          <p className="text-sm text-muted-foreground font-golos mb-8">
            Вы можете отслеживать статус заказа в личном кабинете
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("profile")}
              className="w-full py-3 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
            >
              Мои заказы
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="w-full py-3 bg-muted text-foreground font-golos rounded-xl hover:bg-gray-200 transition-all"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-oswald text-3xl font-bold text-foreground mb-3">Корзина пуста</h2>
          <p className="text-muted-foreground font-golos mb-6">Добавьте товары из каталога</p>
          <button
            onClick={() => onNavigate("catalog")}
            className="px-6 py-3 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all"
          >
            В каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="bg-brand-dark py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-oswald text-4xl font-bold text-white mb-1">
            {step === "cart" ? "Корзина" : "Оформление заказа"}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            {["cart", "checkout"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-golos transition-all ${
                  step === s ? "bg-brand-gold text-brand-dark" :
                  (step === "checkout" && s === "cart") ? "bg-brand-green text-white" :
                  "bg-white/20 text-white/40"
                }`}>
                  {(step === "checkout" && s === "cart") ? <Icon name="Check" size={13} /> : i + 1}
                </div>
                <span className={`text-xs font-golos ${step === s ? "text-brand-gold" : "text-white/40"}`}>
                  {s === "cart" ? "Корзина" : "Доставка и оплата"}
                </span>
                {i < 1 && <Icon name="ChevronRight" size={14} className="text-white/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {step === "cart" ? (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-border flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-brand-cream flex items-center justify-center text-3xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-golos font-semibold text-foreground text-sm leading-snug mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground font-golos">{item.seller}</span>
                        {item.verified && (
                          <span className="badge-verified">✓</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                      <span className="w-6 text-center font-golos font-bold text-sm">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold font-golos text-foreground">{(item.price * item.qty).toLocaleString()} ₽</div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-muted-foreground hover:text-destructive font-golos transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Delivery */}
                <div className="bg-white rounded-2xl p-6 border border-border">
                  <h2 className="font-golos font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Icon name="Truck" size={20} className="text-brand-green" />
                    Способ доставки
                  </h2>
                  <div className="space-y-3">
                    {deliveryMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          deliveryMethod === method.id ? "border-brand-green bg-green-50" : "border-border hover:border-brand-green/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={method.id}
                          checked={deliveryMethod === method.id}
                          onChange={() => setDeliveryMethod(method.id)}
                          className="mt-0.5 accent-brand-green"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="font-golos font-semibold text-foreground text-sm">{method.label}</div>
                          <div className="text-xs text-muted-foreground font-golos">{method.description}</div>
                          <div className="text-xs text-brand-teal font-golos mt-0.5">⏱ {method.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold font-golos text-foreground">
                            {method.price === 0 ? "Бесплатно" : `${method.price} ₽`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contacts */}
                <div className="bg-white rounded-2xl p-6 border border-border">
                  <h2 className="font-golos font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Icon name="User" size={20} className="text-brand-green" />
                    Контактные данные
                  </h2>
                  <div className="space-y-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green" />
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес доставки" className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green" />
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий к заказу (необязательно)" rows={2} className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green resize-none" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h2 className="font-golos font-bold text-foreground text-lg mb-4">Итого</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm font-golos">
                  <span className="text-muted-foreground">Товары ({cart.reduce((s, i) => s + i.qty, 0)} шт.)</span>
                  <span>{subtotal.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm font-golos">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={deliveryCost === 0 ? "text-brand-green font-medium" : ""}>
                    {deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} ₽`}
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold font-golos text-lg">
                <span>Всего</span>
                <span className="text-brand-green">{total.toLocaleString()} ₽</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (step === "cart") setStep("checkout");
                else setStep("success");
              }}
              className="w-full py-4 bg-brand-green hover:bg-green-700 text-white font-bold font-golos rounded-2xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-900/20"
            >
              {step === "cart" ? "Перейти к оформлению" : "Подтвердить заказ"}
            </button>

            {step === "checkout" && (
              <button
                onClick={() => setStep("cart")}
                className="w-full py-3 border border-border text-foreground font-golos rounded-2xl hover:bg-muted transition-all text-sm"
              >
                ← Назад в корзину
              </button>
            )}

            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground font-golos">
              <Icon name="Shield" size={13} className="text-brand-green" />
              Защищённая обработка данных
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
