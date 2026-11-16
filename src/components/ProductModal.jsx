import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  WhatsappLogo,
  Tag,
  Prohibit,
  CheckCircle,
  CaretRight,
  CaretLeft,
  Images,
  Ruler,
} from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../data/config";
import { getCategoryBadgeClass } from "../utils/categoryStyles";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  // إعادة تعيين الصورة المختارة والكمية والمقاس عند فتح منتج جديد
  useEffect(() => {
    setActiveIndex(0);
    setImgError(false);
    setQuantity(1);
    setSelectedSize("");
  }, [product?.code]);

  useEffect(() => {
    // قفل التمرير بالخلفية عند فتح النافذة
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!product) return null;

  const isOutOfStock = product.available === "لا";
  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  // تجهيز قائمة صور المنتج
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url || product.image].filter(Boolean);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeIndex] || images[0];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setImgError(false);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setImgError(false);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const finalSize = selectedSize.trim() || product.sizes || "مقاس موحد";
    addToCart({ ...product, selectedSize: finalSize }, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const handleDirectWhatsApp = () => {
    const total = (Number(product.price) || 0) * quantity;
    const finalSize = selectedSize.trim() || product.sizes || "مقاس موحد";
    const message = `مرحباً خدلك لفة 🌸
أود طلب المنتج التالي مباشرة:
📌 كود المنتج: [${product.code}]
🛍️ اسم المنتج: ${product.name}
📦 القسم: ${product.category}
📏 المقاس: ${finalSize}
🔢 الكمية: ${quantity}
💰 إجمالي السعر: ${total} ج.م

أرجو تأكيد التوافر وتفاصيل التوصيل. شكراً لك!`;

    const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-100 max-h-[92vh] flex flex-col animate-scaleUp"
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-3 left-3 z-30 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-gray-100"
        >
          <X weight="bold" className="w-5 h-5 text-gray-700" />
        </button>

        {/* محتوى النافذة القابل للتمرير */}
        <div className="overflow-y-auto flex-1 p-0 no-scrollbar">
          {/* قسم المعرض التفاعلي للصورة الرئيسية بدون قص */}
          <div className="relative h-72 sm:h-96 w-full bg-[#FAF6F8] flex items-center justify-center overflow-hidden select-none">
            <img
              src={
                imgError
                  ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                  : currentImage
              }
              alt={`${product.name} - صورة ${activeIndex + 1}`}
              onError={() => setImgError(true)}
              className={`w-full h-full object-contain p-2 transition-all duration-300 ${
                isOutOfStock ? "grayscale-[40%]" : ""
              }`}
            />

            {/* أزرار التنقل الجانبية السريعة (السابق والتالي) إن توفرت أكثر من صورة */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="الصورة السابقة"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-white/60"
                >
                  <CaretRight weight="bold" className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="الصورة التالية"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-white/60"
                >
                  <CaretLeft weight="bold" className="w-4 h-4" />
                </button>

                {/* شارة عداد الصور في الزاوية */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                    <Images weight="duotone" className="w-3.5 h-3.5" />
                    <span>{activeIndex + 1} / {images.length}</span>
                  </span>
                </div>
              </>
            )}

            {/* شارة نسبة الخصم في الزاوية العلوية اليمنى */}
            {hasDiscount && !isOutOfStock && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  خصم {discountPercent}%
                </span>
              </div>
            )}

            {/* شارة الكود في الزاوية السفلية اليمنى */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wider bg-white/90 backdrop-blur-md text-primary border border-white/60 shadow-xs">
                <Tag weight="duotone" className="w-3.5 h-3.5 text-secondary" />
                CODE: {product.code}
              </span>
            </div>

            {/* شارة نفدت الكمية في الوسط */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                <div className="bg-red-600/95 text-white text-sm sm:text-base font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/30">
                  <Prohibit weight="duotone" className="w-5 h-5" />
                  <span>عفواً، نفدت الكمية</span>
                </div>
              </div>
            )}
          </div>

          {/* شريط الصور المصغرة (Thumbnails Strip) أسفل الصورة الرئيسية */}
          {hasMultipleImages && (
            <div className="p-2.5 bg-pink-50/40 border-b border-pink-100 flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar">
              {images.map((imgUrl, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      setImgError(false);
                    }}
                    className={`relative w-14 h-16 sm:w-16 sm:h-18 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer bg-white ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-1 shadow-xs opacity-100 scale-102"
                        : "opacity-60 hover:opacity-100 border border-pink-100/80"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} - مصغرة ${idx + 1}`}
                      className="w-full h-full object-contain p-1 bg-[#FAF6F8]"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* تفاصيل المنتج */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* القسم والحالة */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getCategoryBadgeClass(
                  product.category
                )}`}
              >
                قسم: {product.category}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isOutOfStock ? "غير متوفر" : "متوفر الآن"}
              </span>
            </div>

            {/* اسم المنتج */}
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {product.name}
            </h2>

            {/* السعر */}
            <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {product.price}
              </span>
              <span className="text-sm font-bold text-primary">جنيه مصري</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {product.old_price} ج.م
                </span>
              )}
            </div>

            {/* خانة المقاسات المتاحة بشكل بارز ومميز */}
            {product.sizes && (
              <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-pink-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <Ruler weight="duotone" className="w-4 h-4 text-secondary" />
                    <span>المقاسات المتاحة للقطعة:</span>
                  </div>
                  <span className="text-xs font-black text-primary bg-white px-2.5 py-1 rounded-lg border border-pink-200/80 shadow-2xs">
                    {product.sizes}
                  </span>
                </div>

                {!isOutOfStock && (
                  <div className="flex items-center gap-2 pt-2 border-t border-pink-100/70">
                    <span className="text-[11px] font-bold text-gray-600 whitespace-nowrap">
                      مقاسك المطلوب:
                    </span>
                    <input
                      type="text"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      placeholder={product.sizes.includes(",") || product.sizes.includes("-") ? "اكتبي مقاسك المطلوب هنا..." : "حددي مقاسك أو اتركيها فارغة (اختياري)..."}
                      className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-white border border-pink-200/80 focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* تفاصيل الوصف الكامل */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                وصف ومواصفات المنتج:
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 whitespace-pre-line">
                {product.description || "خامة وجودة ممتازة، تم اختيارها بعناية لتناسب ذوقك الراقي."}
              </p>
            </div>

            {/* التحكم بالكمية إذا كان متوفراً */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-gray-700">الكمية المطلوبة:</span>
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                    aria-label="تقليل الكمية"
                  >
                    <Minus weight="bold" className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-gray-800 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    aria-label="زيادة الكمية"
                  >
                    <Plus weight="bold" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* أزرار الإجراءات السفلية (Footer) */}
        <div className="p-4 bg-gray-50/90 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-3.5 rounded-2xl bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Prohibit weight="duotone" className="w-4 h-4" />
              <span>المنتج غير متوفر حالياً</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-primary hover:bg-[#52143b] active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <CheckCircle weight="duotone" className="w-5 h-5 text-emerald-300 animate-bounce" />
                    <span>تمت الإضافة للسلة!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag weight="duotone" className="w-5 h-5" />
                    <span>إضافة إلى السلة ({product.price * quantity} ج.م)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                title="طلب فوري عبر واتساب"
              >
                <WhatsappLogo weight="duotone" className="w-5 h-5" />
                <span className="hidden sm:inline">طلب فوري عبر واتساب</span>
                <span className="sm:hidden">واتساب سريع</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
