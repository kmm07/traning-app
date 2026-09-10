import type { IconName } from "components/Icon";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  سجلُّ التنقّل — نقطةُ قرارٍ واحدة للشريط وعنوان الصفحة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ **وكان مكتوباً داخل مكوّن الشريط** ⇒ يُعاد بناءُ المصفوفة كلِّها في كل
 *    رسمة، **ولا يملك أحدٌ غيرُه معرفةَ اسم الصفحة**. ولذلك كان الرأسُ بلا
 *    عنوان: المدرّب يعرف أين هو من لون البند وحده.
 *
 * ⚖️ **والأقسامُ مفاتيحُ الخادم نفسُها** (`messages` · `users` …) — هي التي
 *    يرشّح بها `usePermissions`، ويسمّيها الخادمُ في `sections` عند الدخول.
 *    فلا تُكتب تسميةٌ ثانيةٌ هنا تنزاح عن أمّها.
 */

export interface NavChild {
  name: string;
  link: string;
}

export interface NavItem {
  name: string;
  /** مفتاحُ القسم على الخادم — به يُرشَّح البند. */
  section: string;
  link: string;
  icon: IconName;
  subMenu?: NavChild[];
  /** مجموعةٌ في الشريط — لتقسيم إحدى عشرة بنداً إلى كتلٍ تُقرأ. */
  group: "work" | "catalog" | "system";
}

export const NAV_ITEMS: NavItem[] = [
  /* ── المتابعةُ اليومية ─────────────────────────────────────────────── */
  {
    name: "الرسائل",
    section: "messages",
    link: "/dashboard",
    icon: "messages",
    group: "work",
  },
  {
    name: "المستخدمون",
    section: "users",
    link: "/users",
    icon: "users",
    group: "work",
  },
  {
    name: "الاشتراكات",
    section: "subscriptions",
    link: "/subscriptions",
    icon: "subscription",
    group: "work",
  },
  {
    name: "توصيات المدرب",
    section: "insights",
    link: "/insight-recommendations",
    icon: "insight",
    group: "work",
  },

  /* ── الكتالوج ──────────────────────────────────────────────────────── */
  {
    name: "التغذية",
    section: "nutrition",
    link: "/nutrition",
    icon: "nutrition",
    group: "catalog",
    subMenu: [
      { name: "الوصفات", link: "/nutrition/descriptions" },
      { name: "المكوّنات", link: "/nutrition/ingredients" },
    ],
  },
  {
    name: "التمرين",
    section: "training",
    link: "/exercises",
    icon: "training",
    group: "catalog",
    subMenu: [
      { name: "جدول جيم الرجال", link: "/exercises/table-men" },
      { name: "جدول جيم النساء", link: "/exercises/table-women" },
      { name: "جدول المنزل رجال", link: "/exercises/table-home-men" },
      { name: "جدول المنزل نساء", link: "/exercises/table-home-women" },
      { name: "الكارديو", link: "/exercises/cardio" },
      { name: "تمارين الجيم", link: "/exercises/exercises-gym" },
      { name: "تمارين المنزل", link: "/exercises/exercises-home" },
    ],
  },

  /* ── النظام ───────────────────────────────────────────────────────── */
  {
    name: "الإشعارات",
    section: "notifications",
    link: "/notifications",
    icon: "bell",
    group: "system",
  },
  {
    name: "الكوبونات",
    section: "coupons",
    link: "/coupones",
    icon: "coupon",
    group: "system",
  },
  {
    name: "رسائل التواصل",
    section: "contacts",
    link: "/contacts",
    icon: "inbox",
    group: "system",
  },
  {
    name: "رسائل النظام",
    section: "system_notices",
    link: "/system-notices",
    icon: "megaphone",
    group: "system",
  },
  {
    name: "التحليلات",
    section: "analytics",
    link: "/analytics",
    icon: "analytics",
    group: "system",
  },
  {
    name: "المسؤولون",
    section: "admins",
    link: "/admins",
    icon: "shield",
    group: "system",
  },
];

export const GROUP_LABELS: Record<NavItem["group"], string> = {
  work: "المتابعة",
  catalog: "الكتالوج",
  system: "النظام",
};

/**
 * عنوانُ الصفحة من مسارها — الأطولُ مطابقةً يفوز.
 *
 * ويشمل صفحاتٍ **لا بندَ لها في الشريط** (خطّةُ مستخدم · اشتراكاتُه · أيامُ
 * الأسبوع)، وهي بالضبط الشاشاتُ التي كان المدرّب يهبط فيها بلا أيّ عنوان
 * ولا بندٍ مضاء — أي بلا سبيلٍ إلى معرفة أين هو.
 */
const EXTRA_TITLES: Array<{ match: RegExp; title: string }> = [
  { match: /^\/users\/\d+\/plan/, title: "خطّة المستخدم" },
  { match: /^\/users\/\d+\/subscriptions/, title: "اشتراكات المستخدم" },
  { match: /^\/exercises\/week-days\/\d+/, title: "أيام الأسبوع" },
];

export function titleForPath(pathname: string): string {
  for (const extra of EXTRA_TITLES) {
    if (extra.match.test(pathname)) return extra.title;
  }

  let best = "";
  let bestLen = -1;

  for (const item of NAV_ITEMS) {
    for (const child of item.subMenu ?? []) {
      if (pathname === child.link && child.link.length > bestLen) {
        best = child.name;
        bestLen = child.link.length;
      }
    }
    if (
      (pathname === item.link || pathname.startsWith(item.link + "/")) &&
      item.link.length > bestLen
    ) {
      best = item.name;
      bestLen = item.link.length;
    }
  }

  return best || "لوحة المدرب";
}


/**
 * أيقونةُ القسم من مساره — أطولُ مطابقةٍ تفوز، كما في `titleForPath`.
 *
 * ⚖️ **ولماذا تُشتقّ من المسار لا تُمرَّر من الصفحة**: الجداولُ في اللوحة
 *    عشرون شاشة، وتمريرُ الأيقونة يدوياً يعني عشرين تعديلاً و**عشرين فرصةَ
 *    اختيارٍ مختلف** — فيصير للتغذية أيقونةٌ في الشريط وأخرى في رأس جدولها.
 *    والاشتقاقُ من السجلّ نفسه يجعلها **واحدةً بالبناء**: ما تراه في الشريط
 *    هو ما تراه في الرأس، ومن يضيف قسماً غداً ينالها بلا أن يتذكّر.
 */
export function iconForPath(pathname: string): IconName | undefined {
  let best: IconName | undefined;
  let bestLen = -1;

  for (const item of NAV_ITEMS) {
    for (const child of item.subMenu ?? []) {
      if (pathname === child.link && child.link.length > bestLen) {
        best = item.icon;
        bestLen = child.link.length;
      }
    }
    if (
      (pathname === item.link || pathname.startsWith(item.link + "/")) &&
      item.link.length > bestLen
    ) {
      best = item.icon;
      bestLen = item.link.length;
    }
  }

  return best;
}
