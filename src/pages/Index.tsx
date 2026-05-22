import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import CartPage from "@/pages/CartPage";
import ProfilePage from "@/pages/ProfilePage";
import SellersPage from "@/pages/SellersPage";
import ReviewsPage from "@/pages/ReviewsPage";
import DeliveryPage from "@/pages/DeliveryPage";
import ContactsPage from "@/pages/ContactsPage";
import AdminPage from "@/pages/AdminPage";
import { api, Product } from "@/lib/api";

type Page = "home" | "catalog" | "cart" | "profile" | "sellers" | "reviews" | "delivery" | "contacts" | "admin";

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

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [seeded, setSeeded] = useState(false);

  // Seed database on first load
  useEffect(() => {
    const key = "abk_seeded";
    if (!localStorage.getItem(key)) {
      api.seedData()
        .then(() => { localStorage.setItem(key, "1"); setSeeded(true); })
        .catch(() => setSeeded(true));
    } else {
      setSeeded(true);
    }
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    // Also sync to backend
    api.addToCart(product.id, 1).catch(() => {});
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image_emoji,
        seller: product.seller_name,
        verified: product.seller_verified,
      }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const toggleFavorite = (productId: number) => {
    api.toggleFavorite(productId).catch(() => {});
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isAdminPage = currentPage === "admin";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!seeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-golos text-gray-500">Загрузка АбхазМаркет...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-golos" style={{ backgroundColor: "var(--ozon-surface)" }}>
      {!isAdminPage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          cartCount={cartCount}
          favCount={favorites.length}
        />
      )}

      <main>
        {currentPage === "home" && (
          <HomePage onNavigate={navigate} onAddToCart={addToCart} />
        )}
        {currentPage === "catalog" && (
          <CatalogPage
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        )}
        {currentPage === "cart" && (
          <CartPage
            cart={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onNavigate={navigate}
          />
        )}
        {currentPage === "profile" && (
          <ProfilePage onNavigate={navigate} />
        )}
        {currentPage === "sellers" && (
          <SellersPage />
        )}
        {currentPage === "reviews" && (
          <ReviewsPage />
        )}
        {currentPage === "delivery" && (
          <DeliveryPage onNavigate={navigate} />
        )}
        {currentPage === "contacts" && (
          <ContactsPage />
        )}
        {currentPage === "admin" && (
          <AdminPage onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}
