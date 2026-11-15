import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  Trash,
  ShoppingBag,
  WhatsappLogo,
  Sparkle,
  User,
} from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../data/config";

export default function CartDrawer() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    totalPrice,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  // حقول معلومات العميلة الاختيارية لتضمينها في رسالة الواتساب
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem("khodlak_customer_name") || "";
  });
  const [customerAddress, setCustomerAddress] = useState(() => {
    return localStorage.getItem("khodlak_customer_address") || "";
  });
  const [orderNotes, setOrderNotes] = useState(() => {
    return localStorage.getItem("khodlak_customer_notes") || "";
  });

  // حفظ بيانات العميلة المدخلة لتسهيل الطلبات المتكررة
  useEffect(() => {
    try {
      localStorage.setItem("khodlak_customer_name", customerName);
      localStorage.setItem("khodlak_customer_address", customerAddress);
      localStorage.setItem("khodlak_customer_notes", orderNotes);
    } catch (e) {
      console.error(e);
    }
  }, [customerName, customerAddress, orderNotes]);

  // قفل التمرير عند فتح السلة
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // توليد رسالة واتساب منسقة واحترافية
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let itemsText = "";
    cart.forEach((item, index) => {
      const itemTotal = (Number(item.price) || 0) * item.quantity;
      itemsText += `\n${index + 1}. [كود: ${item.code}] ${item.name}
   القسم: ${item.category} | الكمية: ${item.quantity} × ${item.price} ج.م = ${itemTotal} ج.م`;
    });

    let customerInfo = "";
    if (customerName.trim()) {
      customerInfo += `\n👤 اسم العميلة: ${customerName.trim()}`;
    }
    if (customerAddress.trim()) {
      customerInfo += `\n📍 عنوان التوصيل / المحافظة: ${customerAddress.trim()}`;
    }
    if (orderNotes.trim()) {
      customerInfo += `\n📝 ملاحظات ومقاسات: ${orderNotes.trim()}`;
    }

    const message = `مرحباً براند "خدلك لفة" 🌸
أود تأكيد طلب مشتريات جديد من الكتالوج:
━━━━━━━━━━━━━━━━━${itemsText}
━━━━━━━━━━━━━━━━━
💰 إجمالي المنتجات: ${totalPrice} ج.م
🛍️ عدد القطع: ${totalItemsCount} قطعة${customerInfo ? `\n━━━━━━━━━━━━━━━━━${customerInfo}` : ""}

أرجو تأكيد الطلب وتحديد موعد ومصاريف الشحن. شكراً لكم! ✨`;

    const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-pink-100 animate-slideInRight"
      >
        {/* هيدر السلة */}
        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-[#FDF3F6]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <ShoppingBag weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-primary">سلة المشتريات</h2>
              <span className="text-xs text-gray-500 font-medium">
                {totalItemsCount} {totalItemsCount === 1 ? "قطعة مختارة" : "قطع مختارة"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-bold px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                title="تفريغ السلة بالكامل"
              >
                مسح الكل
              </button>
            )}
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="إغلاق السلة"
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white rounded-full transition-all cursor-pointer"
            >
              <X weight="bold" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* محتوى السلة */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            /* حالة السلة الفارغة */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-pink-50 border-2 border-dashed border-secondary/40 flex items-center justify-center text-secondary">
                <ShoppingBag weight="duotone" className="w-10 h-10 opacity-70" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-800">
                  سلتك فارغة حالياً
                </h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  تصفحي كولكشن الملابس والأطفال والإكسسوارات واختاري ما يناسبك بضغطة واحدة!
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>تصفحي الكتالوج الآن</span>
                <Sparkle weight="duotone" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* قائمة المنتجات في السلة */
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-pink-100/80 shadow-2xs hover:border-pink-200 transition-colors"
                >
                  {/* صورة المنتج */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";
                    }}
                  />

                  {/* التفاصيل */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-black/80 text-white rounded-md tracking-wider">
                        #{item.code}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>

                    <div className="text-xs font-black text-primary mt-1">
                      {item.price * item.quantity} ج.م
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-gray-400 font-normal mr-1">
                          ({item.price} ج.م للقطعة)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* أزرار زيادة ونقصان وحذف */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.code)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="حذف من السلة"
                    >
                      <Trash weight="duotone" className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.code, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Minus weight="bold" className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-black text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.code, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Plus weight="bold" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* قسم بيانات العميل الاختيارية */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2.5">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                  <User weight="duotone" className="w-3.5 h-3.5 text-secondary" />
                  بيانات التوصيل (اختيارية لتسريع الطلب):
                </span>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="اسمك الكريم (مثال: سارة محمد)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-secondary outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="العنوان والمحافظة (مثال: مدينة نصر - القاهرة)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-secondary outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ملاحظات إضافية (المقاس المطلوب / الألوان)"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* فوتر السلة وزر الطلب عبر واتساب */}
        {cart.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>عدد المنتجات:</span>
                <span className="font-bold">{totalItemsCount} قطعة</span>
              </div>
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-gray-900 pt-1 border-t border-gray-200">
                <span>إجمالي الطلب:</span>
                <span className="text-primary">{totalPrice} جنيه</span>
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                * تكلفة الشحن يتم تحديدها بالتنسيق عبر الواتساب حسب منطقتك
              </p>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <WhatsappLogo weight="duotone" className="w-5 h-5" />
              <span>إتمام الطلب عبر واتساب</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
