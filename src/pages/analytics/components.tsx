import React from "react";
import { ResponsiveContainer } from "recharts";

// عناصر مشتركة لصفحة التحليلات: بطاقة KPI، القمع، صندوق رسم بياني، منتقي الفترة.

export const PERIODS = [
  { key: "7d", label: "7 أيام" },
  { key: "30d", label: "30 يوم" },
  { key: "90d", label: "90 يوم" },
] as const;

export function PeriodSelect({
  period,
  onChange,
}: {
  period: string;
  onChange: (p: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          /*
           * 🔴 **`bg-primary text-white`** — وقد صار `primary` لونَ الهوية
           *    الليمونيّ، والأبيضُ فوقه **1.4:1**: نصٌّ لا يُقرأ. النصُّ
           *    الصحيح على الليمونيّ أسود.
           */
          className={`px-4 py-2 rounded-pill text-sm font-semibold transition-colors ${
            period === p.key
              ? "bg-brand-400 text-ink-950"
              : "bg-ink-800 text-content-muted hover:bg-ink-700 hover:text-content"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function KpiCard({
  title,
  value,
  sub,
  note,
  unavailable,
}: {
  title: string;
  value: React.ReactNode;
  sub?: string;
  note?: string;
  unavailable?: boolean;
}) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-4 space-y-1 transition-colors hover:border-line-strong ${
        unavailable ? "opacity-50" : ""
      }`}
    >
      <div className="text-sm text-content-muted">{title}</div>
      <div className="text-2xl font-bold text-content">
        {unavailable ? "—" : value ?? "—"}
      </div>
      {sub && <div className="text-xs text-content-faint">{sub}</div>}
      {note && (
        <div className="text-xs text-warning-400 bg-warning-400/10 border border-warning-400/25 rounded-pill px-2 py-0.5 inline-block">
          {note}
        </div>
      )}
    </div>
  );
}

// قمع RTL مبني يدوياً: recharts FunnelChart ضعيف مع RTL والتسميات العربية
export function Funnel({ steps }: { steps: any[] }) {
  const max = Math.max(
    1,
    ...steps.filter((s) => s.available).map((s) => s.count)
  );

  return (
    <div className="space-y-3">
      {steps.map((s) => (
        <div key={s.key} className={s.available ? "" : "opacity-50"}>
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{s.label}</span>
              {s.note && (
                <span className="text-xs text-amber-400 bg-amber-500/10 rounded-full px-2 py-0.5">
                  {s.note}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap">
              {s.available && s.dropped != null && s.dropped > 0 && (
                <span className="text-xs text-red-400">
                  تسرب {s.dropped.toLocaleString()} ({s.drop_pct}%)
                </span>
              )}
              <span className="font-bold text-lg">
                {s.available ? s.count.toLocaleString() : "—"}
              </span>
            </div>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                s.available ? "bg-primary" : "bg-gray-600"
              }`}
              style={{
                width: s.available
                  ? `${Math.max(2, (s.count * 100) / max)}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// الرسوم داخل حاوية LTR — محاور recharts تتشوه داخل سياق RTL
export function ChartBox({
  title,
  height = 260,
  children,
}: {
  title: string;
  height?: number;
  children: React.ReactElement;
}) {
  return (
    <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 p-4">
      <div className="font-bold mb-3">{title}</div>
      <div dir="ltr" style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      {children}
    </div>
  );
}

/*
 * ألوانُ الرسوم البيانية.
 *
 * ⛔ **كانت من عائلةٍ رماديةٍ زرقاء** (`#334155` شبكةً و`#94a3b8` نصّاً
 *    و`#0f172a` أرضيةَ التلميح) لا صلةَ لها بحياديّ اللوحة ⇒ الرسمُ يبدو
 *    مقتطعاً من لوحةٍ أخرى ملصوقاً في هذه.
 *
 * 🔑 **والسلسلتان مقيستان لا مختارتان بالذوق:** مُرّرتا على مدقّق التباين
 *    ومحاكاة عمى الألوان على أرضية البطاقة (`#141416`) فأعطتا:
 *    نطاقُ الإضاءة ✅ · أرضيةُ التشبّع ✅ · فصلُ CVD **ΔE 26.2** (والحدُّ
 *    ٨) · وفصلُ الرؤية العادية **28.2** · والتباينُ على الأرضية ≥3:1
 *    (**5.82:1** و**3.10:1**). ⛔ **ولذلك ليستا لونَ الهوية نفسَه**:
 *    `#D1FE0F` إضاءتُه **0.93** — خارج نطاق الرسم على أرضيةٍ داكنة
 *    (يبهر ويطمس شكلَ الخطّ)، فأُخذت درجتُه الأغمق من السلّم نفسه.
 *
 * ⚖️ **والحالاتُ محجوزة**: `warn` و`danger` لا تُستعملان سلسلةً ثالثة —
 *    وإلا قُرئ ارتفاعُ رقمٍ عادّيٍّ إنذاراً.
 */
export const CHART_COLORS = {
  primary: "#7E9C00",
  secondary: "#0369A1",
  warn: "#FFB020",
  danger: "#F04438",
  grid: "#232326",
  text: "#A1A1AA",
  surface: "#141416",
};

export function fmtSeconds(s?: number | null) {
  if (s == null) return "—";
  if (s < 60) return `${s} ث`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `${m} د ${rest} ث` : `${m} د`;
}
