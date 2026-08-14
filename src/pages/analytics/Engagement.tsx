import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import { Funnel, KpiCard, Section, fmtSeconds } from "./components";

// قمع الاشتراك (paywall) + قمع الأونبوردنق + أكثر الشاشات استخداماً.
// البيانات من أحداث التطبيق الجديدة (عقد التتبع الموسّع).

const failReasonLabels: Record<string, string> = {
  purchaseCancelledError: "ألغى المستخدم بنفسه",
  paymentPendingError: "دفع معلّق",
  networkError: "مشكلة شبكة",
  not_active_after_purchase: "دفع ولم يتفعّل الاشتراك ⚠️",
  productNotAvailableForPurchaseError: "الباقة غير متاحة في المتجر",
  storeProblemError: "مشكلة في المتجر",
};

const stepLabels: Record<string, string> = {
  basic_info: "المعلومات الأساسية",
  weight_goals: "الوزن والأهداف",
  goal_and_place: "الهدف ومكان التمرين",
  activity_level: "مستوى النشاط",
  training_details: "تفاصيل التدريب",
  timing_preferences: "التوقيتات المفضلة",
  rest_and_nutrition: "الراحة والتغذية",
};

function Engagement({ period }: { period: string }) {
  const url = `/analytics/engagement?period=${period}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  if (isLoading) {
    return <div className="p-10 text-center opacity-70">جارِ التحميل…</div>;
  }

  const pw = data?.paywall ?? {};
  const ob = data?.onboarding ?? {};
  const screens = data?.top_screens ?? [];
  const maxViewed = Math.max(1, ...(ob.steps ?? []).map((s: any) => s.viewed));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          title="فشل الشراء (أجهزة)"
          value={pw.failed?.toLocaleString?.()}
        />
        <KpiCard
          title="متوسط بقاء من غادر دون شراء"
          value={fmtSeconds(pw.avg_paywall_seconds)}
        />
        <KpiCard
          title="مرات ظهور صفحة الاشتراك"
          value={pw.shown_events?.toLocaleString?.()}
        />
        <KpiCard
          title="انسحبوا من التسجيل"
          value={ob.abandoned?.toLocaleString?.()}
          sub="خرجوا قبل إكمال خطوات التسجيل"
        />
      </div>

      <Section title="قمع صفحة الاشتراك (أجهزة فريدة)">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 p-5">
          <Funnel steps={pw.funnel ?? []} />
        </div>
      </Section>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        <Section title="أسباب فشل الشراء">
          <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
            {(pw.fail_reasons ?? []).map((r: any) => (
              <div
                key={r.reason ?? "unknown"}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>{failReasonLabels[r.reason] ?? r.reason ?? "غير معروف"}</span>
                <span className="font-bold">
                  {r.count} ({r.installs} جهاز)
                </span>
              </div>
            ))}
            {!pw.fail_reasons?.length && (
              <div className="px-4 py-6 text-center opacity-60">
                لا حالات فشل في الفترة
              </div>
            )}
          </div>
        </Section>

        <Section title="الباقات: اختيار مقابل شراء">
          <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
            {(pw.by_plan ?? []).map((p: any) => (
              <div
                key={p.plan ?? "unknown"}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span dir="ltr">{p.plan ?? "غير معروف"}</span>
                <span className="font-bold">
                  اختير {p.selected} — اشتُري {p.purchased}
                </span>
              </div>
            ))}
            {!pw.by_plan?.length && (
              <div className="px-4 py-6 text-center opacity-60">لا بيانات بعد</div>
            )}
          </div>
        </Section>
      </div>

      <Section title="قمع خطوات التسجيل (الأونبوردنق)">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 p-5 space-y-3">
          {(ob.steps ?? []).map((s: any) => (
            <div key={s.step_name}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-bold">
                  {s.step_index + 1}. {stepLabels[s.step_name] ?? s.step_name}
                </span>
                <span className="whitespace-nowrap">
                  شاهدها {s.viewed} — أكملها{" "}
                  <b>{s.done}</b>
                  {s.viewed > 0 && (
                    <span className="text-xs opacity-70">
                      {" "}
                      ({Math.round((s.done * 100) / s.viewed)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-800 overflow-hidden flex">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(s.done * 100) / maxViewed}%` }}
                />
                <div
                  className="h-full bg-amber-500/50"
                  style={{
                    width: `${(Math.max(0, s.viewed - s.done) * 100) / maxViewed}%`,
                  }}
                />
              </div>
            </div>
          ))}
          {!ob.steps?.length && (
            <div className="text-center opacity-60 py-4">
              لا بيانات أونبوردنق في الفترة
            </div>
          )}
        </div>
      </Section>

      <Section title="أكثر الشاشات استخداماً">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
          {screens.map((s: any) => (
            <div
              key={s.screen ?? "unknown"}
              className="flex justify-between px-4 py-3 text-sm"
            >
              <span dir="ltr">{s.screen ?? "غير معروف"}</span>
              <span className="font-bold">
                {s.views} مشاهدة ({s.installs} جهاز)
              </span>
            </div>
          ))}
          {!screens.length && (
            <div className="px-4 py-6 text-center opacity-60">
              لا مشاهدات شاشات بعد
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

export default Engagement;
