import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import CategoryDrawer from "./components/CategoryDrawer";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { fetchProductsFromSheet } from "./services/sheetService";
import { useCart } from "./context/CartContext";
import { WHATSAPP_NUMBER } from "./data/config";
import {
  Sparkle,
  ShoppingBag,
  WhatsappLogo,
  Truck,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const { toastMessage, setIsDrawerOpen, totalItemsCount } = useCart();

  // جلب المنتجات عند بدء التشغيل
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProductsFromSheet();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      // إعطاء فرصة لإظهار التحميل السلس
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // حساب أعداد المنتجات في كل قسم
  const categoryCounts = useMemo(() => {
    const counts = {
      all: products.length,
      "ملابس حريمي": 0,
      "ملابس رجالي": 0,
      "ملابس اولاد": 0,
      "ملابس بنات": 0,
      "إكسسوارات": 0,
      "الطرح الحريمي": 0,
      "شنط": 0,
      "أحذية": 0,
      "العناية والجمال": 0,
    };
    products.forEach((p) => {
      const cat = p.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // تصفية المنتجات بناءً على البحث والقسم
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // فلتر القسم
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // فلتر البحث بالاسم أو الكود
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        String(product.code).toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF3F6] text-gray-800 font-sans selection:bg-secondary selection:text-white">
      {/* الهيدر الثابت */}
      <Navbar
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
        selectedCategory={selectedCategory}
      />

      {/* بنر ترحيبي جذاب (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#6A1B4D] via-[#7d1f5b] to-[#6A1B4D] text-white py-6 sm:py-9 px-4 border-b border-[#F5D5E2]/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-pink-100 border border-white/20 mb-1">
              <Sparkle weight="duotone" className="w-4 h-4 text-secondary" />
              <span>أهلاً بكِ في كتالوج خدلك لفة الرسمي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              اختياراتك دايماً أجمل ✨
            </h2>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal">
              أحدث كولكشن من الملابس الحريمي، الرجالي، الأطفال، والإكسسوارات الراقية بأسعار وخامات ممتازة.. اطلبي مباشرة عبر الواتساب!
            </p>
          </div>

          {/* مزايا سريعة */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
              <Truck weight="duotone" className="w-5 h-5 text-pink-200 mb-1" />
              <span className="text-[11px] font-bold">شحن سريع</span>
              <span className="text-[9px] text-pink-200">لكل مصر</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
              <ShieldCheck weight="duotone" className="w-5 h-5 text-pink-200 mb-1" />
              <span className="text-[11px] font-bold">خامات ممتازة</span>
              <span className="text-[9px] text-pink-200">معاينة عند الاستلام</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
              <WhatsappLogo weight="duotone" className="w-5 h-5 text-pink-200 mb-1" />
              <span className="text-[11px] font-bold">طلب واتساب</span>
              <span className="text-[9px] text-pink-200">بكل سهولة</span>
            </div>
          </div>
        </div>

        {/* دوائر جمالية بالخلفية */}
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D85A8B]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 -bottom-12 w-48 h-48 bg-[#B88ED6]/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* شريط البحث والفلترة */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalCount={filteredProducts.length}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
      />

      {/* محتوى المنتجات الرئيسي - شبكة عرض بعمودين على الموبايل */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length === 0 ? (
          /* حالة عدم وجود منتجات مطابقة */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-100 shadow-xs my-6 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 text-secondary flex items-center justify-center">
              <ShoppingBag weight="duotone" className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800">
                لم نجد أي منتجات تطابق بحثك!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                جرّبي البحث باسم آخر أو تأكدي من رقم الكود، أو استعرضي كل الأقسام.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-bold shadow-sm hover:brightness-110 cursor-pointer"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          /* شبكة عرض كروت المنتجات على الموبايل عمودين grid-cols-2 */
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.code}
                product={product}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* زر عائم سريع لفتح السلة على الموبايل في حال وجود عناصر */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm cursor-pointer animate-bounce-subtle"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag weight="duotone" className="w-5 h-5" />
              <span>عرض سلة المشتريات ({totalItemsCount} قطعة)</span>
            </div>
            <span className="bg-white text-primary text-xs px-2.5 py-1 rounded-full font-black">
              إتمام الطلب
            </span>
          </button>
        </div>
      )}

      {/* إشعار التوست السريع عند إضافة منتج */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn border border-white/20">
          <CheckCircle weight="duotone" className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* نافذة تفاصيل المنتج */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* القائمة الجانبية للأقسام */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* سلة المشتريات المنزلقة */}
      <CartDrawer />

      {/* الفوتر */}
      <footer className="bg-white border-t border-pink-100 mt-12 py-8 px-4 text-center">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/logo.png"
              alt="خدلك لفة"
              className="w-10 h-10 rounded-full border border-secondary object-cover"
            />
            <span className="text-xl font-black text-primary">خدلك لفة</span>
          </div>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            ملابس .. أطفال .. إكسسوارات | اختياراتك دايماً أجمل
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-bold text-primary">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <WhatsappLogo weight="duotone" className="w-5 h-5 text-emerald-600" />
              <span>تواصل مع الإدارة عبر واتساب</span>
            </a>
          </div>

          <p className="text-[11px] text-gray-400 pt-3 border-t border-gray-100 flex items-center justify-center gap-1">
            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لـ</span>
            <strong className="text-gray-600">خدلك لفة (Khodlak Laffah)</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
