import { Button, Card, Chip, Input, Modal, SectionHeader, TextArea } from "components";
import { useConfirm } from "components/ConfirmDialog/context";
import { Form, Formik } from "formik";
import { useDeleteQuery, useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import CoachForm, { COACH_MODAL_ID } from "./components/CoachForm";
import { Coach, Money, STATUS_LABEL, STATUS_TONE, sar, usd } from "./shared";
import { AccountsCard, AiUsageCard, CoverageCard, OfferingCard, PayoutRequestCard } from "./components/CoachOps";
import { useAppDispatch } from "hooks/useRedux";
import { openTab } from "redux/slices/coachContext";

/*
 * [اشتراكات المدرّبين · المرحلة ١ — اللوحة] صفحةُ المدرّب: ملخّصٌ · باقاتٌ ·
 * كشفٌ شهريّ (دولار مع ريال) · تحويلات.
 *
 * ⚖️ **«المستحقّ» يستحقّ عند البيع** (حتى السنويّ — قرار خالد)، فلا يُقسَّط
 *    على الأشهر. والاسترداد صفٌّ سالبٌ في شهره، فقد يقلّ مستحقُّ شهرٍ عن صفر.
 *
 * ⚠️ **«بلا مبلغ»** = حدثٌ وصل بلا سعرٍ من المتجر (`amount_missing`)؛ يُعدّ
 *    ولا يُحسب له مال — والعدد يُعرض كي لا يُقرأ الكشفُ كاملاً وهو ناقص.
 */

const PAYOUT_MODAL_ID = "coach-payout-modal";

interface MonthRow {
  month: string;
  sales: number;
  refunds: number;
  missing_amount: number;
  gross: Money;
  tax: Money;
  store_fee: Money;
  net: Money;
  ai_cost: Money;
  coach_share: Money;
  paid_out: Money;
}

interface Payout {
  id: number;
  amount_usd: string | number;
  paid_at: string;
  period: string | null;
  note: string | null;
}

export default function CoachView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { data: coachData, isLoading }: UseQueryResult<any> = useGetQuery(
    `/coaches/${id}`,
    `/coaches/${id}`,
    { select: ({ data }: any) => data.data }
  );

  const { data: statement }: UseQueryResult<any> = useGetQuery(
    `/coaches/${id}/statement`,
    `/coaches/${id}/statement`,
    { select: ({ data }: any) => data.data }
  );

  const { data: payoutsData }: UseQueryResult<any> = useGetQuery(
    `/coaches/${id}/payouts`,
    `/coaches/${id}/payouts`,
    { select: ({ data }: any) => data.data }
  );

  const coach: Coach | undefined = coachData;
  const payouts: Payout[] = payoutsData ?? [];

  const { mutateAsync: del } = useDeleteQuery();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries(`/coaches/${id}`),
      queryClient.invalidateQueries(`/coaches/${id}/statement`),
      queryClient.invalidateQueries(`/coaches/${id}/payouts`),
      queryClient.invalidateQueries("/coaches"),
    ]);
  };

  const onDeleteCoach = async () => {
    if (
      !(await confirm({
        title: "حذف المدرب؟",
        message:
          "يُرفض الحذف إن كانت له باقات أو حركات مالية. أخفِه في هذه الحالة.",
      }))
    )
      return;
    try {
      await del(`/coaches/${id}`);
      await queryClient.invalidateQueries("/coaches");
      navigate("/coaches");
    } catch {
      // الرسالة من `onError`.
    }
  };

  const onDeletePayout = async (p: Payout) => {
    if (
      !(await confirm({
        title: "حذف التحويل؟",
        message: `$${p.amount_usd} بتاريخ ${p.paid_at}. يعود المبلغ إلى المتبقي.`,
      }))
    )
      return;
    try {
      await del(`/coach-payouts/${p.id}`);
      await refresh();
    } catch {
      // الرسالة من `onError`.
    }
  };

  if (isLoading || !coach) {
    return <p className="text-content-muted text-sm">جارٍ التحميل…</p>;
  }

  const months: MonthRow[] = statement?.months ?? [];
  const missing = coach.totals?.missing_amount ?? 0;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <img
          src={coach.image || "/images/img_rectangle347.png"}
          className="w-16 h-16 rounded-full object-cover"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-content">{coach.name}</h2>
            {coach.is_house ? (
              <Chip tone="brand" size="sm">مدرب المنصة</Chip>
            ) : (
              <Chip tone={STATUS_TONE[coach.status]} size="sm">
                {STATUS_LABEL[coach.status]}
              </Chip>
            )}
          </div>
          <p className="text-sm text-content-muted">
            {coach.is_house
              ? "نسبته صفر: إيراد باقاته كله للمنصة"
              : `نسبته ${coach.revenue_share_pct}٪ من الصافي بعد الضريبة وعمولة المتجر وكلفة الذكاء`}
            {coach.offering_id ? ` · Offering: ${coach.offering_id}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {!coach.is_house && (
            <Button
              primary
              size="small"
              onClick={() => {
                // [المرحلة ٤] تبويبٌ لهذا المدرب: اللوحةُ كلُّها كما يراها هو
                dispatch(openTab({ id: coach.id, name: coach.name }));
                queryClient.invalidateQueries();
                navigate("/coach-home");
              }}
            >
              فتح تبويب المدرب
            </Button>
          )}
          <Button
            secondaryBorder
            size="small"
            onClick={() => {
              setEditOpen(true);
              (document.getElementById(COACH_MODAL_ID) as HTMLInputElement | null)?.click();
            }}
          >
            تحرير
          </Button>
          {!coach.is_house && (
            <Button dangerSoft size="small" onClick={onDeleteCoach}>
              حذف
            </Button>
          )}
        </div>
      </div>

      <Modal id={COACH_MODAL_ID} title="تحرير المدرب" size="md">
        {editOpen && <CoachForm coach={coach} onDone={() => setEditOpen(false)} />}
      </Modal>

      {/* ── الملخّص ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile
          label="المشتركون"
          value={String(coach.subscribers?.active ?? 0)}
          sub={`فعّال · ${coach.subscribers?.expired ?? 0} منتهٍ · ${coach.subscribers?.total ?? 0} الكل`}
        />
        <Tile label="المستحق للمدرب" value={usd(coach.totals?.coach_share)} sub={sar(coach.totals?.coach_share)} />
        <Tile label="المحوَّل" value={usd(coach.paid_out)} sub={sar(coach.paid_out)} />
        <Tile label="المتبقي" value={usd(coach.balance)} sub={sar(coach.balance)} highlight />
      </div>

      {/* ── [المرحلة ٤] طلب الصرف · التغطية والإظهار · الذكاء · الحسابات ── */}
      <PayoutRequestCard coach={coach as any} onDone={refresh} />
      <OfferingCard coach={coach} />
      <CoverageCard coach={coach} />
      <AiUsageCard coach={coach} />
      <AccountsCard coach={coach as any} />

      {missing > 0 && (
        <Card padded="sm" className="!border-warning-500/40">
          <p className="text-sm text-warning-400">
            {missing} حركة وصلت من المتجر بلا مبلغ، فلا مال محسوب لها في هذا
            الكشف. راجعها في سجل الحركات.
          </p>
        </Card>
      )}

      {/* ── الباقات ─────────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader
          level="section"
          title="الباقات"
          icon="subscription"
          hint="تُربط الباقة بالمدرب من صفحة «الاشتراكات»"
          divider
        />
        {(coach.products ?? []).length === 0 ? (
          <p className="text-sm text-content-muted mt-4">لا باقات لهذا المدرب بعد.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {coach.products!.map((p: any) => (
              <div key={p.id} className="rounded-xl bg-ink-800/60 px-3 py-2.5 text-sm">
                <p className="font-semibold text-content">{p.name}</p>
                <p className="text-xs text-content-muted" dir="ltr">
                  {p.platform} · {p.months}m · {p.price} · {p.product_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── الكشف الشهري ─────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader
          level="section"
          title="الكشف الشهري"
          icon="calendar"
          hint={`الدولار كما يرسله المتجر، والريال بسعر ${statement?.rates?.sar_per_usd ?? 3.75} · كلفة الذكاء ${statement?.rates?.ai_cost_sar_per_month ?? 4} ر.س لكل شهر مدفوع`}
          divider
        />
        {months.length === 0 ? (
          <p className="text-sm text-content-muted mt-4">لا حركات مالية بعد.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-content-muted text-xs">
                <tr className="text-start">
                  <th className="p-2 text-start">الشهر</th>
                  <th className="p-2 text-start">بيع</th>
                  <th className="p-2 text-start">استرداد</th>
                  <th className="p-2 text-start">الإجمالي</th>
                  <th className="p-2 text-start">الضريبة</th>
                  <th className="p-2 text-start">عمولة المتجر</th>
                  <th className="p-2 text-start">الصافي</th>
                  <th className="p-2 text-start">كلفة الذكاء</th>
                  <th className="p-2 text-start">المستحق</th>
                  <th className="p-2 text-start">المحوَّل</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.month} className="border-t border-line">
                    <td className="p-2 font-semibold text-content" dir="ltr">{m.month}</td>
                    <td className="p-2">
                      {m.sales}
                      {m.missing_amount > 0 && (
                        <span className="text-warning-400 text-xs"> ({m.missing_amount} بلا مبلغ)</span>
                      )}
                    </td>
                    <td className="p-2">{m.refunds}</td>
                    <MoneyCell m={m.gross} />
                    <MoneyCell m={m.tax} />
                    <MoneyCell m={m.store_fee} />
                    <MoneyCell m={m.net} />
                    <MoneyCell m={m.ai_cost} />
                    <MoneyCell m={m.coach_share} strong />
                    <MoneyCell m={m.paid_out} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── التحويلات ─────────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader
          level="section"
          title="التحويلات"
          icon="download"
          hint="ما حُوِّل للمدرب فعلاً، ويُطرح من المتبقي"
          divider
          actions={
            !coach.is_house && (
              <Button
                soft
                size="small"
                onClick={() =>
                  (document.getElementById(PAYOUT_MODAL_ID) as HTMLInputElement | null)?.click()
                }
              >
                تسجيل تحويل
              </Button>
            )
          }
        />
        {payouts.length === 0 ? (
          <p className="text-sm text-content-muted mt-4">لا تحويلات مسجّلة.</p>
        ) : (
          <div className="mt-4 divide-y divide-line">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="font-bold text-content" dir="ltr">
                  ${Number(p.amount_usd).toFixed(2)}
                </span>
                <span className="text-content-muted" dir="ltr">{p.paid_at}</span>
                {p.period && <Chip size="sm">عن {p.period}</Chip>}
                <span className="text-content-muted flex-1 truncate">{p.note}</span>
                <Button dangerSoft size="small" onClick={() => onDeletePayout(p)}>
                  حذف
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal id={PAYOUT_MODAL_ID} title="تسجيل تحويل" size="sm">
        <PayoutForm coachId={Number(id)} onSaved={refresh} />
      </Modal>
    </div>
  );
}

function PayoutForm({ coachId, onSaved }: { coachId: number; onSaved: () => Promise<void> }) {
  const { mutateAsync, isLoading } = usePostQuery({
    url: `/coaches/${coachId}/payouts`,
    contentType: "application/json",
  });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Formik
      initialValues={{ amount_usd: "", paid_at: today, period: today.slice(0, 7), note: "" }}
      onSubmit={async (values, helpers) => {
        try {
          await mutateAsync({ ...values, period: values.period || null } as any);
          helpers.resetForm();
          (document.getElementById(PAYOUT_MODAL_ID) as HTMLInputElement | null)?.click();
          await onSaved();
        } catch {
          // الرسالة من `onError`.
        }
      }}
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-4">
          <Input name="amount_usd" label="المبلغ بالدولار" type={"number" as any} dir="ltr" required />
          <Input name="paid_at" label="تاريخ التحويل" type={"date" as any} dir="ltr" required />
          <Input name="period" label="عن شهر (اختياري)" type={"month" as any} dir="ltr" />
          <TextArea name="note" label="ملاحظة" rows={2} />
          <div className="flex gap-3">
            <Button primary onClick={submitForm} isLoading={isLoading}>
              حفظ
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function Tile({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card padded="sm" className={highlight ? "!border-brand-400/40" : ""}>
      <p className="text-xs text-content-muted">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-brand-400" : "text-content"}`} dir="ltr">
        {value}
      </p>
      {sub && <p className="text-[11px] text-content-faint">{sub}</p>}
    </Card>
  );
}

function MoneyCell({ m, strong }: { m: Money; strong?: boolean }) {
  return (
    <td className="p-2" dir="ltr">
      <span className={strong ? "font-bold text-brand-400" : "text-content"}>{usd(m)}</span>
      <span className="block text-[10px] text-content-faint">{sar(m)}</span>
    </td>
  );
}
