import React, { useEffect } from "react";
import {
  X,
  SquaresFour,
  Sparkle,
  Dress,
  TShirt,
  BaseballCap,
  Heart,
  Crown,
  Wind,
  Handbag,
  Sneaker,
  FlowerLotus,
  Check,
} from "@phosphor-icons/react";

export default function CategoryDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  categoryCounts = {},
}) {
  // قائمة الأقسام الرسمية الـ 10 بالترتيب الدقيق مع الأيقونات والألوان
  const categories = [
    {
      id: "all",
      name: "الكل",
      icon: Sparkle,
      bgClass: "bg-pink-100",
      textClass: "text-primary",
    },
    {
      id: "ملابس حريمي",
      name: "ملابس حريمي",
      icon: Dress,
      bgClass: "bg-pink-100",
      textClass: "text-[#D85A8B]",
    },
    {
      id: "ملابس رجالي",
      name: "ملابس رجالي",
      icon: TShirt,
      bgClass: "bg-blue-100",
      textClass: "text-[#1E3A5F]",
    },
    {
      id: "ملابس اولاد",
      name: "ملابس اولاد",
      icon: BaseballCap,
      bgClass: "bg-sky-100",
      textClass: "text-[#2B6CB0]",
    },
    {
      id: "ملابس بنات",
      name: "ملابس بنات",
      icon: Heart,
      bgClass: "bg-rose-100",
      textClass: "text-[#BE123C]",
    },
    {
      id: "إكسسوارات",
      name: "إكسسوارات",
      icon: Crown,
      bgClass: "bg-purple-100",
      textClass: "text-[#6B3BA7]",
    },
    {
      id: "شنط",
      name: "شنط",
      icon: Handbag,
      bgClass: "bg-amber-100",
      textClass: "text-amber-700",
    },
    {
      id: "أحذية",
      name: "أحذية",
      icon: Sneaker,
      bgClass: "bg-teal-100",
      textClass: "text-teal-700",
    },
    {
      id: "الطرح الحريمي",
      name: "الطرح الحريمي",
      icon: Wind,
      bgClass: "bg-purple-100",
      textClass: "text-purple-700",
    },
    {
      id: "العناية والجمال",
      name: "العناية والجمال",
      icon: FlowerLotus,
      bgClass: "bg-rose-100",
      textClass: "text-rose-700",
    },
  ];

  // قفل التمرير عند فتح القائمة الجانبية وإغلاقها بزر Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* خلفية معتمة خفيفة تغلق القائمة عند الضغط خارجها */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* القائمة الجانبية اليمنى المنزلقة */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="أقسام المتجر"
        className={`fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* رأس القائمة الجانبية */}
        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/80 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <SquaresFour weight="duotone" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                أقسام المتجر
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                اختاري القسم لتصفح المنتجات
              </p>
            </div>
          </div>

          {/* زر الإغلاق X */}
          <button
            onClick={onClose}
            aria-label="إغلاق قائمة الأقسام"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* قائمة الأقسام الـ 10 عمودياً كبطاقات أنيقة ومريحة للمس */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-98 border ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 border-primary"
                    : "bg-white hover:bg-pink-50/60 text-gray-800 border-pink-100/80 hover:border-secondary/30 shadow-2xs"
                }`}
              >
                {/* على اليمين: مربع صغير ملون يحتوي على أيقونة القسم + اسم القسم */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : `${cat.bgClass} ${cat.textClass}`
                    }`}
                  >
                    <Icon weight="duotone" className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm font-bold truncate ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>

                {/* على اليسار: عداد المنتجات المتاحة في هذا القسم وعلامة تأكيد إن كان مختاراً */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isActive && (
                    <Check weight="bold" className="w-4 h-4 text-white" />
                  )}
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold transition-colors ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-pink-50/80 text-gray-600 border border-pink-100"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* تذييل القائمة الجانبية */}
        <div className="p-3 border-t border-pink-100 bg-pink-50/40 text-center">
          <p className="text-xs text-secondary font-bold flex items-center justify-center gap-1.5">
            <Sparkle weight="duotone" className="w-4 h-4 text-secondary" />
            <span>خدلك لفة - اختياراتك دايماً أجمل</span>
          </p>
        </div>
      </aside>
    </>
  );
}
