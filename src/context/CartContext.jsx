import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "khodlak_laffah_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // حفظ التغييرات في localStorage تلقائياً
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // إظهار إشعار سريع
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // إضافة منتج للسلة
  const addToCart = (product, quantity = 1) => {
    if (product.available === "لا") {
      showToast("عفواً، هذا المنتج نفدت كميته حالياً");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.code === product.code);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    showToast(`تمت إضافة "${product.name}" إلى السلة 🛍️`);
  };

  // تحديث كمية منتج
  const updateQuantity = (code, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(code);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.code === code ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // حذف منتج من السلة
  const removeFromCart = (code) => {
    setCart((prevCart) => prevCart.filter((item) => item.code !== code));
  };

  // إفراغ السلة
  const clearCart = () => {
    setCart([]);
  };

  // إجمالي عدد القطع
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // إجمالي السعر
  const totalPrice = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
