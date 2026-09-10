import React from "react";
import { createPortal } from "react-dom";

/*
 * الدرجُ الجانبيّ — يحمل نماذجَ التحرير الطويلة (١٠ ملفات).
 *
 * 🔴 **كان `w-2/3 h-[85%] mt-auto`** — ثلثا الشاشة عرضاً على أيّ مقاس:
 *    على شاشةٍ عريضة نموذجٌ من عمودٍ واحدٍ ممدودٌ على ١٠٠٠px، وعلى حاسبٍ
 *    محمولٍ صغير يبتلع الشاشة. ومحاذاتُه إلى الأسفل (`mt-auto`) تترك فجوةً
 *    فوقه تُرى منها الصفحةُ من طرفٍ واحد — تبدو خطأً في الرسم لا تصميماً.
 *    صار عرضاً مسقوفاً يتبع المقاس، وممتدّاً من أعلى الشاشة إلى أسفلها.
 *
 * ➕ **وزرُّ إغلاقٍ ظاهر** — كان الخروجُ بالضغط على الخلفية وحدها، وهو
 *    فعلٌ لا يُخمَّن.
 */
type Props = {
  children: React.ReactNode;
  label?: string;
  id?: string;
  /** عنوانٌ في رأس الدرج. */
  title?: string;
};

function Drawer({ label, children, id = "my-drawer", title }: Props) {
  /*
   * 🔴 **والدرجُ يُركَّب في `document.body` لا في مكانه من الشجرة.**
   *
   * `.drawer-side` قاعدتُها `position: fixed; top: 0` — أي **بالنسبة إلى
   * الشاشة**. لكن أيَّ سلفٍ عليه `transform` أو `filter` أو حركةٌ مالئةٌ
   * على أحدهما **يصير هو الكتلةَ الحاوية**، فيهبط الدرجُ عند رأس الصفحة
   * بدل رأس الشاشة: من ضغط صفّاً في أسفل جدولٍ طويل لا يراه حتى يمرّر
   * لأعلى — ويعلوه الرأسُ اللاصق لأن سياقَ التكديس يحبس `z-50`.
   *
   * ⚖️ **والبوّابةُ تُغلق العائلة لا الحالة**: لا يبقى للدرج سلفٌ في
   * الصفحة إطلاقاً، فأيُّ تحويلٍ يُضاف غداً في أيّ تخطيطٍ أو بطاقةٍ لا
   * يبلغه. وهي أضمنُ من ملاحقة كل سلفٍ على حدة.
   *
   * ⛔ **وأثرُها على التخطيط صفر — مقيسٌ من CSS المخدوم**: `.drawer-toggle`
   * عليها `display: none`، و`.drawer-content` **لا تُركَّب أصلاً** (صفرُ
   * مستدعٍ يمرّر `label` في المستودع كلِّه) ⇒ الكتلةُ المُضافة إلى الجسم
   * بلا ابنٍ في التدفّق، وارتفاعُها صفر.
   *
   * 📌 وسياقاتُ React تعبر البوّابة (Formik · react-query · التوجيه)،
   * و`getElementById("my-drawer")` يفتحه من أيّ موضعٍ في المستند.
   */
  return createPortal(
    <div className="drawer drawer-end z-50">
      <input id={id} type="checkbox" className="drawer-toggle" />

      {label && (
        <div className="drawer-content">
          <label
            htmlFor={id}
            className="btn cursor-pointer inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 min-h-[42px] text-sm font-semibold !bg-brand-400 !text-ink-950 hover:!bg-brand-300 hover:shadow-glow transition-all"
          >
            {label}
          </label>
        </div>
      )}

      <div className="drawer-side">
        <label htmlFor={id} className="drawer-overlay" aria-label="إغلاق" />

        <div className="drawer-style relative flex flex-col w-full max-w-[720px] md:max-w-none md:w-[92vw] h-full overflow-y-auto !rounded-none md:!rounded-none">
          <div className="sticky top-0 z-10 glass flex items-center justify-between gap-4 px-5 py-4 border-b border-line">
            <span className="text-base font-bold text-content">
              {title ?? ""}
            </span>
            <label
              htmlFor={id}
              aria-label="إغلاق"
              className="h-9 w-9 shrink-0 grid place-items-center rounded-lg text-content-faint hover:text-content hover:bg-ink-800 cursor-pointer transition-colors text-lg leading-none"
            >
              ✕
            </label>
          </div>

          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export { Drawer };
