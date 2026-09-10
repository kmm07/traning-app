import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  ChartBox,
  fmtSeconds,
  KpiCard,
  Section,
} from "./components";

// تبويب التطبيق: تثبيتات + تفعيل (ثبّت→سجّل→هوم) + استخدام + احتفاظ + إلغاء تثبيت.
// أغلبه يتطلب تحديث التطبيق — قبله تظهر البيانات التقريبية المتاحة فقط.

function AppTab({ period }: { period: string }) {
  const url = `/analytics/app?period=${period}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-10 text-center opacity-70">جارِ التحميل…</div>;
  }

  const installs = data?.installs ?? {};
  const act = data?.activation ?? {};
  const usage = data?.usage ?? {};
  const ret = data?.retention ?? {};
  const un = data?.uninstalls ?? {};
  const live = !!data?.available;

  return (
    <div className="space-y-6">
      {!live && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-300 px-4 py-3 text-sm">
          بيانات التثبيت والجلسات الدقيقة ستبدأ بالظهور بعد نشر تحديث التطبيق
          المتضمن نظام التتبع. المعروض الآن تقديرات من بيانات السيرفر.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          title="تثبيتات في الفترة"
          value={installs.total?.toLocaleString?.()}
          unavailable={!live}
          note={!live ? "يتطلب تحديث التطبيق" : undefined}
        />
        <KpiCard
          title="تثبيتات منسوبة لصفحة الهبوط"
          value={installs.attributed_android?.toLocaleString?.()}
          sub={`أندرويد مؤكد + iOS تقديري: ${installs.ios_estimated ?? "—"}`}
          unavailable={!live}
        />
        <KpiCard
          title="أكملوا التسجيل بعد التثبيت"
          value={
            act.registered != null
              ? `${act.registered} (${act.registered_pct ?? "—"}%)`
              : "—"
          }
          unavailable={!live}
        />
        <KpiCard
          title="وصلوا للصفحة الرئيسية"
          value={
            act.home_reached != null
              ? `${act.home_reached} (${act.home_reached_pct ?? "—"}%)`
              : "—"
          }
          unavailable={!live}
        />
        <KpiCard
          title="النشطون يومياً / أسبوعياً / شهرياً"
          value={`${usage.dau ?? "—"} / ${usage.wau ?? "—"} / ${
            usage.mau ?? "—"
          }`}
          note={usage.approximate ? "تقريبي" : undefined}
        />
        <KpiCard
          title="متوسط مدة الجلسة"
          value={fmtSeconds(usage.avg_session_seconds)}
          sub={
            usage.avg_daily_minutes != null
              ? `متوسط الاستخدام اليومي: ${usage.avg_daily_minutes} دقيقة`
              : undefined
          }
          unavailable={usage.avg_session_seconds == null}
          note={
            usage.avg_session_seconds == null
              ? "يتطلب تحديث التطبيق"
              : undefined
          }
        />
        <KpiCard
          title="متوسط زمن إقلاع التطبيق"
          value={
            usage.avg_startup_ms != null ? `${usage.avg_startup_ms} ms` : "—"
          }
          unavailable={usage.avg_startup_ms == null}
          note={usage.avg_startup_ms == null ? "يتطلب تحديث التطبيق" : undefined}
        />
        <KpiCard
          title="إلغاء التثبيت"
          value={un.count?.toLocaleString?.()}
          sub={un.rate_pct != null ? `النسبة: ${un.rate_pct}%` : undefined}
          note="تقديري عبر FCM — متأخر أياماً خاصة على iOS"
        />
      </div>

      <Section title="الاحتفاظ بالمستخدمين (Retention)">
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {(["d1", "d7", "d30"] as const).map((k, i) => {
            const r = ret[k];
            const label = ["بعد يوم", "بعد 7 أيام", "بعد 30 يوماً"][i];
            return (
              <KpiCard
                key={k}
                title={`الاحتفاظ ${label}`}
                value={r?.pct != null ? `${r.pct}%` : "—"}
                sub={
                  r
                    ? `${r.retained ?? 0} من أصل ${r.cohort_size ?? 0}`
                    : undefined
                }
                note={r?.approximate ? "تقريبي" : undefined}
              />
            );
          })}
        </div>
      </Section>

      <ChartBox title="التثبيتات يومياً">
        <BarChart data={installs.daily ?? []}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={CHART_COLORS.text} fontSize={12} />
          <YAxis stroke={CHART_COLORS.text} fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.surface,
              border: `1px solid ${CHART_COLORS.grid}`,
              borderRadius: 12,
              color: "#F6F6F7",
            }}
            labelStyle={{ color: CHART_COLORS.text }}
          />
          <Bar
            dataKey="installs"
            name="تثبيتات"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartBox>

      {installs.ios_note && (
        <div className="text-xs opacity-60">{installs.ios_note}</div>
      )}
    </div>
  );
}

export default AppTab;
