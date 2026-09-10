import { useState } from "react";
import useOpsAlerts from "hooks/useOpsAlerts";

/**
 * شريطُ «حدث اختناق» أعلى كل صفحةٍ في اللوحة.
 *
 * ⚖️ **ولماذا شريطٌ لا جرس:** الاختناق حدثٌ نادرٌ وعابر — يقع الثالثة فجراً
 * ويمضي. وأيقونةٌ في الرأس لا تُرى إلا إن نُظر إليها، فكان الخبرُ يضيع بين
 * فتحةٍ وأخرى. والشريط لا يمكن تفويته، و«فهمت» تُخفيه فوراً فلا يصير ضجيجاً.
 *
 * ⛔ **ولا يظهر إلا بتنبيهٍ غير مقروء** — لا شريطَ «كل شيء بخير»: شريطٌ دائم
 * يُقرأ من طرف العين ثم لا يُقرأ أصلاً.
 */
export default function OpsAlertBanner() {
  const { count, severity, alerts, acknowledge } = useOpsAlerts();
  const [expanded, setExpanded] = useState(false);

  if (count === 0 || alerts.length === 0) return null;

  const critical = severity === "critical";
  const top = alerts[0];
  const others = count - 1;

  return (
    <div
      dir="rtl"
      role="alert"
      /*
       * ⚖️ **يبقى ملوَّناً بألوان الحالة لا بالهوية** — الشريطُ إنذارٌ،
       *    ولونُ الهوية لونُ الفعل. لكنّ درجاتِه صارت من سلّم الحالات في
       *    الإعداد (`danger`/`warning`) لا من لوحة Tailwind الافتراضية،
       *    فيتّفق مع بقيّة إشارات اللوحة.
       */
      className={`w-full px-4 py-3 shadow-raised ${
        critical
          ? "bg-danger-600 text-white"
          : "bg-warning-400 text-ink-950"
      }`}
    >
      <div className="flex items-start gap-3 flex-wrap">
        <span className="text-xl leading-6">{critical ? "🔴" : "⚠️"}</span>

        <div className="flex-1 min-w-[240px]">
          <div className="font-bold">
            {top.title}
            <span className="mx-2 font-normal opacity-80">
              · {top.occurred_human}
            </span>
            {others > 0 && (
              <span className="font-normal opacity-80">
                (و{others} {others === 1 ? "تنبيهٌ آخر" : "تنبيهاتٌ أخرى"})
              </span>
            )}
          </div>

          {expanded && (
            <ul className="mt-3 space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="text-sm leading-6 border-e-2 border-current/40 pe-3">
                  <div className="font-semibold">
                    {a.title}
                    <span className="mx-2 font-normal opacity-80">· {a.occurred_human}</span>
                  </div>
                  <div className="opacity-90">{a.detail}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              critical
                ? "bg-white/15 hover:bg-white/25"
                : "bg-ink-950/10 hover:bg-ink-950/20"
            }`}
          >
            {expanded ? "إخفاء التفاصيل" : "التفاصيل"}
          </button>
          <button
            type="button"
            onClick={() => void acknowledge()}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
              critical
                ? "bg-white text-ink-950 hover:bg-ink-100"
                : "bg-ink-950 text-white hover:bg-ink-900"
            }`}
          >
            فهمت
          </button>
        </div>
      </div>
    </div>
  );
}
