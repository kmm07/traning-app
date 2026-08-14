import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import { Funnel, KpiCard, Section } from "./components";

// نظرة عامة: القمع الكامل (زائر → نقرة متجر → تثبيت → تسجيل → هوم → اشتراك)
// + بطاقات المؤشرات. الخطوات غير المتاحة قبل تحديث التطبيق تظهر رمادية.

function Overview({ period }: { period: string }) {
  const url = `/analytics/overview?period=${period}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-10 text-center opacity-70">جارِ التحميل…</div>;
  }

  const kpis = data?.kpis ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          title="زوار صفحة الهبوط"
          value={kpis.visitors?.toLocaleString?.()}
        />
        <KpiCard
          title="متوسط سرعة فتح الصفحة"
          value={kpis.avg_load_ms != null ? `${kpis.avg_load_ms} ms` : "—"}
        />
        <KpiCard
          title="نقرات Google Play"
          value={kpis.google_clicks?.toLocaleString?.()}
        />
        <KpiCard
          title="نقرات App Store"
          value={kpis.apple_clicks?.toLocaleString?.()}
        />
        <KpiCard
          title="تثبيتات التطبيق"
          value={kpis.installs?.value?.toLocaleString?.()}
          unavailable={!kpis.installs?.available}
          note={!kpis.installs?.available ? "يتطلب تحديث التطبيق" : undefined}
        />
        <KpiCard
          title="تسجيلات جديدة"
          value={kpis.registered?.toLocaleString?.()}
          sub="من سجلات السيرفر"
        />
        <KpiCard
          title="مشتركون جدد (مدفوع)"
          value={kpis.subscribed?.toLocaleString?.()}
        />
        <KpiCard
          title="نسبة إلغاء التثبيت"
          value={
            kpis.uninstall_rate_pct != null
              ? `${kpis.uninstall_rate_pct}%`
              : "—"
          }
          note="تقديري عبر FCM"
        />
        <KpiCard
          title="جلسات خالية من الانهيار"
          value={
            kpis.crash_free_sessions_pct != null
              ? `${kpis.crash_free_sessions_pct}%`
              : "—"
          }
          unavailable={kpis.crash_free_sessions_pct == null}
          note={
            kpis.crash_free_sessions_pct == null
              ? "يتطلب تحديث التطبيق"
              : undefined
          }
        />
        <KpiCard
          title="النشطون يومياً / أسبوعياً / شهرياً"
          value={`${kpis.dau ?? "—"} / ${kpis.wau ?? "—"} / ${
            kpis.mau ?? "—"
          }`}
          note={kpis.usage_approximate ? "تقريبي" : undefined}
        />
      </div>

      <Section title="قمع الرحلة الكاملة">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 p-5">
          <Funnel steps={data?.funnel ?? []} />
        </div>
      </Section>
    </div>
  );
}

export default Overview;
