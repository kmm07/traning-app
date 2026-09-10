import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "components";
import HeaderCluster from "components/Header";
import { titleForPath } from "layout/nav";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  شريطُ الرأس
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **كان يحمل حرفَ «k» في دائرةٍ زرقاء** — لا شعارَ التطبيق ولا اسمَه،
 *    ومعه «حقلُ بحثٍ» ممدودٌ على ٩٠٪ من عرض الشاشة **لا يبحث في شيء**:
 *    مكوّنُه (`components/Header`) لا يحوي حقلاً إطلاقاً بل جرسَ الإشعارات
 *    واسمَ المستخدم. اسمُ المكوّن وحده كان يقول «بحث».
 *
 * 🔴 **وزرُّ «عودة» كان في التخطيط لا في الرأس** — بارزاً بلون الفعل
 *    الرئيسيّ في أعلى **كل** صفحة، بمحاذاةٍ إلى اليسار وتحته فراغُ
 *    `mb-10`. ⇒ أبرزُ زرٍّ في الشاشة كان «رجوع»، والفعلُ الحقيقيّ (إضافة ·
 *    حفظ) أصغرُ منه وأسفل. صار زرَّ أيقونةٍ محايداً في الرأس بجانب العنوان.
 *
 * ➕ **وعنوانُ الصفحة** — لم يكن للوحة عنوانٌ إطلاقاً. من يهبط على «خطّة
 *    المستخدم» من رابطٍ مباشر كان يرى جدولاً بلا اسم، ولا بندَ شريطٍ مضاءً
 *    (فتلك الشاشةُ خارج الشريط أصلاً).
 */

interface Props {
  onOpenMenu: () => void;
  /** حاويةُ التمرير — يُقرأ منها موضعُ الصفحة لا من النافذة. */
  scrollRef?: RefObject<HTMLDivElement>;
}

function Header({ onOpenMenu, scrollRef }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title = titleForPath(pathname);

  /*
   * ➕ **والرأسُ يرتفع حين تُمرَّر الصفحة تحته.**
   *
   * ⚖️ **وليس زخرفة**: الرأسُ لاصقٌ نصفُ شفّاف، فحين يمرّ تحته جدولٌ داكن
   *    **تختفي حافّتُه** ويبدو النصُّ طافياً فوق الصفوف. حدٌّ أوضحُ وظلٌّ
   *    خفيفٌ عند التمرير وحده يقول «هذه طبقةٌ فوق تلك» — ويعود إلى الهدوء
   *    حين تكون في رأس الصفحة، فلا يُضاف ثقلٌ لا داعي له.
   */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;

    const onScroll = () => setScrolled(el.scrollTop > 4);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, pathname]);

  /** الرسائلُ هي شاشةُ البداية — فلا معنى لزرِّ عودةٍ فيها. */
  const showBack = pathname !== "/dashboard";

  return (
    <header
      className={[
        "sticky top-0 z-40 h-16 shrink-0 glass border-b transition-all duration-200 ease-smooth",
        scrolled ? "border-line-strong shadow-card" : "border-line/60",
      ].join(" ")}
    >
      <div className="h-full flex items-center gap-3 px-4 sm:px-3">
        {/* فاتحُ الشريط في الشاشات الضيّقة */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="فتح قائمة الأقسام"
          className="lg:hidden h-10 w-10 grid place-items-center rounded-field text-content-muted hover:bg-ink-800 hover:text-content active:scale-95 transition-all duration-200 ease-smooth"
        >
          <Icon name="menu" />
        </button>

        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="عودة"
            title="عودة"
            className="h-10 w-10 grid place-items-center rounded-field text-content-muted hover:bg-ink-800 hover:text-content active:scale-95 transition-all duration-200 ease-smooth"
          >
            {/* في RTL يشير سهمُ العودة إلى اليمين */}
            <Icon name="back" className="rtl:rotate-180" />
          </button>
        )}

        {/*
          ⚖️ **والعنوانُ يتبدّل بحركةٍ لا بقفزة** — `key` يُعيد تركيبه في كل
             انتقال فيتلاشى داخلاً مع محتوى الصفحة، فيُقرأ الرأسُ والمحتوى
             **حدثاً واحداً** بدل أن يبدّل الرأسُ كلمتَه قبل أن تصل الصفحة.
        */}
        <h1
          key={title}
          className="text-base sm:text-sm font-bold text-content truncate animate-fade-in"
        >
          {title}
        </h1>

        <div className="flex-1" />

        <HeaderCluster />
      </div>
    </header>
  );
}

export default Header;
