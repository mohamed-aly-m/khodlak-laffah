import React, { useState, useEffect } from "react";
import {
  LockKey,
  MagnifyingGlass,
  Plus,
  Trash,
  FloppyDisk,
  CloudArrowUp,
  ArrowRight,
  SignOut,
  Sparkle,
  CheckCircle,
  Warning,
  Images,
  X,
  Eye,
  CircleNotch,
} from "@phosphor-icons/react";
import {
  verifyLogin,
  searchProductByCode,
  saveProduct,
  deleteProduct,
  uploadProductImage,
} from "../services/adminService";
import { CATEGORIES } from "../data/config";

// قائمة المجلدات التسعة المحددة في Google Drive مع مسمياتها
export const DRIVE_FOLDERS = [
  { id: "Woman", label: "Woman (ملابس حريمي)", category: "ملابس حريمي" },
  { id: "Man", label: "Man (ملابس رجالي)", category: "ملابس رجالي" },
  { id: "Boys", label: "Boys (ملابس اولاد)", category: "ملابس اولاد" },
  { id: "Girls", label: "Girls (ملابس بنات)", category: "ملابس بنات" },
  { id: "Accessories", label: "Accessories (إكسسوارات)", category: "إكسسوارات" },
  { id: "bags", label: "bags (شنط)", category: "شنط" },
  { id: "Shoes", label: "Shoes (أحذية)", category: "أحذية" },
  { id: "Women’s headscarves", label: "Women’s headscarves (الطرح الحريمي)", category: "الطرح الحريمي" },
  { id: "Beauty and Personal Care", label: "Beauty and Personal Care (العناية والجمال)", category: "العناية والجمال" },
];

// الأقسام التسعة الرسمية للمتجر (بدون قسم "الكل")
const OFFICIAL_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all").map((c) => c.name);

const INITIAL_FORM = {
  code: "",
  name: "",
  category: "ملابس حريمي",
  price: "",
  old_price: "",
  sizes: "مقاس موحد",
  description: "",
  image_url: "",
  available: "نعم",
};

