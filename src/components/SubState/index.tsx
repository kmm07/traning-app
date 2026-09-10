/*
 * شارةُ حالة الاشتراك.
 *
 * 🔴 **كانت أيقونةً + نصّاً بلون النصّ العاديّ** ⇒ «مشترك جديد» و«غير مشترك»
 *    و«ملغي» و«خطأ» تُقرأ **بلونٍ واحد**، والفارقُ بينها أيقونةٌ صغيرة
 *    (صحٌّ أو ×) — وثلاثٌ من الأربع تتقاسم الأيقونةَ نفسها (`img_error.svg`)
 *    ⇒ **«غير مشترك» و«ملغي» و«خطأ» متطابقةٌ بصرياً إلا في النصّ**.
 *    صارت شاراتٍ بلونِ حالتها: يفرّقها المدرّب من طرف العين في جدولٍ من
 *    خمسةٍ وعشرين صفّاً.
 *
 * ⚖️ **والواجهةُ لم تتغيّر** — نفسُ الأسماء الأربعة ونفسُ المعاملات، فأربعةُ
 *    مستدعين يعملون بلا تعديل.
 */
type Props = {
  state: "subscriped" | "not_subscriped" | "issue" | "cancelled";
  className?: string;
  textClassName?: string;
};

const MAP: Record<
  Props["state"],
  { name: string; tone: string; dot: string }
> = {
  subscriped: {
    name: "مشترك",
    tone: "bg-success-400/10 text-success-400 border-success-400/25",
    dot: "bg-success-400",
  },
  not_subscriped: {
    name: "غير مشترك",
    tone: "bg-ink-800 text-content-muted border-line-strong",
    dot: "bg-content-faint",
  },
  cancelled: {
    name: "ملغي",
    tone: "bg-warning-400/10 text-warning-400 border-warning-400/25",
    dot: "bg-warning-400",
  },
  issue: {
    name: "خطأ",
    tone: "bg-danger-500/10 text-danger-400 border-danger-500/25",
    dot: "bg-danger-400",
  },
};

function SubState({ state, className = "", textClassName = "" }: Props) {
  const item = MAP[state] ?? MAP.not_subscriped;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${item.tone} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} aria-hidden="true" />
      <span className={textClassName}>{item.name}</span>
    </span>
  );
}

export { SubState };
