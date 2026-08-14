import { useState } from "react";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import { KpiCard, Section } from "./components";

// تبويب الأخطاء: ملخص + مجموعات مجمّعة بالبصمة (fingerprint) — النقر على
// مجموعة يفتح حدوثاتها مع stack trace كامل (LTR monospace).

const typeLabels: Record<string, string> = {
  flutter_error: "خطأ واجهة Flutter",
  dart_uncaught: "خطأ Dart غير معالج",
  abnormal_exit: "إغلاق مفاجئ (انهيار)",
};

const typeColors: Record<string, string> = {
  flutter_error: "bg-sky-500/20 text-sky-400",
  dart_uncaught: "bg-amber-500/20 text-amber-400",
  abnormal_exit: "bg-red-500/20 text-red-400",
};

function ErrorDetail({
  fingerprint,
  period,
}: {
  fingerprint: string;
  period: string;
}) {
  const url = `/analytics/errors/${fingerprint}?period=${period}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-4 text-center opacity-70">جارِ التحميل…</div>;
  }

  const occurrences = data?.occurrences?.data ?? [];

  return (
    <div className="space-y-3 p-4 bg-gray-900 rounded-xl">
      {occurrences.map((o: any) => (
        <div
          key={o.id}
          className="rounded-lg border border-blue_gray-900_01 p-3 space-y-2"
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-80">
            <span>{o.occurred_at}</span>
            <span>{o.user_name ?? "زائر غير مسجل"}</span>
            <span>{o.device_model ?? o.platform}</span>
            <span>نسخة {o.app_version ?? "؟"}</span>
            {o.screen && <span>الشاشة: {o.screen}</span>}
          </div>
          <div className="text-sm font-bold break-words">{o.message}</div>
          {o.stack_trace && (
            <pre
              dir="ltr"
              className="text-xs bg-black/40 rounded-lg p-3 overflow-x-auto max-h-64 whitespace-pre-wrap font-mono"
            >
              {o.stack_trace}
            </pre>
          )}
        </div>
      ))}
      {!occurrences.length && (
        <div className="text-center opacity-60 py-4">لا حدوثات في الفترة</div>
      )}
    </div>
  );
}

function Errors({ period }: { period: string }) {
  const url = `/analytics/errors?period=${period}`;
  const [openFp, setOpenFp] = useState<string | null>(null);

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-10 text-center opacity-70">جارِ التحميل…</div>;
  }

  const s = data?.summary ?? {};
  const groups = data?.groups ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          title="إجمالي الأخطاء"
          value={s.total_errors?.toLocaleString?.()}
        />
        <KpiCard
          title="الانهيارات"
          value={s.crashes?.toLocaleString?.()}
          sub="إغلاق مفاجئ + أخطاء غير معالجة"
        />
        <KpiCard
          title="أجهزة متأثرة"
          value={s.affected_installs?.toLocaleString?.()}
        />
        <KpiCard
          title="جلسات خالية من الانهيار"
          value={
            s.crash_free_sessions_pct != null
              ? `${s.crash_free_sessions_pct}%`
              : "—"
          }
          unavailable={s.crash_free_sessions_pct == null}
          note={
            s.crash_free_sessions_pct == null
              ? "يتطلب تحديث التطبيق"
              : undefined
          }
        />
      </div>

      {(s.top_error || s.top_screen) && (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {s.top_error && (
            <KpiCard
              title="الخطأ الأكثر تكراراً"
              value={
                <span className="text-base break-words">
                  {s.top_error.message}
                </span>
              }
              sub={`تكرر ${s.top_error.count} مرة`}
            />
          )}
          {s.top_screen && (
            <KpiCard
              title="الشاشة الأكثر تأثراً"
              value={<span dir="ltr">{s.top_screen.screen}</span>}
              sub={`${s.top_screen.count} خطأ`}
            />
          )}
        </div>
      )}

      <Section title="مجموعات الأخطاء (انقر للتفاصيل)">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01 overflow-hidden">
          {groups.map((g: any) => (
            <div key={g.fingerprint}>
              <button
                className="w-full text-right px-4 py-3 hover:bg-gray-800/50 transition-colors"
                onClick={() =>
                  setOpenFp(openFp === g.fingerprint ? null : g.fingerprint)
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                        typeColors[g.type] ?? "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {typeLabels[g.type] ?? g.type}
                    </span>
                    <span className="font-bold text-sm truncate max-w-[420px]">
                      {g.exception_class ? `${g.exception_class}: ` : ""}
                      {g.message_sample}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs whitespace-nowrap opacity-80">
                    {g.top_screen && <span dir="ltr">{g.top_screen}</span>}
                    <span>{g.affected_installs} جهاز</span>
                    <span className="font-bold text-sm">{g.count}×</span>
                  </div>
                </div>
                <div className="text-xs opacity-50 mt-1 text-right">
                  آخر ظهور: {g.last_seen} — نسخة {g.top_app_version ?? "؟"}
                </div>
              </button>
              {openFp === g.fingerprint && (
                <ErrorDetail fingerprint={g.fingerprint} period={period} />
              )}
            </div>
          ))}
          {!groups.length && (
            <div className="px-4 py-10 text-center opacity-60">
              لا أخطاء مسجلة في هذه الفترة 🎉
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

export default Errors;
