/**
 * نقطةُ قرارٍ واحدة لنصّ رسالة الخطأ في اللوحة.
 *
 * ⛔ **العلّة التي بُنيت لها:** كان النمط `error.response.data.message` مكتوباً
 * في **٤١ موضعاً**. وعند فشلٍ شبكيّ — انقطاع · CORS · **نافذة الـ502 أثناء
 * `reload php8.4-fpm`** — تصل `error.response` **فارغة** ⇒ `TypeError` **داخل
 * معالج الخطأ نفسه** ⇒ لا رسالةٌ ولا سجلّ ولا أثر. أي أن الحالة التي كُتب
 * المعالج لأجلها هي بعينها الحالة التي ينهار فيها.
 *
 * ⚖️ **وهي تفعل أكثر من الحراسة — تُسمّي الحقل.** الخادم يردّ شكلين، وأحدهما
 * كان يُقرأ نصّاً لا ينفع:
 *
 * | المصدر | الشكل | ما كان يُعرض |
 * |---|---|---|
 * | `validate()` من لارافيل | `{message:"The given data was invalid.", errors:{حقل:[نصّ]}}` | **الرسالة العامّة** — لا تسمّي الحقل الذي رُدَّ |
 * | `Response::errorResponse` | `{message, errors:[message], error_code?}` | الرسالة نفسها ✅ |
 *
 * فالأولى تُفكَّك إلى «الحقل: سببه» — وبلا ذلك يقرأ المدرّب
 * «The selected status is invalid.» ولا يعرف أيّ حقلٍ يُصلح.
 */
export function apiErrorMessage(
  error: any,
  fallback = "تعذّر الاتصال بالخادم — أعد المحاولة."
): string {
  const data = error?.response?.data;

  // لا استجابة أصلاً ⇒ فشلٌ شبكيّ لا فشلَ عمل. وهذا هو الفرع الذي كان ينفجر.
  if (!data) return fallback;

  const errors = (data as any).errors;

  // (١) فشلُ تحقّق: كائنٌ مفتاحُه الحقل ⇒ يُسمّى الحقل.
  if (errors && !Array.isArray(errors) && typeof errors === "object") {
    const lines = Object.entries(errors).map(
      ([field, msgs]) =>
        `${field}: ${Array.isArray(msgs) ? msgs.join(" · ") : String(msgs)}`
    );
    if (lines.length) return lines.join("\n");
  }

  // (٢) `errorResponse` اليدويّ — `errors` مصفوفةٌ مسطّحة نسختُها `message`.
  if (Array.isArray(errors) && errors.length && errors[0]) {
    return String(errors[0]);
  }

  if (typeof (data as any).message === "string" && (data as any).message) {
    return (data as any).message;
  }

  return fallback;
}
