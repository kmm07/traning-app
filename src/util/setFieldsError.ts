/**
 * يُسقط أخطاءَ تحقّقِ لارافيل على حقول formik.
 *
 * ⛔ كان `error.response.data.errors` بلا حراسة ⇒ عند فشلٍ شبكيّ (`response`
 * فارغة) أو عند `errorResponse` اليدويّ (`errors` **مصفوفةٌ** لا كائن)
 * ينفجر `Object.entries` **داخل معالج الخطأ نفسه**. والفرعان يقعان فعلاً:
 * الأول في نافذة الـ502 أثناء `reload`، والثاني في كل ردٍّ يبنيه
 * `Traits/Response::errorResponse`.
 */
function setFieldsError(error: any, helpers: any) {
  const errors = error?.response?.data?.errors;

  // كائنٌ مفتاحُه الحقل هو الشكل الوحيد الذي يمكن إسقاطه على حقل.
  if (!errors || Array.isArray(errors) || typeof errors !== "object") return;

  Object.entries(errors).forEach(([field, messages]: [string, any]) => {
    const text = Array.isArray(messages) ? messages[0] : messages;
    if (text) helpers?.setFieldError?.(field, String(text));
  });
}

export default setFieldsError;
