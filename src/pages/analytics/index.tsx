import { useState } from "react";
import { Button } from "components";
import { PeriodSelect } from "./components";
import Overview from "./Overview";
import Landing from "./Landing";
import AppTab from "./AppTab";
import Engagement from "./Engagement";
import ApiHealth from "./ApiHealth";
import Errors from "./Errors";

// لوحة التحليلات: أربعة تبويبات فوق فترة مشتركة (7/30/90 يوم).
// البيانات من /api/admin/analytics/* (كاش سيرفري 5 دقائق).

const tabs = [
  { key: "overview", label: "نظرة عامة" },
  { key: "landing", label: "صفحة الهبوط" },
  { key: "app", label: "التطبيق" },
  { key: "engagement", label: "قمع الاشتراك" },
  { key: "api", label: "الأداء التقني" },
  { key: "errors", label: "الأخطاء" },
] as const;

function Analytics() {
  const [tab, setTab] = useState<string>("overview");
  const [period, setPeriod] = useState<string>("30d");

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Button
              key={t.key}
              className="!w-[130px]"
              primary={tab === t.key}
              secondaryBorder={tab !== t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <PeriodSelect period={period} onChange={setPeriod} />
      </div>

      {tab === "overview" && <Overview period={period} />}
      {tab === "landing" && <Landing period={period} />}
      {tab === "app" && <AppTab period={period} />}
      {tab === "engagement" && <Engagement period={period} />}
      {tab === "api" && <ApiHealth period={period} />}
      {tab === "errors" && <Errors period={period} />}
    </div>
  );
}

export default Analytics;
