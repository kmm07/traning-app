import { Button, Card, Chip, Modal, SectionHeader } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";
import { useNavigate } from "react-router-dom";
import CoachForm, { COACH_MODAL_ID } from "./components/CoachForm";
import { Coach, STATUS_LABEL, STATUS_TONE, sar, usd } from "./shared";

/*
 * [اشتراكات المدرّبين · المرحلة ١ — اللوحة] قائمةُ المدرّبين — `GET admin/coaches`.
 *
 * بطاقةٌ لكل مدرّب لا صفُّ جدول: الأرقامُ التي تهمّ (مشتركون · المستحقّ ·
 * المتبقّي للتحويل) تُقرأ في نظرة، والنقرُ يفتح كشفَه.
 *
 * ⚖️ **مدرّبُ المنصّة أوّلاً دائماً** — ترتيبُ الخادم (`is_house` تنازلياً).
 *    نسبتُه صفر، فعمودُ «المستحقّ» عنده صفرٌ بحقّ لا عطل.
 */
export default function Coaches() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Coach | null>(null);

  const { data, isLoading }: UseQueryResult<any> =
    useGetQuery("/coaches", "/coaches", {
      select: ({ data }: { data: { data: Coach[] } }) => data.data,
    });
  const coaches: Coach[] = data ?? [];

  const openNew = () => {
    setEditing(null);
    (document.getElementById(COACH_MODAL_ID) as HTMLInputElement | null)?.click();
  };

  return (
    <div className="w-full space-y-5">
      <SectionHeader
        title="المدربون"
        icon="star"
        hint="المدربون وباقاتهم وأرباحهم. المدرب لا يظهر للمستخدمين حتى تكتمل تغطية محتواه"
        actions={
          <Button primary onClick={openNew}>
            إضافة مدرب
          </Button>
        }
      />

      <Modal id={COACH_MODAL_ID} title={editing ? "تحرير المدرب" : "مدرب جديد"} size="md">
        <CoachForm coach={editing} onDone={() => setEditing(null)} />
      </Modal>

      {isLoading ? (
        <p className="text-content-muted text-sm">جارٍ التحميل…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coaches.map((c) => (
            <Card
              key={c.id}
              padded
              onClick={() => navigate(`/coaches/${c.id}`)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.image || "/images/img_rectangle347.png"}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-content truncate">{c.name}</p>
                  <p className="text-xs text-content-muted">
                    {c.is_house
                      ? "مدرب المنصة"
                      : `نسبة ${c.revenue_share_pct}٪ من الصافي`}
                  </p>
                </div>
                {c.is_house ? (
                  <Chip tone="brand" size="sm">المنصة</Chip>
                ) : (
                  <Chip tone={STATUS_TONE[c.status]} size="sm">
                    {STATUS_LABEL[c.status]}
                  </Chip>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <Stat label="مشتركون فعّالون" value={String(c.subscribers?.active ?? 0)} />
                <Stat label="المستحق" value={usd(c.totals?.coach_share)} sub={sar(c.totals?.coach_share)} />
                <Stat label="المتبقي" value={usd(c.balance)} sub={sar(c.balance)} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-ink-800/60 py-2.5 px-1">
      <p className="text-[11px] text-content-muted">{label}</p>
      <p className="text-sm font-bold text-content" dir="ltr">{value}</p>
      {sub && <p className="text-[10px] text-content-faint" dir="ltr">{sub}</p>}
    </div>
  );
}
