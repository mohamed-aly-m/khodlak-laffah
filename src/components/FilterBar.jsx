import React from "react";
import {
  MagnifyingGlass,
  X,
  SquaresFour,
  CaretDown,
} from "@phosphor-icons/react";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalCount,
  onOpenCategoryDrawer,
}) {
  const currentCategoryLabel =
    selectedCategory === "all" ? "الكل" : selectedCategory;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-3 pb-2 space-y-2.5">
      {/* صف البحث وزر فتح القائمة الجانبية للأقسام */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* شريط البحث الذكي */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <MagnifyingGlass
              weight="duotone"
              className="w-5 h-5 text-secondary"
            />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي بالاسم أو الكود (مثال: 2035 أو شنطة)..."
            className="w-full pr-11 pl-10 py-2.5 sm:py-3 rounded-2xl bg-white shadow-xs border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="مسح البحث"
            >
              <X
                weight="bold"
                className="w-4 h-4 bg-gray-100 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              />
            </button>
          )}
        </div>

        {/* زر فتح قائمة الأقسام الجانبية أعلى المنتجات */}
        <button
          onClick={onOpenCategoryDrawer}
          aria-label="فتح قائمة الأقسام"
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white hover:bg-pink-50/80 border border-pink-200 shadow-xs hover:border-primary/40 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <SquaresFour weight="duotone" className="w-5 h-5 text-primary shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-gray-800 hidden xs:inline">
            الأقسام
          </span>
          <span className="text-[11px] sm:text-xs bg-primary text-white font-bold px-2.5 py-0.5 rounded-lg shadow-2xs max-w-[85px] sm:max-w-[125px] truncate">
            {currentCategoryLabel}
          </span>
          <CaretDown weight="bold" className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* ملخص النتائج والفلاتر */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            عرض <strong className="text-primary font-bold">{totalCount}</strong> منتج
            {selectedCategory !== "all" && (
              <span> في قسم <strong className="text-primary font-bold">"{selectedCategory}"</strong></span>
            )}
            {searchQuery && (
              <span> يطابق <strong className="text-primary font-bold">"{searchQuery}"</strong></span>
            )}
          </span>

          {/* زر تغيير القسم السريع عند تفعيل قسم معين */}
          {selectedCategory !== "all" && (
            <button
              onClick={onOpenCategoryDrawer}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-primary bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/80 cursor-pointer transition-colors"
            >
              <span>تغيير القسم</span>
              <CaretDown weight="bold" className="w-3 h-3" />
            </button>
          )}
        </div>

        {(searchQuery || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-secondary hover:text-primary font-bold cursor-pointer underline text-xs transition-colors shrink-0"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}
