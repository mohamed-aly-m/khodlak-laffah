import Papa from "papaparse";
import { GOOGLE_SHEET_CSV_URL, fallbackProducts } from "../data/config";

/**
 * تحويل روابط صور Google Drive التشاركية إلى روابط عرض مباشر
 * (https://lh3.googleusercontent.com/d/FILE_ID)
 * لتعمل في المتصفح بكفاءة وسرعة فائقة بدون قيود
 */
export function transformImageUrl(url) {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  }

  const trimmed = url.trim();

  // إذا كان الرابط أصلاً بصيغة lh3 المباشرة
  if (trimmed.includes("lh3.googleusercontent.com/d/")) {
    return trimmed;
  }

  // إذا كان رابط Google Drive بصيغة: /file/d/FILE_ID/... أو /d/FILE_ID
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) {
    return `https://lh3.googleusercontent.com/d/${matchD[1]}`;
  }

  // إذا كان رابط Google Drive بصيغة معامل id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return trimmed;
}

/**
 * معالجة عمود الصور لدعم رابط واحد أو روابط متعددة مفصولة بفاصلة (,) أو أسطر جديدة
 * وترجيع مصفوفة روابط مباشرة نظيفة
 */
export function parseProductImages(rawImageUrl) {
  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

  if (!rawImageUrl) {
    return [fallbackImg];
  }

  // إذا كانت مصفوفة بالفعل
  if (Array.isArray(rawImageUrl)) {
    const list = rawImageUrl.map(transformImageUrl).filter(Boolean);
    return list.length > 0 ? list : [fallbackImg];
  }

  // التقسيم بالفاصلة العادية أو فاصلة عربية أو أسطر جديدة
  const rawList = String(rawImageUrl)
    .split(/[\r\n,،]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== "null" && s !== "undefined");

  if (rawList.length === 0) {
    return [fallbackImg];
  }

  const transformedList = rawList.map(transformImageUrl).filter(Boolean);
  return transformedList.length > 0 ? transformedList : [fallbackImg];
}

/**
 * دالة مساعدة لاستخراج القيمة من الصف مع دعم أسماء الحقول الإنجليزية والعربية
 */
function getColumnValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return String(row[key]).trim();
    }
    // فحص بدون مراعاة حالة الأحرف وبدون مسافات
    const lowerKey = key.toLowerCase().replace(/[\s_-]/g, "");
    for (const rowKey of Object.keys(row)) {
      if (rowKey.toLowerCase().replace(/[\s_-]/g, "") === lowerKey) {
        return String(row[rowKey]).trim();
      }
    }
  }
  return "";
}

/**
 * تهيئة المنتجات التجريبية وتأكيد مصفوفة الصور
 */
function normalizeFallbackProducts() {
  return fallbackProducts.map((p) => {
    const images = parseProductImages(p.images || p.image_url);
    const primaryImage = images[0];
    return {
      ...p,
      sizes: p.sizes || "مقاس موحد",
      images,
      image_url: primaryImage,
      image: primaryImage,
      price: Number(p.price) || 0,
      old_price: p.old_price ? Number(p.old_price) : null,
    };
  });
}

/**
 * جلب بيانات المنتجات من رابط Google Sheet بصيغة CSV
 * إذا كان الرابط فارغاً أو فشل الاتصال، يتم إرجاع fallbackProducts تلقائياً
 */
export async function fetchProductsFromSheet() {
  if (!GOOGLE_SHEET_CSV_URL || !GOOGLE_SHEET_CSV_URL.trim()) {
    console.info("Khodlak Laffah: لم يتم توفير رابط Google Sheet CSV، يتم استخدام البيانات الافتراضية.");
    return normalizeFallbackProducts();
  }

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      method: "GET",
      headers: {
        "Accept": "text/csv, text/plain, */*",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`فشل جلب ملف CSV: كود الخطأ ${response.status}`);
    }

    const csvText = await response.text();

    const parseResult = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => resolve(results),
        error: (error) => reject(error),
      });
    });

    const rows = parseResult.data || [];

    if (!rows.length) {
      console.warn("Khodlak Laffah: شيت جوجل فارغ، يتم استخدام البيانات الافتراضية.");
      return normalizeFallbackProducts();
    }

    // تحويل كل صف إلى كائن منتج موحد مع دعم تعدد الصور
    const products = rows
      .map((row, index) => {
        const code = getColumnValue(row, ["code", "كود", "الكود", "id"]) || `${2000 + index}`;
        const name = getColumnValue(row, ["name", "اسم المنتج", "الاسم", "title"]);
        let category = getColumnValue(row, ["category", "القسم", "التصنيف"]).trim() || "ملابس حريمي";
        if (category === "ملابس") category = "ملابس حريمي";
        if (category === "أطفال") category = "ملابس اولاد";

        const sizesRaw = getColumnValue(row, ["sizes", "size", "مقاسات", "المقاسات", "المقاس"]);
        const sizes = sizesRaw.trim() || "مقاس موحد";

        const priceRaw = getColumnValue(row, ["price", "السعر", "سعر"]);
        const oldPriceRaw = getColumnValue(row, ["old_price", "oldprice", "السعر القديم", "قبل الخصم"]);
        const description = getColumnValue(row, ["description", "الوصف", "تفاصيل", "التفاصيل"]);
        const rawImageUrl = getColumnValue(row, ["image_url", "image", "images", "صورة", "صور", "رابط الصورة"]);
        const availableRaw = getColumnValue(row, ["available", "متوفر", "الحالة"]);

        // إذا كان الصف فارغ الاسم يتم تجاهله
        if (!name) return null;

        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0;
        const old_price = oldPriceRaw ? (parseFloat(oldPriceRaw.replace(/[^0-9.]/g, "")) || null) : null;
        
        // التحقق من حالة التوفر: إذا كانت "لا" أو "false" أو "نفدت"
        const isNotAvailable =
          availableRaw.toLowerCase() === "لا" ||
          availableRaw.toLowerCase() === "false" ||
          availableRaw.includes("نفد") ||
          availableRaw.toLowerCase() === "no";
        const available = isNotAvailable ? "لا" : "نعم";

        // معالجة تعدد الصور
        const images = parseProductImages(rawImageUrl);
        const primaryImage = images[0];

        return {
          code,
          name,
          category,
          sizes,
          price,
          old_price,
          description,
          images,
          image_url: primaryImage,
          image: primaryImage,
          available,
        };
      })
      .filter(Boolean);

    return products.length > 0 ? products : normalizeFallbackProducts();
  } catch (error) {
    console.error("Khodlak Laffah: حدث خطأ أثناء جلب شيت جوجل:", error);
    return normalizeFallbackProducts();
  }
}
