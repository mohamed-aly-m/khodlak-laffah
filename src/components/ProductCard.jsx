import React, { useState } from "react";
import { ShoppingBag, Prohibit, Eye, Images } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { getCategoryBadgeClass } from "../utils/categoryStyles";

export default function ProductCard({ product, onOpenModal }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.available === "لا";
  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  // الصورة الرئيسية المعروضة
  const displayImage =
    (product.images && product.images.length > 0 ? product.images[0] : product.image_url) ||
    product.image;
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleCardClick = (e) => {
    // عدم فتح النافذة إذا تم الضغط مباشرة على زر إضافة للسلة
    if (e.target.closest("button.action-btn")) return;
    onOpenModal(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-pink-100/80 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${
        isOutOfStock ? "opacity-85" : "hover:-translate-y-1"
      }`}
    >
      {/* حاوية الصورة بنسبة أبعاد مثالية للملابس aspect-[4/5] */}
      <div className="aspect-[4/5] relative overflow-hidden rounded-t-2xl bg-pink-50/40">
        <img
          src={
            imageError
              ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
              : displayImage
          }
          alt={product.name}
          loading="lazy"
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? "grayscale-[40%]" : ""
          }`}
        />

        {/* الزاوية العلوية اليمنى: شارة نسبة الخصم فقط إن وجدت لمنع التداخل */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-secondary text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              خصم {discountPercent}%
            </span>
          </div>
        )}

        {/* الزاوية العلوية اليسرى: شارة الكود بتصميم زجاجي شفاف */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-white/85 backdrop-blur-md text-primary text-[11px] font-bold px-2 py-0.5 rounded-lg border border-white/60 shadow-2xs tracking-wider">
            CODE: {product.code}
          </span>
        </div>

        {/* الزاوية السفلية اليسرى: شارة تعدد الصور إن توفرت أكثر من صورة */}
        {hasMultipleImages && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-black/55 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/20">
              <Images weight="duotone" className="w-3.5 h-3.5" />
              <span>{product.images.length}</span>
            </span>
          </div>
        )}

        {/* شارة نفدت الكمية في الوسط */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-2 z-20">
            <div className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 border border-white/20">
              <Prohibit weight="duotone" className="w-4 h-4" />
              <span>نفدت الكمية</span>
            </div>
          </div>
        )}

        {/* تلميح عرض التفاصيل عند التحويم على الشاشات الكبيرة */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye weight="duotone" className="w-4 h-4" />
            <span>عرض التفاصيل</span>
          </span>
        </div>
      </div>

      {/* تفاصيل المنتج بالأسفل p-3 */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* شارة القسم فوق الاسم بخط صغير وأنيق */}
          <div className="mb-1">
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                product.category
              )}`}
            >
              {product.category}
            </span>
          </div>

          {/* اسم المنتج بحد أقصى سطرين */}
          <h3 className="line-clamp-2 font-bold text-gray-800 text-sm leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>

        <div>
          {/* السعر الحالي والسعر القديم مشطوباً */}
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-primary font-extrabold text-base">
              {product.price} <span className="text-xs font-bold">ج.م</span>
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.old_price} ج.م
              </span>
            )}
          </div>

          {/* زر أضف للسلة بتصميم عصري ممتلئ هادئ بصرياً */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full mt-2.5 py-2 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-gray-200"
            >
              <Prohibit weight="duotone" className="w-4 h-4" />
              <span>غير متاح</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="action-btn w-full mt-2.5 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag weight="duotone" className="w-4 h-4" />
              <span>أضف للسلة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
