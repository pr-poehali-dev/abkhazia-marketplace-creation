import { useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/ProductCard";
import { HERO_IMAGE, PRODUCTS_IMAGE, DELIVERY_IMAGE, categories, products } from "@/data/mockData";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: any) => void;
}

export default function HomePage({ onNavigate, onAddToCart }: HomePageProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-brand-cream">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden mesh-bg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/30 to-brand-dark/80" />

        {/* Floating badges */}
        <div className="absolute top-20 right-8 sm:right-16 glass-card rounded-2xl px-4 py-3 animate-fade-in hidden sm:block">
          <div className="text-white/60 text-xs font-golos mb-0.5">Проверенных продавцов</div>
          <div className="text-white font-bold text-xl font-oswald">248+</div>
        </div>
        <div className="absolute bottom-32 right-8 sm:right-24 glass-card rounded-2xl px-4 py-3 animate-fade-in hidden sm:block" style={{animationDelay: '0.3s'}}>
          <div className="text-white/60 text-xs font-golos mb-0.5">Успешных доставок</div>
          <div className="text-white font-bold text-xl font-oswald">12,400+</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-white/80 text-xs font-golos tracking-wide">Первый маркетплейс Абхазии</span>
            </div>

            <h1 className="font-oswald text-5xl sm:text-7xl font-bold text-white leading-none mb-4 animate-fade-up animate-fade-up-delay-1">
              Лучшие товары
              <br />
              <span className="shimmer-text">Абхазии</span>
              <br />
              <span className="text-white">у вас дома</span>
            </h1>
            <p className="text-white/60 text-lg font-golos max-w-xl mb-10 animate-fade-up animate-fade-up-delay-2">
              Натуральный мёд, домашняя аджика, местные вина — всё с доставкой. Только проверенные продавцы.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-fade-up-delay-3">
              <button
                onClick={() => onNavigate("catalog")}
                className="px-8 py-4 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-2xl text-base transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-gold/30"
              >
                Перейти в каталог →
              </button>
              <button
                onClick={() => onNavigate("sellers")}
                className="px-8 py-4 glass-card hover:bg-white/15 text-white font-golos font-medium rounded-2xl text-base transition-all"
              >
                Наши продавцы
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14 animate-fade-up animate-fade-up-delay-4">
              {[
                { num: "1500+", label: "Товаров" },
                { num: "248", label: "Продавцов" },
                { num: "4.9★", label: "Средний рейтинг" },
                { num: "1-3", label: "Дня доставка" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold font-oswald text-brand-gold">{s.num}</div>
                  <div className="text-white/50 text-xs font-golos">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-oswald text-3xl font-bold text-foreground">Категории</h2>
            <p className="text-muted-foreground text-sm font-golos mt-1">Выберите то, что вас интересует</p>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="text-brand-green hover:text-green-700 text-sm font-golos font-medium flex items-center gap-1"
          >
            Все <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => onNavigate("catalog")}
              className="bg-white hover:bg-brand-green group rounded-2xl p-4 text-center transition-all hover:scale-105 hover:shadow-lg border border-border hover:border-brand-green"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-xs font-golos font-semibold text-foreground group-hover:text-white leading-tight">{cat.name}</div>
              <div className="text-[10px] text-muted-foreground group-hover:text-white/60 font-golos mt-0.5">{cat.count} тов.</div>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-oswald text-3xl font-bold text-foreground">Популярное</h2>
            <p className="text-muted-foreground text-sm font-golos mt-1">Самые продаваемые товары</p>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="text-brand-green hover:text-green-700 text-sm font-golos font-medium flex items-center gap-1"
          >
            Смотреть все <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onClick={() => onNavigate("catalog")}
            />
          ))}
        </div>
      </section>

      {/* Delivery banner */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${DELIVERY_IMAGE})` }}
          />
          <div className="relative mesh-bg rounded-3xl p-8 sm:p-12 grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark rounded-full px-3 py-1 text-xs font-bold font-golos mb-4">
                ⚡ Быстрая доставка
              </div>
              <h2 className="font-oswald text-4xl font-bold text-white mb-4">
                Доставляем<br />по всей Абхазии
              </h2>
              <p className="text-white/60 font-golos mb-6">
                Курьерская, личная доставка от продавца и самовывоз. Отслеживайте заказ в реальном времени.
              </p>
              <div className="flex flex-wrap gap-3">
                {["🛵 Курьер", "🤝 Личная доставка", "🏪 Самовывоз", "⚡ Экспресс"].map((m) => (
                  <span key={m} className="glass-card text-white text-sm px-3 py-1.5 rounded-full font-golos">
                    {m}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onNavigate("delivery")}
                className="mt-6 px-6 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-xl transition-all hover:scale-105"
              >
                Подробнее о доставке
              </button>
            </div>
            <div className="hidden sm:flex justify-center">
              <img src={DELIVERY_IMAGE} alt="Доставка" className="w-72 h-72 object-cover rounded-2xl opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Products showcase */}
      <section className="py-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-white border border-border p-8 grid sm:grid-cols-2 gap-8 items-center">
          <img src={PRODUCTS_IMAGE} alt="Товары Абхазии" className="w-full h-64 object-cover rounded-2xl" />
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-brand-green rounded-full px-3 py-1 text-xs font-bold font-golos mb-4">
              <Icon name="BadgeCheck" size={13} /> Проверено командой
            </div>
            <h2 className="font-oswald text-3xl font-bold text-foreground mb-4">
              Только настоящие товары из Абхазии
            </h2>
            <p className="text-muted-foreground font-golos mb-4">
              Каждый продавец проходит верификацию — мы проверяем документы и реальное нахождение в Абхазии. Гарантируем подлинность.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Проверка паспорта и ИНН",
                "Реальная съёмка товаров",
                "Система отзывов покупателей",
                "Гарантия возврата"
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-golos text-foreground">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={11} className="text-brand-green" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate("sellers")}
              className="px-6 py-3 bg-brand-green hover:bg-green-700 text-white font-bold font-golos rounded-xl transition-all hover:scale-105"
            >
              Наши продавцы
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-brand-dark">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="font-oswald text-3xl font-bold text-white mb-3">
            Получайте лучшие предложения
          </h2>
          <p className="text-white/50 font-golos mb-6">
            Подпишитесь на рассылку и узнавайте о скидках первыми
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 font-golos text-sm focus:outline-none focus:border-brand-gold"
            />
            <button className="px-5 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-xl transition-all hover:scale-105">
              Подписаться
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center text-brand-dark font-oswald font-bold">А</div>
            <span className="text-white font-oswald font-bold">АбхазМаркет</span>
          </div>
          <div className="text-white/30 text-sm font-golos text-center">
            © 2026 АбхазМаркет. Первый маркетплейс Абхазии
          </div>
          <div className="flex gap-4">
            {["Условия", "Конфиденциальность", "Помощь"].map((l) => (
              <button key={l} className="text-white/40 hover:text-white text-sm font-golos transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
