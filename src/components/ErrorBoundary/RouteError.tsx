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
    <div
      dir="rtl"
      className="min-h-[60vh] flex flex-col items-center justify-center gap-5 p-10 text-content"
    >
      <div className="h-14 w-14 grid place-items-center rounded-2xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-2xl">
        !
      </div>

      <h1 className="text-xl font-bold text-center">{title}</h1>
      <p className="text-center text-sm text-content-muted leading-relaxed max-w-xl">
        وقع خطأٌ أثناء رسم الصفحة. بياناتك على الخادم **لم تُمَسّ** — ما فشل هو
        العرض وحده. أعد المحاولة، وإن تكرّر فأرسل التفصيل أدناه.
      </p>

      <div className="flex gap-3">
        <button
          className="btn rounded-field px-6 py-2.5 text-sm font-semibold !bg-brand-400 !text-ink-950 hover:!bg-brand-300 transition-colors"
          onClick={() => navigate(-1)}
        >
          رجوع
        </button>
        <button
          className="btn rounded-field px-6 py-2.5 text-sm font-semibold !bg-transparent border !border-line-strong !text-content hover:!border-brand-400 hover:!text-brand-400 transition-colors"
          onClick={() => window.location.reload()}
        >
          إعادة التحميل
        </button>
      </div>

      <details className="w-full max-w-3xl mt-4">
        <summary className="cursor-pointer select-none text-sm text-content-faint hover:text-content-muted transition-colors">
          التفصيل التقنيّ
        </summary>
        <pre
          dir="ltr"
          className="mt-3 p-4 rounded-card bg-ink-900 border border-line overflow-auto text-xs whitespace-pre-wrap text-content-faint"
        >
          {detail}
        </pre>
      </details>
    </div>
  );
}
