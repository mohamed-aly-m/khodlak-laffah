/**
 * خدمة إدارة المتجر - لوحة تحكم خدلك لفة
 * الاتصال مع Google Apps Script Web App لتنفيذ عمليات CRUD ورفع الصور إلى Google Drive
 */
import { ADMIN_SCRIPT_URL } from "../data/config";

/**
 * دالة مساعدة عامة لإرسال طلبات POST إلى Google Apps Script
 * نستخدم text/plain;charset=utf-8 لتفادي مشاكل الـ CORS Preflight في المتصفح
 */
async function sendAdminRequest(payload) {
  if (
    !ADMIN_SCRIPT_URL ||
    ADMIN_SCRIPT_URL.trim() === "" ||
    ADMIN_SCRIPT_URL.includes("ضع_هنا") ||
    ADMIN_SCRIPT_URL.includes("الصق_هنا")
  ) {
    throw new Error(
      "لم يتم ضبط رابط Google Apps Script Web App بعد. يرجى وضع الرابط في متغير ADMIN_SCRIPT_URL بملف src/data/config.js."
    );
  }

  try {
    const response = await fetch(ADMIN_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الاتصال بالخادم (كود الاستجابة: ${response.status})`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(
        `استجابة غير متوقعة من سكريبت جوجل: ${text.substring(0, 150)}`
      );
    }

    if (data.status === "error" || data.success === false) {
      throw new Error(
        data.message || data.error || "فشلت العملية، تأكد من صحة البيانات وصلاحيات السكريبت."
      );
    }

    return data;
  } catch (error) {
    console.error("Admin Service Request Failed:", error);
    throw error;
  }
}

/**
 * 1. التحقق من صحة اسم المستخدم وكلمة المرور
 */
export async function verifyLogin(username, password) {
  return sendAdminRequest({
    action: "login",
    username: username.trim(),
    password: password.trim(),
  });
}

/**
 * 2. البحث عن منتج بواسطة الكود واسترجاع بياناته
 */
export async function searchProductByCode(username, password, code) {
  return sendAdminRequest({
    action: "searchProduct",
    username: username.trim(),
    password: password.trim(),
    code: String(code).trim(),
  });
}

/**
 * 3. حفظ منتج (إضافة منتج جديد أو تحديث منتج موجود)
 */
export async function saveProduct(username, password, product) {
  return sendAdminRequest({
    action: "saveProduct",
    username: username.trim(),
    password: password.trim(),
    product: {
      code: String(product.code || "").trim(),
      name: String(product.name || "").trim(),
      category: String(product.category || "ملابس حريمي").trim(),
      price: product.price !== "" ? Number(product.price) : 0,
      old_price: product.old_price !== "" && product.old_price != null ? Number(product.old_price) : "",
      sizes: String(product.sizes || "مقاس موحد").trim(),
      description: String(product.description || "").trim(),
      image_url: String(product.image_url || "").trim(),
      available: String(product.available || "نعم").trim(),
    },
  });
}

/**
 * 4. حذف منتج بناءً على الكود
 */
export async function deleteProduct(username, password, code) {
  return sendAdminRequest({
    action: "deleteProduct",
    username: username.trim(),
    password: password.trim(),
    code: String(code).trim(),
  });
}

/**
 * تحويل ملف الصورة في المتصفح إلى Base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64Data = dataUrl.split(",")[1];
      resolve({
        base64Data,
        mimeType: file.type || "image/jpeg",
        fileName: file.name,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * 5. رفع صورة إلى Google Drive داخل المجلد الفرعي المناسب
 */
export async function uploadProductImage(username, password, file, folderCategory) {
  const { base64Data, mimeType, fileName } = await fileToBase64(file);

  return sendAdminRequest({
    action: "uploadImage",
    username: username.trim(),
    password: password.trim(),
    folderCategory: String(folderCategory || "Woman").trim(),
    fileName,
    mimeType,
    base64Data,
  });
}
