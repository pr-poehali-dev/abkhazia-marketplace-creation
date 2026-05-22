import { useState } from "react";
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
import { cartItems as initialCart } from "@/data/mockData";

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
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: { id: number; name: string; price: number; image: string; seller: string; verified: boolean }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image,
        seller: product.seller,
        verified: product.verified,
      }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const isAdminPage = currentPage === "admin";

  return (
    <div className="min-h-screen font-golos">
      {!isAdminPage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        />
      )}

      <main>
        {currentPage === "home" && (
          <HomePage onNavigate={navigate} onAddToCart={addToCart} />
        )}
        {currentPage === "catalog" && (
          <CatalogPage onAddToCart={addToCart} />
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
