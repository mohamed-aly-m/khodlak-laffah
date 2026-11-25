/**
 * إعدادات المتجر الأساسية وبيانات Google Sheets
 * Khodlak Laffah (خدلك لفة) Configuration
 */

// رقم واتساب المتجر لتلقي الطلبات (بدون علامة + أو أصفار دولية زائدة)
export const WHATSAPP_NUMBER = "201043301676";

/**
 * رابط شيت جوجل بصيغة CSV:
 * للحصول على الرابط:
 * 1. افتحي Google Sheet الخاص بالمنتجات.
 * 2. اختاري من القائمة: ملف (File) -> مشاركة (Share) -> نشر على الويب (Publish to web).
 * 3. اختاري الورقة المطلوبة ثم صيغة (قيم مفصولة بفواصل .csv).
 * 4. انسخي الرابط وضعيه هنا بين علامات التنصيص.
 *
 * الأعمدة المدعومة في الشيت:
 * code, name, category, sizes, price, old_price, description, image_url, available
 */
export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJC1icNCivPQCJPpeYsKeAIf_Io5XtWB7jxXaKWmd0PVMOCHo_zDbKyWzw__1W6ol5JT3nweaPCd4K/pub?gid=0&single=true&output=csv";

// رابط Google Apps Script Web App للوحة تحكم إدارة المتجر
export const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxu2-Yiw1K7uaDsNk3DPIkbEVT4xhVEfS7aF6s_5yie-cRnBIWylZNvhbF_VJ59dvYU/exec";

// المنتجات الافتراضية التجريبية (Fallback Products) مع دعم تعدد الصور والمقاسات الحرة
export const fallbackProducts = [
  {
    code: "2035",
    name: "بيجامة دبدوب شتوي - كولكشن LAMAR",
    category: "ملابس حريمي",
    sizes: "وان سايز 55-85 كيلو",
    price: 450,
    old_price: 550,
    description: "تيشيرت فرو مستورد ناعم ودافئ وبنطلون قطيفة مضلعة شين مقاس وان سايز من 55 إلى 85 كيلو",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "9018",
    name: "طرحة شيفون كريب كويتي فاخر مع تطريز ليزر ناعم",
    category: "الطرح الحريمي",
    sizes: "مقاس موحد 185 × 75 سم",
    price: 145,
    old_price: 185,
    description: "طرحة شيفون كريب سوبر تركي غير شفافة مع ملمس ناعم وثبات عالي طوال اليوم، ألوان باستيل هادئة تناسب كل إطلالاتك",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "6012",
    name: "شنطة كروس كابيتونيه فاخرة مع حزام سلسلة ذهبي",
    category: "شنط",
    sizes: "أبعاد 23 × 16 سم",
    price: 320,
    old_price: 390,
    description: "حقيبة يد وكتف جلد ناعم ومقاوم للخدش، قفل معدني أنيق ومساحة داخلية واسعة تناسب الخروجات والمناسبات",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "7025",
    name: "سنيكرز نسائي كاجوال جلد طبيعي خفيف ومريح",
    category: "أحذية",
    sizes: "متوفر مقاسات 37 - 41",
    price: 360,
    old_price: 450,
    description: "حذاء رياضي أنيق بنعل طبي مبطن مضاد للانزلاق، تصميم عصري مريح جداً للمشي والجامعة والعمل اليومي",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "8030",
    name: "مجموعة العناية الفاخرة - مسك الطهارة وزيت الورد المرطب",
    category: "العناية والجمال",
    sizes: "حجم البوكس 3 قطع",
    price: 240,
    old_price: 290,
    description: "بوكس متكامل للعناية الشخصية والتعطير يضم تولة مسك أبيض أصلي مع سيروم مرطب ومعطر للجسم بخلاصة الورد الطبيعي",
    images: [
      "https://images.unsplash.com/photo-1608248597359-715392437ff8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1608248597359-715392437ff8?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "4015",
    name: "سويت شيرت هودي رجالي أوفر سايز مبطن",
    category: "ملابس رجالي",
    sizes: "L, XL, 2XL (تلبيس مريح)",
    price: 420,
    old_price: 520,
    description: "هودي رجالي قطن ميلتون ثقيل مع كابيشون مزدوج وبطانة داخلية ناعمة، قصة كاجوال عصرية مريحة جداً للشتاء",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "2042",
    name: "فستان بناتي سويت هارت صوف ناعم",
    category: "ملابس بنات",
    sizes: "من سنتين إلى 6 سنوات",
    price: 280,
    old_price: 350,
    description: "فستان شتوي بناتي خامة ممتازة مع كولون صوف وبندانة شعر هدية، متوفر للمقاسات من سنتين إلى 6 سنوات بتصميم أنيق ومريح",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "2070",
    name: "سويت شيرت أطفال قطن مبطن ميلتون دافئ",
    category: "ملابس اولاد",
    sizes: "من 4 إلى 10 سنوات",
    price: 220,
    old_price: 260,
    description: "سويت شيرت بطباعة كرتونية لطيفة، قطن مصري 100% مبطن بوبرة داخلية تدفي في أصعب الأيام الشتوية مع جيوب كنغر عملية",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    available: "لا"
  },
  {
    code: "3011",
    name: "طقم إكسسوارات لؤلؤ روز جولد أنيق",
    category: "إكسسوارات",
    sizes: "طول العقد 45 سم (قابل للتعديل)",
    price: 160,
    old_price: 220,
    description: "عقد ناعم مع حلق بتصميم لؤلؤ المياه العذبة ومطلي روز جولد ثابت اللون ومقاوم للحساسية لإطلالة ساحرة",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  },
  {
    code: "2058",
    name: "كارديجان صوف تريكو أوفر سايز تركي",
    category: "ملابس حريمي",
    sizes: "أوفر سايز حر حتى 90 كيلو",
    price: 390,
    old_price: 490,
    description: "كارديجان طويل بأكمام مزمومة وغرزة تريكو بارزة فخمة، ألوان شتوية عصرية ومريحة جداً للخروجات اليومية",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"
    ],
    image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    available: "نعم"
  }
];

// أقسام المتجر الأساسية بالترتيب الدقيق المطلوب
export const CATEGORIES = [
  { id: "all", name: "الكل" },
  { id: "ملابس حريمي", name: "ملابس حريمي" },
  { id: "ملابس رجالي", name: "ملابس رجالي" },
  { id: "ملابس اولاد", name: "ملابس اولاد" },
  { id: "ملابس بنات", name: "ملابس بنات" },
  { id: "إكسسوارات", name: "إكسسوارات" },
  { id: "شنط", name: "شنط" },
  { id: "أحذية", name: "أحذية" },
  { id: "الطرح الحريمي", name: "الطرح الحريمي" },
  { id: "العناية والجمال", name: "العناية والجمال" },
];
