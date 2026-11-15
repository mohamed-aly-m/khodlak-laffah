import React from "react";
import { ShoppingBag, Sparkle, SquaresFour } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";

export default function Navbar({ onOpenCategoryDrawer, selectedCategory = "all" }) {
  const { totalItemsCount, setIsDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 w-full glass-header border-b border-pink-100 shadow-xs transition-all duration-200">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* الشعار واسم البراند */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative group shrink-0">
            <img
              src="/logo.png"
              alt="شعار خدلك لفة"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-secondary/35 shadow-md transform group-hover:scale-105 transition-transform duration-200 bg-white shrink-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* نقطة التفاعل الدائرية */}
            <span className="absolute bottom-0 left-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-primary ring-2 ring-white"></span>
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-primary tracking-tight leading-tight">
                خدلك لفة
              </h1>
              <span className="text-[11px] sm:text-xs bg-secondary/10 text-primary px-2 py-0.5 rounded-full font-bold hidden xs:inline-block border border-secondary/20 whitespace-nowrap">
                Khodlak Laffah
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary font-semibold flex items-center gap-1 mt-0.5 truncate">
              <Sparkle weight="duotone" className="w-4 h-4 text-secondary shrink-0" />
              <span>اختياراتك دايماً أجمل</span>
              <span className="text-gray-400 font-normal hidden lg:inline">| ملابس حريمي .. رجالي .. أطفال .. إكسسوارات</span>
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات: زر الأقسام وزر سلة المشتريات */}
        <div className="flex items-center gap-2 shrink-0">
          {/* زر فتح قائمة الأقسام الجانبية في الهيدر */}
          <button
            onClick={onOpenCategoryDrawer}
            aria-label="أقسام المتجر"
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white hover:bg-pink-50 text-gray-800 border border-pink-200 shadow-2xs hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
          >
            <SquaresFour weight="duotone" className="w-5 h-5 text-secondary shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-gray-800 hidden xs:inline">
              الأقسام
            </span>
            <span className="text-[10px] sm:text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold max-w-[75px] sm:max-w-[115px] truncate">
              {selectedCategory === "all" ? "الكل" : selectedCategory}
            </span>
          </button>

          {/* زر سلة المشتريات بحقيبة تسوق عصرية duotone */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="سلة المشتريات"
            className="relative flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-primary to-[#862562] text-white hover:brightness-110 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag weight="duotone" className="w-5 h-5 text-white" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                  {totalItemsCount > 99 ? "+99" : totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden sm:inline">
              السلة
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
