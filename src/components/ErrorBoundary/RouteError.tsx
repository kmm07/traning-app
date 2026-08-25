import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router-dom";

/**
 * `errorElement` للمسارات — يلتقط استثناءَ الرسم في أيّ صفحةٍ تحت الجذر.
 *
 * ⛔ **العلّة:** كانت اللوحة **بلا `ErrorBoundary` ولا `errorElement` ولا
 * `window.onerror` ولا أداةَ رصد** ⇒ أيُّ استثناءٍ أثناء الرسم يُنتج **شاشةً
 * بيضاء** لا أثر لها في أيّ مكان: لا رسالةٌ للمدرّب ولا سطرٌ لنا.
 *
 * ⚖️ **والمفارقة أن الخادم يجمع أخطاء تطبيق فلاتر ويعرضها في تبويب «الأخطاء»،
 * واللوحة نفسها لا تُبلغ عن شيء.**
 *
 * 📌 ولا يُبلَّغ الخطأ إلى خدمةٍ خارجية هنا — ذلك قرارُ مالكٍ لا استنتاجُ
 * تنفيذ. والمتاح الآن: نصٌّ يقوله للمدرّب، وتفصيلٌ **مطويّ** يقرؤه من يشخّص،
 * و`console.error` يلتقطه أيُّ رصدٍ يُضاف لاحقاً.
 */
export default function RouteError() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : "تعذّر عرض هذه الصفحة";

  const detail =
    (error?.stack as string) ??
    (error?.message as string) ??
    String(error ?? "");

  // eslint-disable-next-line no-console
  console.error("[panel] route error:", error);

  return (
    <div dir="rtl" className="flex flex-col items-center gap-6 p-10 text-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-center opacity-80 leading-relaxed max-w-xl">
        وقع خطأٌ أثناء رسم الصفحة. بياناتك على الخادم **لم تُمَسّ** — ما فشل هو
        العرض وحده. أعد المحاولة، وإن تكرّر فأرسل التفصيل أدناه.
      </p>

      <div className="flex gap-3">
        <button
          className="btn !bg-deep_purple-A200 !text-white rounded-[16px] px-6"
          onClick={() => navigate(-1)}
        >
          رجوع
        </button>
        <button
          className="btn !bg-transparent border !border-deep_purple-A200 !text-deep_purple-A200 rounded-[16px] px-6"
          onClick={() => window.location.reload()}
        >
          إعادة التحميل
        </button>
      </div>

      <details className="w-full max-w-3xl mt-4 opacity-70">
        <summary className="cursor-pointer select-none">التفصيل التقنيّ</summary>
        <pre dir="ltr" className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
          {detail}
        </pre>
      </details>
    </div>
  );
}
