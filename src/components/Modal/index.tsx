import React from "react";
import { createPortal } from "react-dom";
import { Icon } from "components/Icon";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  النافذة — والزرُّ الذي يفتحها
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **ارتفاعُها كان مفروضاً `50vh` لكل نافذةٍ في اللوحة** (`.modal-box`
 *    في الطبقة العامّة) ⇒ حوارٌ من سطرين يترك نصفَ الشاشة فارغاً تحته،
 *    ونموذجُ إضافةِ وجبةٍ طويل **يُقصّ**. صار الارتفاعُ يتبع المحتوى بسقف
 *    ٨٥٪ وتمريرٍ داخليّ (في `styles/index.css`).
 *
 * 🔴 **وأزرارُها كانت تدرّجاتٍ لا صلة لها بالهوية**: «إلغاء» بتدرّجٍ أزرق
 *    و«حذف» بتدرّج **من الأزرق إلى الأحمر** — تدرّجٌ يجعل الفعلَ المدمّر
 *    يبدو زخرفياً. صارت أزراراً من مكوّن الزرّ نفسه: الإلغاءُ محايد
 *    والحذفُ أحمرُ صريح.
 *
 * 🔴 **وكانت بلا زرِّ إغلاق** — لا «×» ولا إغلاقٌ بالضغط على الخلفية إن لم
 *    يكن فيها زرُّ إلغاء. فمن فتح نافذةً بلا `cancel` كان **محبوساً** فيها.
 *
 * ⚖️ **والواجهةُ زادت ولم تتبدّل**: `title` و`size` اختياريان، وكلُّ ما كان
 *    يُمرَّر يعمل حرفياً كما كان (١٧ ملفاً).
 *
 * 🔴 **وكانت تُركَّب في مكانها من الشجرة — والنافذة `position: fixed` لا
 *    تفيد شيئاً حين يكون أحد أسلافها داخل `Drawer` مفتوح.** `.drawer-side
 *    > *:not(.drawer-overlay)` تحمل `transform: translateX(0%)` وهي
 *    مفتوحة (نفس العلّة الموثَّقة في `components/Drawer`)، وأيُّ `transform`
 *    — ولو صفراً — يجعل ذلك السلف **الكتلة الحاوية** لكل نسلٍ `fixed`.
 *    فنافذةُ «إضافة مكون» المفتوحة من داخل درجٍ طويل (وصفةٌ/مستخدم) كانت
 *    تُرسَم بالنسبة إلى ارتفاع محتوى الدرج **كاملاً** لا الشاشة المرئية —
 *    فمن فتحها بعد أن مرّر الدرجَ إلى الأسفل يراها مقصوصةً فوق نافذته،
 *    وحقلُ البحث في أعلاها هو أوّل ما يختفي.
 *
 * ⚖️ **والعلاج بوّابةٌ للصندوق والمفتاح معاً، لا للزرّ الفاتح.** صندوقا
 *    `.modal-toggle` و`.modal` يتلازمان بمركِّب `+` (شقيقان مباشران) في
 *    CSS دايزي، فبقيا معاً في بوّابةٍ واحدة إلى `document.body`؛ أمّا
 *    `label` (الزرّ الفاتح) فيبقى في مكانه من الصفحة — ربطُه بالمفتاح عبر
 *    `htmlFor`/`id` لا يشترط تجاوراً في الشجرة.
 */
