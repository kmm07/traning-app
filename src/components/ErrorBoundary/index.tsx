import React from "react";

/**
 * حدُّ خطإٍ **خارج** جهاز التوجيه — يلتقط ما يقع في المزوّدات وفي الشجرة
 * الأعلى من `RouterProvider` (وهو ما لا يبلغه `errorElement`).
 *
 * ⚠️ وحدودُ الخطأ في React تلتقط **استثناءات الرسم** وحدها — لا الأخطاءَ
 * داخل معالجات الأحداث ولا داخل `Promise`. ولذلك **لا تُغني عن حراسة معالجات
 * الخطأ** (`util/apiError`) بل تكمّلها: تلك للفشل المتوقَّع، وهذه للانهيار.
 */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[panel] render crash:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        dir="rtl"
        className="flex flex-col items-center gap-6 p-10 text-white"
      >
        <h1 className="text-2xl font-bold">تعذّر تشغيل اللوحة</h1>
        <p className="opacity-80">أعد تحميل الصفحة. وإن تكرّر، أبلغنا بالتفصيل.</p>
        <button
          className="btn !bg-deep_purple-A200 !text-white rounded-[16px] px-6"
          onClick={() => window.location.reload()}
        >
          إعادة التحميل
        </button>
        <details className="w-full max-w-3xl opacity-70">
          <summary className="cursor-pointer select-none">التفصيل التقنيّ</summary>
          <pre dir="ltr" className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
            {this.state.error?.stack ?? String(this.state.error)}
          </pre>
        </details>
      </div>
    );
  }
}
