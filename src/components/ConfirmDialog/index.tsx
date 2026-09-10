import React, { useCallback, useRef, useState } from "react";
import { ConfirmContext, ConfirmFn, ConfirmOptions } from "./context";

/**
 * مزوّدُ حوار التأكيد — يُركَّب مرّةً في `App` ويلفّ جهازَ التوجيه.
 * والحجّةُ الكاملة وشرحُ العلّة في [`./context`](./context.ts).
 *
 * 📌 وفُصل عن خطّافه لأن `react-refresh/only-export-components` يمنع
 *    ملفّاً يُصدِّر مكوّناً ودالّةً معاً — والدمجُ كان يزيد تحذيراً على
 *    أساسِ lint أحمرَ سلفاً، فيضيع فرقُ الجلسة التالية.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  /** يحمل مُحلَّ الوعد الجاري. يُصفَّر عند الحلّ فلا يُحلّ مرّتين. */
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setOptions(null);
    resolve?.(value);
  }, []);

  const confirm = useCallback<ConfirmFn>(
    (next) => {
      // نداءٌ ثانٍ فوق حوارٍ مفتوح: يُرفض الأول صراحةً ولا يُترك معلَّقاً.
      resolverRef.current?.(false);

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setOptions(next);
      });
    },
    []
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {options && (
        /* `modal modal-open z-50` و`dir="rtl"` — نفسُ الصيغة المُثبَتة في
           `Users/plan/DietTab.tsx`، ولا تُخترع صيغةٌ ثانية لنافذةٍ واحدة. */
        <div
          className="modal modal-open z-50"
          dir="rtl"
          role="alertdialog"
          aria-modal="true"
          onKeyDown={(event) => {
            if (event.key === "Escape") settle(false);
          }}
        >
          {/* الخلفية: الضغط عليها إلغاءٌ صريح لا تجاهُل */}
          <div
            className="absolute inset-0"
            onClick={() => settle(false)}
            aria-hidden="true"
          />

          <div className="modal-box relative z-10 !max-w-md animate-fade-in">
            <h3 className="text-lg font-bold text-content">{options.title}</h3>

            {options.message && (
              <p className="pt-3 pb-1 text-sm leading-relaxed whitespace-pre-line text-content-muted">
                {options.message}
              </p>
            )}

            <div className="modal-action flex gap-4 justify-start">
              {/*
                🔴 **كان زرُّ الحذف تدرّجاً برتقالياً-أحمر والإلغاء أزرق** —
                   تدرّجان زخرفيّان يجعلان الفعلَ المدمّر يبدو زرَّ عرضٍ لا
                   تحذيراً. والإلغاءُ **أبرزُ** من الحذف بلونٍ مشبَع، وهو
                   عكسُ ما يُقرأ. صارا مسطَّحين: المحايدُ سطحٌ رماديّ،
                   والمدمّرُ أحمرُ صريحٌ واحد.
              */}
              <button
                type="button"
                autoFocus
                className="btn rounded-field px-8 py-2.5 min-h-[42px] text-sm font-semibold !bg-ink-800 !border !border-line !text-content hover:!bg-ink-700 transition-colors"
                onClick={() => settle(false)}
              >
                {options.cancelLabel ?? "إلغاء"}
              </button>

              <button
                type="button"
                className={`btn rounded-field px-8 py-2.5 min-h-[42px] text-sm font-semibold transition-colors ${
                  options.tone === "neutral"
                    ? "!bg-brand-400 !text-ink-950 hover:!bg-brand-300"
                    : "!bg-danger-500 !text-white hover:!bg-danger-600"
                }`}
                onClick={() => settle(true)}
              >
                {options.confirmLabel ?? "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
