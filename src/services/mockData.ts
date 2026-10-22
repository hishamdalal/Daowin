import { Note, CategoryItem } from '../types/note';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'work',
    name: 'العمل والمؤسسة',
    icon: 'apartment',
    count: 18,
    subcategories: [
      { id: 'projects-2025', name: 'مشاريع 2025', count: 11 },
      { id: 'contracts', name: 'العملاء والعقود الرسمية', count: 7 },
    ],
  },
  {
    id: 'personal',
    name: 'المساحة الشخصية',
    icon: 'person',
    count: 14,
    subcategories: [
      { id: 'shopping', name: 'المشتريات والتسوق', count: 4 },
      { id: 'reflections', name: 'الأفكار اليومية والتأملات', count: 10 },
    ],
  },
  {
    id: 'study',
    name: 'دراسة وأبحاث أكاديمية',
    icon: 'menu_book',
    count: 9,
    subcategories: [
      { id: 'ai-research', name: 'أبحاث الذكاء الاصطناعي', count: 5 },
      { id: 'books', name: 'ملخصات الكتب', count: 4 },
    ],
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'خطة إطلاق المشروع الجديد',
    category: 'العمل',
    subCategory: 'مشاريع 2025',
    tags: ['#مهم', '#تطوير'],
    color: 'yellow',
    isPinned: true,
    updatedAt: 'منذ ساعتين',
    createdAt: '2025-05-15T09:00:00Z',
    reminder: {
      enabled: true,
      pinToStatusBar: true,
      scheduledTime: '18:00',
      scheduledDate: '2025-05-15',
      countdownMinutes: 45,
      repeatingDailyTimes: ['09:00', '14:00', '18:00'],
      lastNotificationText: 'NoteCraft • خطة إطلاق وتطوير التطبيق - متبقي ربط واجهات الماركداون',
    },
    checklists: [
      { id: 'c1', text: 'إعداد المخطط الأولي ونظام التصميم', completed: true },
      { id: 'c2', text: 'مراجعة معمارية قواعد البيانات', completed: true },
      { id: 'c3', text: 'إطلاق مرحلة الاختبار التجريبي (Beta)', completed: false },
      { id: 'c4', text: 'ربط واجهات الماركداون بالمحرر المباشر', completed: true },
      { id: 'c5', text: 'اختبار تصدير الملاحظات ومشاركتها بصيغة PDF', completed: false },
    ],
    content: `# خطة إطلاق وتطوير التطبيق الجديد

**المسار:** العمل > مشاريع 2025 > تطبيق الهاتف
**الوسوم:** #مهم #تقنية #تصميم

---

## نظرة عامة على المرحلة الأولى
نهدف في هذا الإصدار إلى توفير تجربة تدوين استثنائية وسلسة تمنح الكاتب تركيزاً كاملاً وهدوءاً ذهنياً. سيتم الاعتماد كلياً على أسلوب التباين الباستيلي الناعم لتقليل الإجهاد البصري عند الكتابة لفترات طويلة.

> «التصميم الجيد ليس مجرد مظهر جذاب، بل هو إحساس عميق بالسكينة عند كل تفاعل يقوم به المستخدم.»
> — فريق تجربة المستخدم NoteCraft

### قائمة المهام القادمة
- [x] مراجعة التصاميم مع فريق الـ UX
- [x] تجهيز لوحة الألوان والخطوط Material 3
- [ ] ربط واجهات الماركداون بالمحرر المباشر
- [ ] اختبار تصدير الملاحظات ومشاركتها بصيغة PDF`,
    attachments: [
      {
        id: 'att-1',
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjlHBdPfpAp2dJ7SuOOF-8ixKGmCSqzmoq6k7sIywJ05DWl-HKsIIBKZQijTapU209HjOOHLFxVYYJo5MfELMwQsQFfncDFU-bpa6RB-wuDXHjCZOXpIOZ--dOV75ZLhsNBileziZPrDCJKKIL5eF_YeD8bntog4rnFEj0PlcWbJPmoy3ekE7PjJ1zXVJnj_QyEgn_5LDZbZZY0ld_ncLTYOUSJO4MIrXFq0TaJC2GWKFw-oo2gICj',
        title: 'النموذج الأولي للواجهات الرئيسية',
        alt: 'واجهة المستخدم المقترحة للتطبيق',
      },
      {
        id: 'att-2',
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7vGaCpKw0hcoLyRs6YzMk2qRr7zbnuZLXeNQTbUgMXYPUr710yI1amrHA4tXosdPLMzpaBwsrH_DnXPZDSUwE0xgMidKOrDjJ4-6rSNrjV3OE9QzE5zYlwz58p43TCh6agc-nJHgA_GrBMvnuDs4Z_3WoX5lTqueoLTtSQOYtx70ccmbPRHd5WuRIlPFoOu0r93qtQzjBWnIK8Hm6DZzkQuBGNcmYxZs3cuYSTX3X9T33vcCQ_tOI',
        title: 'مخطط الألوان والسمات',
        alt: 'لوحة التدرجات والألوان المعتمدة',
      },
      {
        id: 'att-3',
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB98kQHMtDtMVRzYy-hNOXOzN5TzzXBkH5BLQ5iLuFMsk-jKrFb9VGrPAME7Zn8qgUqiPjv1T7ZY0yfDc0O3zkH45mEpnvPscg6S-tE7aNP_5QKv8XnwYOegzfCuYVSrndjBpfUV-3GYJtqt8KMcPbg0AlIBiLdJeukFj_i3RrGF8CpG0tQfxG9M1vLXkWUElcysCRJB7gLAsDC3coJ3uUAgSD4mKQX0Sj9DAhzPTJWOHhgFQqn7r1H',
        title: 'مخطط تجربة المستخدم',
        alt: 'مخطط رحلة تجربة المستخدم',
      },
    ],
  },
  {
    id: 'note-2',
    title: 'أفكار لتطوير الواجهة',
    category: 'التصميم الرقمي',
    subCategory: 'واجهات وتجربة',
    tags: ['#تصميم', '#أفكار'],
    color: 'lavender',
    isPinned: false,
    updatedAt: 'اليوم، 11:45 ص',
    createdAt: '2025-05-15T08:45:00Z',
    content: `تحديث الهوية باستخدام لوحات ألوان هادئة مستوحاة من الطبيعة مع التركيز على نعومة الزوايا وسلاسة تدفق القراءة باللغة العربية.

- اعتماد فلسفة المساحات السلبية ونقاء الباستيل
- تقليل التكلف في الإطارات الخارجية والتركيز على التباين الضوئي
- توفير تجربة مريحة للعين في القراءة التفاعلية الممتدة`,
    attachments: [
      {
        id: 'att-2-1',
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX1fuP_FPwyCFGhaAwO96opG3ejgS4wvRQ5yatUKG1DaEASskhDXrWCRxEgLheEktUtnAa9vVgw4-09hEr5Hq9MpF3Ov_E1XUniZtEyfvzh2EOO1vL_FUAFQP0gxGZ0lkf-2qsuO5TVKm-CzBv8EwL8CjxbArQdfhQ0DUdT8spmrBU8Ql6-7PvBv9jFs-rXiyNxCNKHggBiqE8PqW3sCK0aejkQhZWvUooX6Yd0C5aYbRWzdQSdz_v',
        title: 'لوحة إلهام الألوان الباستيلية',
      },
      {
        id: 'att-2-2',
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFrwykEiscE8gs0_yb6zCgU6b6-e-QFQOYnm69IQWOcAXu3wgQDty4C4bBoPXv1Nh4xKLUQKgP5k7_EBI-SfgCgG8JyXeCywuczfygEqd60_bnHQaLOP7F2wuPJKSCQfmzSyqh_Ecc4Vn8RJDs47uVS0xC9dDQeWRdE7WB8UlHwelDhFPdrDbvhxZsHn4l9Pw7Lt5tncKEgYaQSOUXgpdOtVyvNaTRhCnIQ_cAtIV229k4LpQ8CtR6',
        title: 'رسومات تخطيطية أولية للواجهات',
      },
    ],
  },
  {
    id: 'note-3',
    title: 'ملاحظات اجتماع الفريق التقني',
    category: 'العمل',
    subCategory: 'مشاريع 2025',
    tags: ['#تقنية', '#اجتماع'],
    color: 'mint',
    isPinned: false,
    updatedAt: 'أمس، 04:20 م',
    createdAt: '2025-05-14T16:20:00Z',
    content: `### القرارات التقنية المتفق عليها:
- تفعيل التشفير الطرفي للنسخ الاحتياطي التلقائي.
- دعم نمط الأوفلاين السريع ومزامنة الفروقات (Delta Sync).
- تقليل استهلاك الذاكرة عند فتح المذكرات الطويلة.
- اعتماد IndexedDB للتخزين المحلي المستمر دون فقدان البيانات.`,
  },
  {
    id: 'note-4',
    title: 'قائمة المشتريات الشهرية',
    category: 'شخصي',
    subCategory: 'المشتريات والتسوق',
    tags: ['#ميزانية', '#شخصي'],
    color: 'peach',
    isPinned: false,
    updatedAt: 'أمس، 02:10 م',
    createdAt: '2025-05-14T14:10:00Z',
    checklists: [
      { id: 'shop-1', text: 'دفاتر تدوين بغلاف مقوى فاخر', completed: true, subtitle: 'تم الشراء' },
      { id: 'shop-2', text: 'أقلام حبر جل ملونة لكتابة العناوين', completed: false, subtitle: 'متبقي' },
      { id: 'shop-3', text: 'إضاءة مكتب دافئة ذات مفتاح لمس', completed: false, subtitle: 'متبقي' },
    ],
    content: `قائمة المشتريات والمستلزمات المكتبية الخاصة بالربع الثاني.`,
  },
  {
    id: 'note-5',
    title: 'ملخص قراءة كتاب القيادة',
    category: 'تطوير الذات',
    subCategory: 'ملخصات الكتب',
    tags: ['#أفكار', '#إلهام'],
    color: 'sky',
    isPinned: false,
    updatedAt: 'منذ 3 أيام',
    createdAt: '2025-05-12T10:00:00Z',
    quote: {
      text: 'القيادة الفعالة لا تعني فرض السيطرة بل إلهام الآخرين ليطلقوا أفضل ما في إمكاناتهم لبناء إنجاز مشترك.',
      source: 'الفصل الرابع: التأثير الصامت',
    },
    content: `ملاحظات أساسية حول فصل التأثير الصامت وكيفية تحفيز الفريق الذاتي.`,
  },
  {
    id: 'note-6',
    title: 'فكرة لمشروع بودكاست صوتي',
    category: 'خواطر',
    subCategory: 'الأفكار اليومية والتأملات',
    tags: ['#إلهام', '#خواطر'],
    color: 'rose',
    isPinned: false,
    updatedAt: 'منذ أسبوع',
    createdAt: '2025-05-08T18:00:00Z',
    attachments: [
      {
        id: 'att-audio-1',
        type: 'audio',
        url: '#',
        duration: '1:45 د',
        title: 'تسجيل صوتي مرفق (1:45 د)',
      },
    ],
    content: `سلسلة حلقات قصيرة تركز على قصص الكتّاب والمصممين المستقلين في العالم العربي، وعاداتهم الصباحية في تنظيم الأفكار وصقل الإنتاجية.`,
  },
  {
    id: 'note-7',
    title: 'خطة تصميم واجهة نظام المذكرات دوّن',
    category: 'العمل',
    subCategory: 'مشاريع 2025',
    tags: ['#تصميم', '#مهم'],
    color: 'lavender',
    isPinned: true,
    updatedAt: 'منذ 20 دقيقة',
    createdAt: '2025-05-15T10:20:00Z',
    checklists: [
      { id: 'v1', text: 'مراجعة تجربة الاستخدام لشاشات التحرير المتقدم', completed: true },
      { id: 'v2', text: 'تحسين تدفق نظام الأقسام والشُعب المتعددة', completed: true },
      { id: 'v3', text: 'تكامل الواجهة لدعم الخطوط العربية الرشيقة بدقة', completed: true },
      { id: 'v4', text: 'تفعيل الوضع الداكن بنعومة وتوافق كامل', completed: true },
      { id: 'v5', text: 'مزامنة أوفلاين مع IndexedDB', completed: false },
      { id: 'v6', text: 'تصدير واستيراد النسخ الاحتياطية', completed: false },
    ],
    content: `مراجعة تجربة الاستخدام لشاشات التحرير المتقدم، مع تحسين تدفق نظام الأقسام والشُعب المتعددة وتكامل الواجهة لتدعم الخطوط العربية الرشيقة بدقة كاملة.`,
  },
];
