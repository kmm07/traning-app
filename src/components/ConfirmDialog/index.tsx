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

          <div className="modal-box relative z-10 bg-gray-900_01 border border-blue_gray-900_01 max-w-md">
            <h3 className="text-lg font-bold">{options.title}</h3>

            {options.message && (
              <p className="py-4 whitespace-pre-line opacity-80">
                {options.message}
              </p>
            )}

            <div className="modal-action flex gap-4 justify-start">
              <button
                type="button"
                autoFocus
                className="btn !px-10 rounded-xl"
                onClick={() => settle(false)}
              >
                {options.cancelLabel ?? "إلغاء"}
              </button>

              <button
                type="button"
                className={`btn !px-10 rounded-xl text-white ${
                  options.tone === "neutral"
                    ? "bg-gradient-to-tr from-sky-500 to-blue-600"
                    : "bg-gradient-to-tr from-orange-500 to-red-600"
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
