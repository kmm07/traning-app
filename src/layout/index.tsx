import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";
import OpsAlertBanner from "components/OpsAlertBanner";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectCurrentToken, setCredentials } from "redux/slices/auth";
import usePermissions from "hooks/usePermissions";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  هيكلُ اللوحة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **كان شبكةً من أحدَ عشرَ عموداً** (`grid-cols-11` · الشريطُ `col-span-2`
 *    والمحتوى `col-span-9`) **بلا حالةٍ واحدة للشاشات الضيّقة**. ونتيجتُه:
 *    الشريطُ يبقى خُمسَ العرض مهما ضاقت الشاشة — على حاسبٍ محمولٍ صغير
 *    يصير عرضُه ٢٤٠px فتُقصّ أسماءُ البنود، وعلى لوحٍ يبتلع الشاشة والجدولُ
 *    بجانبه لا يُقرأ. صار الشريطُ **ثابتَ العرض** والمحتوى يأخذ ما بقي،
 *    ويتحوّل الشريطُ إلى **درجٍ منزلق** دون 1024px.
 *
 * 🔴 **وارتفاعُ الرأس كان `pt-10` مكوَّداً على المحتوى** بينما الرأسُ نفسُه
 *    `p-5` بمحتوىً يقرّر ارتفاعه ⇒ رقمان لا يتّفقان: فراغٌ فوق كل صفحة لا
 *    يساوي ارتفاعَ الرأس. صار الرأسُ `sticky` بارتفاعٍ معلوم (h-16) والمحتوى
 *    يليه مباشرةً — بلا رقمٍ يُخمَّن.
 *
 * ⛔ **و«loading...» كانت نصّاً عارياً** على أرضيةٍ بيضاء (لا صنفَ عليها)
 *    ⇒ ومضةٌ بيضاء في لوحةٍ داكنة عند كل تحقّقٍ من الرمز. صارت هيكلاً
 *    داكناً بلون اللوحة.
 *
 * ⚖️ **ومنطقُ التحقّق من الرمز لم يُمَسّ** — نفسُ القراءة من `localStorage`
 *    ونفسُ ضبط ترويسة axios ونفسُ التحويل إلى صفحة الدخول.
 */

