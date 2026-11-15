/**
 * تنسيقات وألوان شارات الأقسام الخمسة لمتجر خدلك لفة
 * 1. ملابس حريمي (وردي زاهي #D85A8B)
 * 2. ملابس رجالي (برقوقي داكن #6A1B4D / كحلي هادئ #1E3A5F)
 * 3. ملابس اولاد (سماوي #7EA6D8)
 * 4. ملابس بنات (وردي فاتح / خوخي ناعم #FB7185)
 * 5. إكسسوارات (لافندر #B88ED6)
 */

export function getCategoryBadgeClass(category) {
  switch (category?.trim()) {
    case "ملابس حريمي":
      return "bg-[#D85A8B]/15 text-[#D85A8B] border-[#D85A8B]/30";
    case "ملابس رجالي":
      return "bg-[#1E3A5F]/15 text-[#1E3A5F] border-[#1E3A5F]/35";
    case "ملابس اولاد":
      return "bg-[#7EA6D8]/20 text-[#2B6CB0] border-[#7EA6D8]/40";
    case "ملابس بنات":
      return "bg-[#FB7185]/20 text-[#BE123C] border-[#FB7185]/40";
    case "إكسسوارات":
      return "bg-[#B88ED6]/20 text-[#6B3BA7] border-[#B88ED6]/40";
    default:
      // توافق احتياطي مع أي تصنيف عام
      return "bg-[#6A1B4D]/15 text-[#6A1B4D] border-[#6A1B4D]/30";
  }
}
