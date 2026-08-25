import { createContext, useContext } from "react";

/**
 * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٣-٥]
 *
 * ⛔ **العلّة المقيسة:** خمسةَ عشرَ موضعاً في اللوحة يحذف حذفاً حقيقياً
 * (تمرين · فئة · وصفة · مكوّن · أسبوع تدريب · كوبون · اشتراك · مسؤول)،
 * و**صفرٌ منها خلف تأكيد** — مقيسٌ بالمسح: لا موضعَ واحد يستعمل
 * `Modal.modalOnDelete`، والوحيد الذي يسأل هو `system-notices` بـ
 * `window.confirm`. ⇒ **ضغطةٌ واحدة خاطئة تمحو صفّاً بلا رجعة**، وأكثرُ
 * الحذف في هذا المستودع **صلبٌ لا ناعم** ([[catalog-ingredient-integrity]]).
 *
 * ⚖️ **ونقطةُ قرارٍ واحدة لا خمسةَ عشرَ ترقيعاً:** حوارٌ واحدٌ يُركَّب مرّةً
 * في `App`، ويُنادى من كلّ موضعٍ بسطر. والبديل — تركيبُ `Modal` في كلٍّ —
 * كان يستلزم معرّفاً فريداً وحالةً محلّية في خمسةَ عشرَ ملفاً، **وأن تتباعد
 * الصياغات بصمت** (نمط BUG-15/61).
 *
 * ⚖️ **ولماذا لا `window.confirm`:** يحجب الخيط، ولا يُعرَّب زرّاه، ولا
 * يُبرِز الفعل المدمّر — **والأهمّ** أنه يظهر باسم النطاق فيُقرأ رسالةَ
 * متصفّحٍ لا رسالةَ لوحة. وهو قائمٌ في `system-notices` ويُوحَّد عليه هنا.
 *
 * 📌 **والوعد يُحلّ مرّةً واحدة** — الإغلاق بالخلفية أو بـEsc أو بـ«إلغاء»
 * كلُّها `false`، فلا يبقى وعدٌ معلَّقاً يحبس المستدعي أبداً.
 */
export type ConfirmOptions = {
  /** عنوانٌ قصير — الفعل نفسه: «حذف التمرين؟» */
  title: string;
  /** ما يترتّب عليه — **العواقب لا إعادةُ صياغة العنوان**. */
  message?: string;
  /** نصّ زرّ التنفيذ. الافتراضيّ «حذف». */
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` (افتراضيّ) يصبغ زرّ التنفيذ أحمر. */
  tone?: "danger" | "neutral";
};

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * ⚠️ **يردّ `false` إن لم يكن المزوّد مركَّباً** — لا يرمي ولا يحذف.
 * الامتناع أهون من حذفٍ بلا سؤال (سابقة «الامتناعُ علاجاً»).
 */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);

  return (
    ctx ??
    (async () => {
      // eslint-disable-next-line no-console
      console.error("[panel] useConfirm بلا ConfirmProvider — رُفض الفعل.");
      return false;
    })
  );
}