function Layout() {
  const { can } = usePermissions();
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const { pathname } = useLocation();
  const token: string | any = useAppSelector(selectCurrentToken);

  /** الدرجُ في الشاشات الضيّقة. */
  const [menuOpen, setMenuOpen] = useState(false);

  /** طيُّ الشريط في الشاشات العريضة — يُحفظ فلا يُنسى بين الصفحات. */
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pt_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pt_sidebar_collapsed", next ? "1" : "0");
      } catch {
        /* وضعُ التصفّح الخاصّ يمنع الكتابة — الطيُّ يبقى عاملاً لهذه الجلسة */
      }
      return next;
    });
  };

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("userLogin");

    const userParse =
      userLocalStorage !== null
        ? JSON.parse(userLocalStorage ?? "")
        : { token: null, user: null };

    dispatch(setCredentials(userParse));

    axios.defaults.headers.common.Authorization = `Bearer ${
      userParse?.token as string
    }`;
    // redirect to Home
    if (userParse?.token === null || userParse?.token === undefined) {
      void push("/");
    }
  }, [pathname, token]);

  /** الدرجُ يُغلق عند كل انتقال — وإلا بقي فوق الصفحة الجديدة. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /*
   * ⛔ **وكان موضعُ التمرير يُورَّث بين الصفحات.** الحاويةُ هي التي تُمرَّر
   *    لا النافذة، وReact Router لا يمسّها ⇒ من كان في أسفل جدولِ ١٧ ألف
   *    مكوّنٍ ثم فتح «الاشتراكات» يهبط في **منتصف الشاشة الجديدة**: يرى
   *    صفوفاً بلا رأسٍ ولا عنوان فيظنّ الصفحة معطوبة، ويمرّر لأعلى يدوياً
   *    في كل انتقال.
   *
   * ⚖️ **وبـ`auto` لا `smooth`** — والحاويةُ عليها `scroll-behavior: smooth`
   *    فالتمريرُ السلس هنا كان **يُرى انزلاقاً طويلاً** عند كل نقرةِ بندٍ
   *    في الشريط. السلاسةُ لتنقّلِ المستخدم داخل الصفحة، والانتقالُ بين
   *    الصفحات يبدأ من فوقها فوراً.
   */
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  /*
   * 🔴 **وحركةُ دخول الصفحة كانت تكسر كلَّ درجٍ ونافذةٍ في اللوحة.**
   *
   * `animate-page-in` تُشغَّل بـ`fill-mode: both` ⇒ تبقى **مطبَّقةً** على
   * `<main>` بعد انتهائها لا تزول. والمتصفّحُ يعامل عنصراً عليه حركةٌ
   * جاريةٌ أو مالئةٌ على `transform` معاملةَ من عليه تحويلٌ فعليّ ⇒ يصير:
   *   ١. **الكتلةَ الحاويةَ لكل `position: fixed` بداخله** — ودرجُ daisyUI
   *      `position: fixed; top: 0` ⇒ يُوضَع عند **رأس الصفحة** لا رأس
   *      الشاشة، فمن ضغط صفّاً في أسفل جدولٍ طويل لا يراه حتى يمرّر لأعلى.
   *   ٢. **وسياقَ تكديسٍ** يحبس `z-index` أبنائه ⇒ يعلوهما الرأسُ اللاصق.
   *
   * ⛔ **وردُّ آخرِ إطارٍ إلى `transform: none` لا يكفي — مُجرَّبٌ ومقيس:**
   * الحزمةُ حُمّلت والعطلُ باق. لأن العبرة بأن الحركة **ما زالت تُطبَّق**
   * لا بقيمتها الأخيرة.
   *
   * ⚖️ **فالعلاجُ نزعُ الصنف بعد انتهائها** — فلا يبقى على `<main>` حركةٌ
   * ولا تحويلٌ ولا مرشِّح، وهو علاجٌ لا يتوقّف على أيِّ قراءةٍ للمواصفة:
   * العنصرُ بعد الاستقرار **عارٍ**. والحركةُ تُعاد في كل انتقالٍ لأن
   * `settledPath` يفارق المسار الجديد لحظةَ رسمه.
   *
   * 📌 ومهلةٌ احتياطية لأن `animationend` **قد لا يقع أصلاً**: تبويبٌ مخفيّ
   * وقتَ الانتقال، أو `prefers-reduced-motion` يُلغي الحركة. وبلاها يبقى
   * الصنفُ إلى الأبد في الحالتين — وهو عينُ العطل.
   */
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const entering = settledPath !== pathname;

  useEffect(() => {
    const t = window.setTimeout(() => setSettledPath(pathname), 600);
    return () => window.clearTimeout(t);
  }, [pathname]);

  /** Esc يُغلق الدرج — فعلُ خروجٍ متوقَّع لا يحتاج تعلّماً. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  if (token === null || token === undefined) {
    return (
      <div className="h-full w-full bg-surface-base grid place-items-center">
        <div className="w-56 space-y-3" aria-busy="true" aria-label="جارٍ التحميل">
          <div className="skeleton-line h-3 w-full" />
          <div className="skeleton-line h-3 w-4/5" />
          <div className="skeleton-line h-3 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface-base text-content">
      {/*
        شريطُ «حدث اختناق» — **فوق كل شيء** كي يدفع الصفحة لأسفل بدل أن
        يطفو عليها، ولا يرسم شيئاً ما لم يوجد تنبيهٌ غير مقروء.

        [٧ سبتمبر ٢٠٢٦] وهو محروسٌ بقسم «التحليلات» لأن `ops/alerts` صار
        محروساً به ⇒ بلا الترشيح يستقبل كلُّ مديرٍ محدودٍ **403 على كل
        تنقّل**. ⚖️ والقاعدة: **اللوحة لا تطلب ما يرفضه الخادم**.
      */}
      {can("analytics") && <OpsAlertBanner />}

      {/*
        ⛔ **والشريطُ لا يُثبَّت بـ`fixed`.** أوّلُ صياغةٍ ثبّتته
           (`fixed inset-y-0`) فكان يُوضَع بالنسبة إلى **النافذة** لا إلى
           الهيكل ⇒ متى ظهر شريطُ «حدث اختناق» فوقه **انزلق تحته** فيُقصّ
           شعارُه وأوّلُ بنودِه. والبنيةُ الآن عمودٌ يحوي الشريطَ العلويّ
           ثم صفّاً `min-h-0` — فيتبع الجانبيُّ ما بقي من الارتفاع مهما
           عَلاه، بلا رقمٍ يُخصَم يدوياً.
      */}
      <div className="flex flex-1 min-h-0">
        {/* ── الشريطُ الجانبيّ: من 1024px فما فوق ───────────────────── */}
        <aside
          className={`hidden lg:block shrink-0 h-full transition-[width] duration-320 ease-smooth ${
            collapsed ? "w-[76px]" : "w-64"
          }`}
        >
          <SidePar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        </aside>

        {/* ── الدرجُ المنزلق: دون 1024px ─────────────────────────────── */}
        <div
          className={`lg:hidden fixed inset-0 z-50 ${
            menuOpen ? "" : "pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          <div
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-320 ease-smooth ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute inset-y-0 start-0 w-64 max-w-[80vw] shadow-pop transition-transform duration-320 ease-smooth ${
              menuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
            }`}
          >
            <SidePar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>

        {/* ── المحتوى ────────────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto scroll-area"
        >
          <Header onOpenMenu={() => setMenuOpen(true)} scrollRef={scrollRef} />

          {/*
            ⛔ **وكان `animate-fade-in` بلا مفتاح** — فيعمل مرّةً واحدةً عند
               أوّل رسمٍ للتخطيط **ولا يعمل عند أيّ انتقالٍ بعده** (العنصرُ
               نفسُه باقٍ، ولا يُعاد تشغيلُ حركةِ CSS على عنصرٍ لم يُركَّب من
               جديد). ⇒ حركةٌ مكتوبةٌ في الكود ولا تُرى إلا مرّة.
               و`key={pathname}` يُعيد تركيب المحتوى في كل انتقال فتُرى فعلاً.
          */}
          <main
            key={pathname}
            className={`flex-1 p-6 sm:p-4 ${entering ? "animate-page-in" : ""}`}
            /* ⛔ والشرطُ على المصدر لا مطلقاً — الحدثُ يتصاعد من حركةِ أيِّ
               عنصرٍ داخل الصفحة، فبلاه يُنزع الصنفُ قبل أن تبدأ حركةُ الصفحة. */
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget) setSettledPath(pathname);
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
