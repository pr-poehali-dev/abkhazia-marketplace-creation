import { useState } from "react";
import Icon from "@/components/ui/icon";
import { faqItems } from "@/data/mockData";

export default function ContactsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const contacts = [
    { icon: "Phone", label: "Телефон", value: "+7 940 000-00-00", sub: "Пн-Пт, 9:00–19:00" },
    { icon: "Mail", label: "Email", value: "support@abkhazmarket.ru", sub: "Ответим в течение суток" },
    { icon: "MapPin", label: "Адрес", value: "г. Сухум, ул. Леона, 12", sub: "Главный офис" },
    { icon: "MessageCircle", label: "Telegram", value: "@AbkhazMarket", sub: "Быстрые ответы" },
  ];

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="mesh-bg py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-oswald text-5xl font-bold text-white mb-3">Контакты и поддержка</h1>
          <p className="text-white/50 font-golos">Готовы помочь вам с любым вопросом</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Contacts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {contacts.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-border p-5 text-center hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Icon name={c.icon as any} size={22} className="text-brand-green" />
              </div>
              <div className="text-xs text-muted-foreground font-golos mb-1">{c.label}</div>
              <div className="font-golos font-semibold text-foreground text-sm">{c.value}</div>
              <div className="text-[11px] text-muted-foreground font-golos mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-oswald text-2xl font-bold text-foreground mb-4">Написать нам</h2>
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-brand-green" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-foreground mb-2">Сообщение отправлено!</h3>
                <p className="text-muted-foreground font-golos text-sm">Мы свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ваше имя"
                    className="px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
                  />
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className="px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green"
                  />
                </div>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green text-foreground"
                >
                  <option value="">Тема обращения</option>
                  <option>Вопрос о заказе</option>
                  <option>Проблема с доставкой</option>
                  <option>Стать продавцом</option>
                  <option>Возврат товара</option>
                  <option>Другое</option>
                </select>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Опишите ваш вопрос подробно..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border font-golos text-sm focus:outline-none focus:border-brand-green resize-none"
                />
                <button
                  onClick={() => setSent(true)}
                  className="w-full py-3.5 bg-brand-green text-white font-bold font-golos rounded-xl hover:bg-green-700 transition-all hover:scale-[1.02]"
                >
                  Отправить сообщение
                </button>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-oswald text-2xl font-bold text-foreground mb-4">Часто задаваемые вопросы</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-golos font-semibold text-foreground text-sm">{item.q}</span>
                    <Icon
                      name="ChevronDown"
                      size={18}
                      className={`text-muted-foreground transition-transform flex-shrink-0 ml-2 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm font-golos text-muted-foreground animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 bg-brand-dark rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-oswald text-xl font-bold text-white mb-1">Быстрый ответ в Telegram</h3>
              <p className="text-white/50 font-golos text-sm mb-4">Наш бот ответит в течение нескольких минут</p>
              <button className="px-5 py-2.5 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold font-golos rounded-xl transition-all hover:scale-105">
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
