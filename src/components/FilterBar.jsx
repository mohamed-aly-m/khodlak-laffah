import React from "react";
import {
  MagnifyingGlass,
  X,
  Sparkle,
  Dress,
  TShirt,
  BaseballCap,
  Heart,
  Crown,
  Handbag,
  Sneaker,
  FlowerLotus,
} from "@phosphor-icons/react";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalCount,
  categoryCounts,
}) {
  const categories = [
    {
      id: "all",
      name: "الكل",
      icon: Sparkle,
    },
    {
      id: "ملابس حريمي",
      name: "ملابس حريمي",
      icon: Dress,
    },
    {
      id: "ملابس رجالي",
      name: "ملابس رجالي",
      icon: TShirt,
    },
    {
      id: "ملابس اولاد",
      name: "ملابس اولاد",
      icon: BaseballCap,
    },
    {
      id: "ملابس بنات",
      name: "ملابس بنات",
      icon: Heart,
    },
    {
      id: "إكسسوارات",
      name: "إكسسوارات",
      icon: Crown,
    },
    {
      id: "شنط",
      name: "شنط",
      icon: Handbag,
    },
    {
      id: "أحذية",
      name: "أحذية",
      icon: Sneaker,
    },
    {
      id: "العناية والجمال",
      name: "العناية والجمال",
      icon: FlowerLotus,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-3 pb-2 space-y-3">
      {/* شريط البحث الأنيق بحواف دائرية وأيقونة بلون secondary */}
      <div className="relative">
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
          placeholder="ابحثي باسم المنتج أو الكود (مثال: 2035 أو شنطة)..."
          className="w-full pr-11 pl-10 py-3 rounded-2xl bg-white shadow-xs border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="مسح البحث"
          >
            <X weight="bold" className="w-4 h-4 bg-gray-100 hover:bg-gray-200 rounded-full p-0.5 transition-colors" />
          </button>
        )}
      </div>

      {/* تصنيفات الأقسام بتصميم كبسولات عصرية مع تمرير سلس بدون scrollbar */}
      <div className="overflow-x-auto scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex items-center gap-2 pb-1 pt-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 border border-primary"
                    : "bg-white/90 text-gray-700 border border-pink-100/80 shadow-2xs hover:border-secondary/40 hover:bg-white"
                }`}
              >
                <Icon
                  weight="duotone"
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-secondary"
                  }`}
                />
                <span className="whitespace-nowrap">{cat.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-pink-50 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ملخص النتائج والفلاتر */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          عرض <strong className="text-primary font-bold">{totalCount}</strong> منتج
          {selectedCategory !== "all" && ` في قسم "${selectedCategory}"`}
          {searchQuery && ` يطابق "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-secondary hover:text-primary font-bold cursor-pointer underline text-xs transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}
