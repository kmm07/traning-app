import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, ChartBox, KpiCard, Section } from "./components";

// تبويب صفحة الهبوط: زوار/فتحات/سرعة/نقرات + سلسلة يومية وتوزيعات CTA والمنصة.

const ctaLabels: Record<string, string> = {
  "hero-google": "الرئيسي — Google",
  "hero-apple": "الرئيسي — Apple",
  "mid-google": "الأوسط — Google",
  "mid-apple": "الأوسط — Apple",
  "footer-google": "الشريط السفلي — Google",
  "footer-apple": "الشريط السفلي — Apple",
  "nav-cta": "زر القائمة العلوي",
};

const platformLabels: Record<string, string> = {
  android: "أندرويد",
  ios: "آيفون",
  desktop: "كمبيوتر",
  other: "أخرى",
};

function Landing({ period }: { period: string }) {
  const url = `/analytics/landing?period=${period}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-10 text-center opacity-70">جارِ التحميل…</div>;
  }

  const s = data?.summary ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          title="زوار فريدون"
          value={s.unique_visitors?.toLocaleString?.()}
        />
        <KpiCard title="مرات الفتح" value={s.opens?.toLocaleString?.()} />
        <KpiCard
          title="متوسط سرعة التحميل"
          value={s.avg_load_ms != null ? `${s.avg_load_ms} ms` : "—"}
        />
        <KpiCard
          title="نقرات المتاجر (الإجمالي)"
          value={s.store_clicks?.toLocaleString?.()}
          sub={`ناقرون فريدون: ${s.unique_clickers ?? "—"}`}
        />
        <KpiCard
          title="نقرات Google Play"
          value={s.google_clicks?.toLocaleString?.()}
          sub={`ناقرون فريدون: ${s.google_unique_clickers ?? "—"}`}
        />
        <KpiCard
          title="نقرات App Store"
          value={s.apple_clicks?.toLocaleString?.()}
          sub={`ناقرون فريدون: ${s.apple_unique_clickers ?? "—"}`}
        />
        <KpiCard
          title="نسبة النقر"
          value={s.click_rate_pct != null ? `${s.click_rate_pct}%` : "—"}
        />
        <KpiCard
          title="لم يفعلوا شيئاً"
          value={s.did_nothing?.toLocaleString?.()}
          sub="زاروا الصفحة ولم يضغطوا أي رابط"
        />
      </div>

      <ChartBox title="الزوار والنقرات يومياً">
        <LineChart data={data?.daily ?? []}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={CHART_COLORS.text} fontSize={12} />
          <YAxis stroke={CHART_COLORS.text} fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitors"
            name="زوار"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            name="نقرات"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartBox>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        <Section title="النقرات حسب الزر">
          <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
            {(data?.by_cta ?? []).map((row: any) => (
              <div
                key={row.cta ?? "unknown"}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>{ctaLabels[row.cta] ?? row.cta ?? "غير معروف"}</span>
                <span className="font-bold">
                  {row.clicks} ({row.unique_clickers} فريد)
                </span>
              </div>
            ))}
            {!data?.by_cta?.length && (
              <div className="px-4 py-6 text-center opacity-60">
                لا نقرات بعد
              </div>
            )}
          </div>
        </Section>

        <Section title="الزوار حسب الجهاز + المتجر">
          <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
            {(data?.by_platform ?? []).map((row: any) => (
              <div
                key={row.platform ?? "unknown"}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>{platformLabels[row.platform] ?? row.platform}</span>
                <span className="font-bold">{row.visitors} زائر</span>
              </div>
            ))}
            {(data?.by_store ?? []).map((row: any) => (
              <div
                key={row.store ?? "unknown"}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>
                  نقرات {row.store === "google" ? "Google Play" : "App Store"}
                </span>
                <span className="font-bold">{row.clicks}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

export default Landing;