type Props = {
  children: React.ReactNode;
  label?: string | React.ReactNode;
  id?: string;
  modalClassName?: string;
  modalOnDelete?: () => void;
  onSave?: () => void;
  className?: string;
  cancel?: boolean;
  /** عنوانٌ في رأس النافذة — يظهر مع خطٍّ فاصلٍ وزرِّ إغلاق. */
  title?: string;
  /** عرضُ النافذة. الافتراضيُّ عرضُ daisyUI كما كان. */
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass: Record<string, string> = {
  sm: "!max-w-md",
  md: "!max-w-xl",
  lg: "!max-w-3xl",
  xl: "!max-w-5xl",
};

function Modal({
  label,
  className,
  modalClassName,
  children,
  id = "my_modal",
  modalOnDelete,
  onSave,
  cancel,
  title,
  size,
}: Props) {
  const hasActions = Boolean(cancel || modalOnDelete || onSave);

  return (
    <>
      {/* الزرُّ الفاتح — لافتةٌ لا زرّ، لأن الفتح بصندوقِ اختيارٍ لا بحالة */}
      {label && (
        <label
          htmlFor={id}
          className={[
            "btn cursor-pointer select-none inline-flex items-center justify-center gap-2",
            "rounded-pill px-5 py-2.5 min-h-[42px] text-sm font-semibold",
            "!bg-brand-btn !text-ink-950 shadow-btn",
            "hover:brightness-[1.06] hover:shadow-glow hover:-translate-y-px",
            "transition-all duration-200 ease-smooth",
            className ?? "",
          ].join(" ")}
        >
          {label}
        </label>
      )}

      {createPortal(
        <>
          <input type="checkbox" id={id} className="modal-toggle" />

          <div className={`modal ${modalClassName ?? ""}`} role="dialog">
            {/* الخلفية: الضغط عليها يُغلق — وكانت لا تفعل شيئاً */}
            <label
              htmlFor={id}
              className="absolute inset-0 cursor-default"
              aria-hidden="true"
            />

            <div
              className={`modal-box relative ${size ? sizeClass[size] : ""}`}
            >
              <label
                htmlFor={id}
                aria-label="إغلاق"
                /*
              ⛔ **وكان محرفَ «✕» نصّاً** — يتبع الخطَّ فيختلف وزنُه وحجمُه
                 عن كل أيقونةٍ حوله، ويُقصّ في بعض الخطوط. صار من مجموعة
                 الأيقونات نفسِها فيتّسق وزنُه معها.
            */
                className="absolute top-3.5 left-3.5 h-8 w-8 grid place-items-center rounded-lg text-content-faint hover:text-content hover:bg-ink-800 active:scale-95 cursor-pointer transition-all duration-200 ease-smooth"
              >
                <Icon name="close" size={16} />
              </label>

              {title && (
                <>
                  <h3 className="text-lg font-bold text-content pe-10">
                    {title}
                  </h3>
                  <div className="divider-soft my-4" />
                </>
              )}

              {children}

              {hasActions && (
                <div className="modal-action flex gap-3 justify-start mt-6">
                  {cancel && (
                    <label
                      htmlFor={id}
                      className="btn cursor-pointer inline-flex items-center justify-center rounded-field px-6 py-2.5 min-h-[42px] text-sm font-semibold !bg-ink-800 !border !border-line !text-content hover:!bg-ink-700 hover:!border-line-strong transition-all duration-200 ease-smooth"
                    >
                      إلغاء
                    </label>
                  )}

                  {modalOnDelete && (
                    <label
                      htmlFor={id}
                      onClick={modalOnDelete}
                      className="btn cursor-pointer inline-flex items-center justify-center gap-2 rounded-field px-6 py-2.5 min-h-[42px] text-sm font-semibold !bg-danger-500 !text-white shadow-btn hover:!bg-danger-600 hover:-translate-y-px transition-all duration-200 ease-smooth"
                    >
                      <Icon name="trash" size={16} />
                      حذف
                    </label>
                  )}

                  {onSave && (
                    <label
                      htmlFor={id}
                      onClick={onSave}
                      className="btn cursor-pointer inline-flex items-center justify-center gap-2 rounded-field px-6 py-2.5 min-h-[42px] text-sm font-semibold !bg-brand-btn !text-ink-950 shadow-btn hover:brightness-[1.06] hover:-translate-y-px transition-all duration-200 ease-smooth"
                    >
                      <Icon name="check" size={16} />
                      حفظ
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

export { Modal };
