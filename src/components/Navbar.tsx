import { useState } from "react";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
}

const navLinks = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "sellers", label: "Продавцы" },
  { id: "delivery", label: "Доставка" },
  { id: "contacts", label: "Контакты" },
];

export default function Navbar({ currentPage, onNavigate, cartCount }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-gold flex items-center justify-center text-lg font-oswald font-bold text-brand-dark group-hover:scale-105 transition-transform">
              А
            </div>
            <div className="hidden sm:block">
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-wide">
                АбхазМаркет
              </div>
              <div className="text-white/40 text-[10px] tracking-widest font-golos">
                МАРКЕТПЛЕЙС
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`nav-link text-sm font-golos font-medium transition-colors pb-1 ${
                  currentPage === link.id
                    ? "text-brand-gold active"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/14 text-white/70 hover:text-white text-sm transition-all">
              <Icon name="Search" size={15} />
              <span className="font-golos">Поиск</span>
            </button>

            <button
              onClick={() => onNavigate("cart")}
              className="relative p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] text-[10px] font-bold bg-brand-coral text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate("profile")}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <Icon name="User" size={20} />
            </button>

            <button
              onClick={() => onNavigate("admin")}
              className="hidden sm:flex p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-brand-gold transition-all"
              title="Панель администратора"
            >
              <Icon name="LayoutDashboard" size={18} />
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                className={`block w-full text-left px-2 py-2.5 text-sm font-golos rounded-lg transition-colors ${
                  currentPage === link.id
                    ? "text-brand-gold bg-white/8"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate("admin"); setMobileOpen(false); }}
              className="block w-full text-left px-2 py-2.5 text-sm font-golos text-white/40 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors"
            >
              Панель администратора
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
