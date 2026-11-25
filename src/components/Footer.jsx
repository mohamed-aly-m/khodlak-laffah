import React, { useState } from "react";
import {
  WhatsappLogo,
  FacebookLogo,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { WHATSAPP_NUMBER } from "../data/config";

export default function Footer({ onOpenAdmin }) {
  const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const [clickCount, setClickCount] = useState(0);

  // فتح لوحة الإدارة عند النقر 5 مرات متتالية على نص حقوق الملكية
  const handleCopyrightClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      setClickCount(0);
      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        window.location.hash = "#admin";
      }
    } else {
      setClickCount(nextCount);
      // إعادة تعيين العداد بعد 3 ثوانٍ من التوقف
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-pink-100 mt-12 py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* هوية البراند */}
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo.png"
            alt="خدلك لفة"
            className="w-10 h-10 rounded-full border border-secondary object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-xl font-black text-primary">خدلك لفة</span>
        </div>

        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          ملابس .. أطفال .. إكسسوارات | اختياراتك دايماً أجمل ✨
        </p>

        {/* أزرار التواصل الاجتماعي: واتساب وفيسبوك */}
        <div className="pt-1 flex items-center justify-center gap-3 flex-wrap text-xs font-bold">
          {/* رابط واتساب الإدارة */}
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <WhatsappLogo weight="duotone" className="w-5 h-5 text-emerald-600" />
            <span>تواصل مع الإدارة عبر واتساب</span>
          </a>

          {/* رابط صفحة فيسبوك الرسمية */}
          <a
            href="https://www.facebook.com/profile.php?id=61595229841192"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            <FacebookLogo weight="duotone" className="w-5 h-5 text-blue-600" />
            <span>صفحتنا على فيسبوك</span>
          </a>
        </div>

        {/* خط فاصل وحقوق الملكية والتوقيع */}
        <div className="pt-4 border-t border-gray-100 space-y-2.5">
          {/* حقوق ملكية المتجر مع دعم النقر 5 مرات لفتح لوحة الإدارة بشكل خفي */}
          <p
            onClick={handleCopyrightClick}
            className="text-xs text-gray-500 font-medium select-none cursor-default"
            title="خدلك لفة"
          >
            جميع الحقوق محفوظة &copy; 2026 - خدلك لفة
          </p>

          {/* شريط توقيع احترافي أنيق (كبسولة ناعمة) لـ Safhatuk */}
          <div className="flex items-center justify-center">
            <a
              href="https://www.safhatuk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50/70 hover:bg-pink-100 text-gray-600 hover:text-primary border border-pink-200/80 text-[11px] font-semibold transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-pointer"
              title="زيارة موقع صفحتك | Safhatuk"
            >
              <span>تصميم وتطوير:</span>
              <span className="font-bold text-primary group-hover:text-secondary transition-colors">
                صفحتك | Safhatuk
              </span>
              <ArrowUpRight weight="bold" className="w-3 h-3 text-gray-400 group-hover:text-secondary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
