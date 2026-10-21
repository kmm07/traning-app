import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import { KpiCard, Section } from "./components";

// الأداء التقني: صحة نداءات الـ API من داخل التطبيق (نسبة الفشل، الأبطأ…).

function ApiHealth({ period }: { period: string }) {
  const url = `/analytics/api-health?period=${period}`;

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
          title="إجمالي النداءات"
          value={s.total_calls?.toLocaleString?.()}
        />
        {/*
         * 🔴 «نداءات فاشلة» وحدها كانت تخلط بوّاباتِ اشتراكٍ ومصادقةٍ (403/401)
         * وتحقّقَ مدخل (422) — سلوكٌ مقصود — مع انقطاع الشبكة و5xx، فتُقرأ
         * بوّابةٌ تعمل كما صُمِّمت عطلاً حيّاً. البطاقتان أدناه تفصلان ما
         * يستحقّ الانتباه (`real_failed`) عمّا لا يستحقّه.
         */}
        <KpiCard
          title="عطلٌ حقيقي"
          value={s.real_failed?.toLocaleString?.()}
          sub={
            s.real_fail_pct != null
              ? `النسبة: ${s.real_fail_pct}% — بلا ردٍّ أو 5xx`
              : undefined
          }
        />
        <KpiCard
          title="رفضٌ متوقّع"
          value={s.expected_failed?.toLocaleString?.()}
          sub="بوّاباتُ اشتراكٍ/مصادقة أو تحقّقُ مدخل (4xx) — سلوكٌ مقصود"
        />
        <KpiCard
          title="متوسط زمن الرد"
          value={s.avg_ms != null ? `${s.avg_ms} ms` : "—"}
        />
      </div>

      <Section title="حسب المسار (العطل الحقيقيّ أولاً)">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right opacity-70 border-b border-blue_gray-900_01">
                <th className="px-4 py-3">المسار</th>
                <th className="px-4 py-3">نداءات</th>
                <th className="px-4 py-3">عطلٌ حقيقي</th>
                <th className="px-4 py-3">رفضٌ متوقّع</th>
                <th className="px-4 py-3">نسبة الفشل</th>
                <th className="px-4 py-3">متوسط (ms)</th>
                <th className="px-4 py-3">أقصى (ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue_gray-900_01">
              {(data?.by_path ?? []).map((r: any) => (
                <tr key={r.path}>
                  <td className="px-4 py-2" dir="ltr">
                    {r.path}
                  </td>
                  <td className="px-4 py-2">{r.calls}</td>
                  <td
                    className={`px-4 py-2 ${
                      r.real_failed > 0 ? "text-red-400 font-bold" : "opacity-50"
                    }`}
                  >
                    {r.real_failed}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      r.expected_failed > 0 ? "text-amber-400" : "opacity-50"
                    }`}
                  >
                    {r.expected_failed}
                  </td>
                  <td className="px-4 py-2">{r.fail_pct}%</td>
                  <td className="px-4 py-2">{r.avg_ms ?? "—"}</td>
                  <td className="px-4 py-2">{r.max_ms ?? "—"}</td>
                </tr>
              ))}
              {!data?.by_path?.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center opacity-60">
                    لا نداءات مسجلة بعد — تظهر مع وصول تحديث التطبيق للمستخدمين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="أبطأ المسارات (5 نداءات فأكثر)">
        <div className="rounded-2xl border border-blue_gray-900_01 bg-gray-900_01 divide-y divide-blue_gray-900_01">
          {(data?.slowest ?? []).map((r: any) => (
            <div key={r.path} className="flex justify-between px-4 py-3 text-sm">
              <span dir="ltr">{r.path}</span>
              <span className="font-bold">
                {r.avg_ms} ms ({r.calls} نداء)
              </span>
            </div>
          ))}
          {!data?.slowest?.length && (
            <div className="px-4 py-6 text-center opacity-60">لا بيانات كافية</div>
          )}
        </div>
      </Section>
    </div>
  );
}

export default ApiHealth;