export default function AdminDashboard({ onBackToStore }) {
  // بيانات جلسة تسجيل الدخول
  const [auth, setAuth] = useState(() => {
    try {
      const stored = sessionStorage.getItem("khodlak_admin_auth");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // بيانات فورم المنتج
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // البحث والعمليات
  const [searchCodeInput, setSearchCodeInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'warning', text: string }

  // رفع الصور إلى Drive
  const [selectedFolder, setSelectedFolder] = useState("Woman");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // تحديث المجلد تلقائياً عند تغيير القسم
  const handleCategoryChange = (newCategory) => {
    setFormData((prev) => ({ ...prev, category: newCategory }));
    const match = DRIVE_FOLDERS.find((f) => f.category === newCategory);
    if (match) {
      setSelectedFolder(match.id);
    }
  };

  // تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await verifyLogin(usernameInput, passwordInput);
      if (res && (res.success || res.status === "success")) {
        const authData = { username: usernameInput.trim(), password: passwordInput.trim() };
        setAuth(authData);
        sessionStorage.setItem("khodlak_admin_auth", JSON.stringify(authData));
      } else {
        setLoginError(res.message || "بيانات الدخول غير صحيحة.");
      }
    } catch (err) {
      setLoginError(err.message || "فشل الاتصال بالخادم للتحقق من الدخول.");
    } finally {
      setLoginLoading(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setAuth(null);
    sessionStorage.removeItem("khodlak_admin_auth");
    setFormData(INITIAL_FORM);
    setMessage(null);
  };

  // رسائل التنبيه المؤقتة
  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 6000);
  };

  // البحث عن منتج بالكود
  const handleSearch = async () => {
    const code = searchCodeInput.trim() || formData.code.trim();
    if (!code) {
      showToast("warning", "يرجى كتابة كود المنتج للبحث.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await searchProductByCode(auth.username, auth.password, code);
      if (res && res.product) {
        const p = res.product;
        setFormData({
          code: String(p.code || code),
          name: p.name || "",
          category: p.category || "ملابس حريمي",
          price: p.price ?? "",
          old_price: p.old_price ?? "",
          sizes: p.sizes || "مقاس موحد",
          description: p.description || "",
          image_url: p.image_url || "",
          available: p.available === "لا" ? "لا" : "نعم",
        });
        const match = DRIVE_FOLDERS.find((f) => f.category === p.category);
        if (match) setSelectedFolder(match.id);

        setIsEditingExisting(true);
        showToast("success", `تم جلب بيانات المنتج كود [${code}] بنجاح.`);
      } else {
        setIsEditingExisting(false);
        showToast("warning", `لم يتم العثور على منتج بالكود [${code}]. يمكنك إضافة منتج جديد بهذا الكود.`);
        setFormData((prev) => ({ ...INITIAL_FORM, code }));
      }
    } catch (err) {
      showToast("error", err.message || "حدث خطأ أثناء البحث عن المنتج.");
    } finally {
      setActionLoading(false);
    }
  };

  // إعداد استمارة لمنتج جديد
  const handleNewProduct = () => {
    setFormData(INITIAL_FORM);
    setSearchCodeInput("");
    setIsEditingExisting(false);
    showToast("success", "تم تجهيز الاستمارة لإضافة منتج جديد.");
  };

  // حفظ المنتج (إضافة أو تعديل)
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!formData.code.trim()) {
      showToast("error", "كود المنتج مطلوب.");
      return;
    }
    if (!formData.name.trim()) {
      showToast("error", "اسم المنتج مطلوب.");
      return;
    }
    if (formData.price === "" || isNaN(formData.price)) {
      showToast("error", "يرجى تحديد سعر صالح للمنتج.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await saveProduct(auth.username, auth.password, formData);
      setIsEditingExisting(true);
      showToast(
        "success",
        res.message || `تم حفظ وتحديث المنتج كود [${formData.code}] في الشيت بنجاح!`
      );
    } catch (err) {
      showToast("error", err.message || "حدث خطأ أثناء حفظ المنتج في الشيت.");
    } finally {
      setActionLoading(false);
    }
  };

  // حذف المنتج بالكود
  const handleDelete = async () => {
    const code = formData.code.trim();
    if (!code) {
      showToast("error", "يرجى تحديد أو إدخال كود المنتج المراد حذفه أولاً.");
      return;
    }

    const confirmed = window.confirm(
      `⚠️ تأكيد الحذف النهائي:\nهل أنتِ متأكدة من حذف المنتج "${formData.name || code}" [كود: ${code}] من شيت جوجل نهائياً؟\nهذا الإجراء لا يمكن التراجع عنه!`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await deleteProduct(auth.username, auth.password, code);
      showToast("success", res.message || `تم حذف المنتج [${code}] نهائياً من الشيت.`);
      handleNewProduct();
    } catch (err) {
      showToast("error", err.message || "فشل حذف المنتج من الشيت.");
    } finally {
      setActionLoading(false);
    }
  };

  // رفع الصورة المختارة إلى Drive
  const handleImageUpload = async () => {
    if (!uploadFile) {
      showToast("warning", "يرجى اختيار ملف صورة من جهازك أولاً.");
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(
        auth.username,
        auth.password,
        uploadFile,
        selectedFolder
      );

      if (res && res.url) {
        const newUrl = res.url.trim();
        // دمج الرابط الجديد مع الروابط السابقة بفاصلة
        setFormData((prev) => {
          const currentUrls = prev.image_url.trim();
          if (!currentUrls) {
            return { ...prev, image_url: newUrl };
          }
          return { ...prev, image_url: `${currentUrls}, ${newUrl}` };
        });

        setUploadFile(null);
        // إعادة تعيين input file
        const fileInput = document.getElementById("admin-file-input");
        if (fileInput) fileInput.value = "";

        showToast("success", `تم رفع الصورة بنجاح إلى مجلد "${selectedFolder}" وإضافتها للمنتج!`);
      } else {
        showToast("error", res.message || "تم الرفع لكن لم يتم استلام رابط الصورة.");
      }
    } catch (err) {
      showToast("error", err.message || "فشل رفع الصورة إلى Google Drive.");
    } finally {
      setUploadingImage(false);
    }
  };

  // حذف رابط صورة محدد من المعاينة
  const handleRemoveImageUrl = (indexToRemove) => {
    const urls = formData.image_url
      .split(/[\r\n,،]+/)
      .map((u) => u.trim())
      .filter(Boolean);
    const updated = urls.filter((_, idx) => idx !== indexToRemove).join(", ");
    setFormData((prev) => ({ ...prev, image_url: updated }));
  };

  // قائمة روابط الصور للمعالجة والمعاينة
  const previewImages = formData.image_url
    .split(/[\r\n,،]+/)
    .map((u) => u.trim())
    .filter((u) => u.startsWith("http"));

  // ==================== شاشة تسجيل الدخول ====================
  if (!auth) {
    return (
      <div className="min-h-screen bg-[#FDF3F6] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-1">
              <LockKey weight="duotone" className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-primary">لوحة تحكم المتجر</h1>
            <p className="text-xs text-gray-500">
              منطقة إدارة كتالوج "خدلك لفة" - يرجى تسجيل الدخول للمتابعة
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <Warning weight="bold" className="w-5 h-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="اسم المستخدم الخاص بالإدارة"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all bg-gray-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? (
                <>
                  <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <LockKey weight="bold" className="w-5 h-5" />
                  <span>دخول لوحة التحكم</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowRight weight="bold" className="w-4 h-4" />
              <span>العودة للمتجر</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== الشاشة الرئيسية للوحة الإدارة ====================
  return (
    <div className="min-h-screen bg-[#FAF4F7] text-gray-800 pb-16">
      {/* هيدر اللوحة */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="خدلك لفة"
              className="w-10 h-10 rounded-full border border-secondary object-cover shrink-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-primary">
                  إدارة المتجر
                </h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  متصل: {auth.username}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                إضافة وتعديل وحذف المنتجات ورفع الصور إلى Google Drive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowRight weight="bold" className="w-4 h-4" />
              <span className="hidden xs:inline">العودة للمتجر</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer border border-red-200/60"
            >
              <SignOut weight="bold" className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* التنبيهات المباشرة */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 shadow-sm animate-fadeIn ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : message.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle weight="duotone" className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Warning weight="duotone" className="w-5 h-5 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. شريط البحث والعمليات السريعة */}
        <section className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500">
              {isEditingExisting ? (
                <span className="text-amber-600 font-extrabold">
                  وضع التعديل لمنتج موجود: [كود {formData.code}]
                </span>
              ) : (
                <span className="text-primary font-extrabold">
                  وضع إضافة منتج جديد
                </span>
              )}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleNewProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-primary text-xs font-bold transition-all cursor-pointer border border-pink-200"
              >
                <Plus weight="bold" className="w-4 h-4" />
                <span>منتج جديد</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading || !formData.code}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer border border-red-200 disabled:opacity-40"
              >
                <Trash weight="bold" className="w-4 h-4" />
                <span>حذف المنتج</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCodeInput}
                onChange={(e) => setSearchCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="ابحثي بكود المنتج للتعديل أو الحذف (مثلاً: 2035)..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/50"
              />
              <MagnifyingGlass
                weight="duotone"
                className="w-5 h-5 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
            >
              {actionLoading ? (
                <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
              ) : (
                <MagnifyingGlass weight="bold" className="w-4 h-4" />
              )}
              <span>بحث بالكود</span>
            </button>
          </div>
        </section>

        {/* 2. استمارة بيانات المنتج */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-primary border-b border-pink-100/60 pb-2.5 flex items-center gap-2">
              <Sparkle weight="duotone" className="w-4 h-4 text-secondary" />
              <span>بيانات المنتج الأساسية (المتوافقة مع الشيت)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* كود المنتج */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كود المنتج (Code) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="مثال: 2035"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>

              {/* اسم المنتج */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم المنتج (Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: فستان بناتي قطن صيفي"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>

              {/* القسم */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  القسم (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                >
                  {OFFICIAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* السعر الحالي */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  السعر الحالي (Price ج.م) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="مثال: 350"
                  required
                  min="0"
                  step="any"
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>

              {/* السعر القديم */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  السعر قبل الخصم (Old Price ج.م)
                </label>
                <input
                  type="number"
                  value={formData.old_price}
                  onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                  placeholder="مثال: 450 (اختياري)"
                  min="0"
                  step="any"
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>

              {/* المقاسات الحرة */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  المقاسات (sizes)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="مثال: وان سايز 55-85 كيلو أو مقاسات 37-41"
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>

              {/* حالة التوفر */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  حالة التوفر (Available)
                </label>
                <select
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                >
                  <option value="نعم">نعم (متوفر للطلب)</option>
                  <option value="لا">لا (نفدت الكمية)</option>
                </select>
              </div>

              {/* وصف المنتج */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  وصف المنتج (Description)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="تفاصيل الخامة والتفصيل والمميزات..."
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm bg-gray-50/30"
                />
              </div>
            </div>
          </div>

          {/* 3. رفع الصور إلى Google Drive ومعاينة المعرض */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-primary border-b border-pink-100/60 pb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CloudArrowUp weight="duotone" className="w-5 h-5 text-secondary" />
                <span>رفع وإدارة صور المنتج (Google Drive)</span>
              </span>
              <span className="text-[11px] text-gray-400 font-normal">
                يدعم رفع صور متعددة ودمجها بفاصلة
              </span>
            </h2>

            {/* أداة الرفع المباشر إلى مجلد Drive */}
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    المجلد الفرعي في Google Drive:
                  </label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white text-xs font-bold text-gray-800 outline-none focus:border-primary"
                  >
                    {DRIVE_FOLDERS.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    اختيار صورة من جهازك:
                  </label>
                  <input
                    id="admin-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files[0] || null)}
                    className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-secondary cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-gray-500">
                  {uploadFile ? `الملف المختار: ${uploadFile.name}` : "لم يتم اختيار صورة بعد"}
                </span>

                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploadingImage || !uploadFile}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-primary text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
                      <span>جاري الرفع لـ Drive...</span>
                    </>
                  ) : (
                    <>
                      <CloudArrowUp weight="bold" className="w-4 h-4" />
                      <span>رفع الصورة وحفظ الرابط</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* حقل روابط الصور المباشرة */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                روابط الصور (image_url) - مفصولة بفاصلة (,) لتعدد الصور:
              </label>
              <textarea
                rows="2"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="روابط الصور تظهر هنا تلقائياً بعد الرفع، أو يمكنك لصق روابط مباشرة..."
                className="w-full px-3.5 py-2 rounded-xl border border-pink-100 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-xs font-mono bg-gray-50/30"
              />
            </div>

            {/* معرض معاينة الصور المحفوظة للمنتج */}
            {previewImages.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-pink-100">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                  <Images weight="duotone" className="w-4 h-4 text-secondary" />
                  <span>معاينة صور المنتج ({previewImages.length} صور):</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {previewImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-pink-200 bg-pink-50/50 shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`معاينة ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(idx)}
                        className="absolute top-1 left-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="حذف هذه الصورة"
                      >
                        <X weight="bold" className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. شريط أزرار الحفظ والإلغاء النهائي */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleNewProduct}
              className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              تفريغ الحقول
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-8 py-3 rounded-2xl bg-primary hover:bg-[#862562] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {actionLoading ? (
                <>
                  <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                  <span>جاري الحفظ في الشيت...</span>
                </>
              ) : (
                <>
                  <FloppyDisk weight="bold" className="w-5 h-5" />
                  <span>{isEditingExisting ? "تحديث بيانات المنتج" : "حفظ المنتج في الشيت"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
