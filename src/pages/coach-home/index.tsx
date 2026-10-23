import { Button, Card, Chip, Input, SectionHeader, TextArea } from "components";
import { useConfirm } from "components/ConfirmDialog/context";
import { Form, Formik } from "formik";
import usePermissions from "hooks/usePermissions";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { useMemo, useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Money, sar, usd } from "pages/coaches/shared";

/*
 * [اشتراكات المدرّبين · المرحلة ٤] ملخّصُ المدرّب — أول ما يراه بعد الدخول.
 *
 * يعمل لحساب المدرّب **وللمدير الأعلى داخل تبويب المدرّب** بلا فرق: الخادمُ يحدّد المدرّبَ من النطاق
 * (حسابُه أو ترويسةُ التبويب) فلا يُمرَّر معرّفٌ من هنا.
 *
 * ⛔ **المدرّبُ لا يرى إلا صافيه**: لا إجمالي ولا ضريبة ولا عمولة متجر ولا كلفة ذكاء ولا نسبة المنصّة —
 *    الخادمُ لا يرسلها أصلاً، فلا يُخفى هنا شيءٌ يمكن أن يتسرّب.
 *
 * ⚖️ **«المتاح» جاهزٌ حقاً**: الربحُ يدخله بعد مدّة الاسترداد، والمعلَّقُ يظهر منفصلاً، فلا يطلب المدرّبُ
 *    مالاً قد يُستردّ.
 */

interface Summary {
  coach: { id: number; name: string; image: string | null };
  subscribers: { active: number; canceling: number; expired: number };
  money: {
    available: Money; pending: Money; on_hold: Money; paid_out: Money; total_earned: Money;
    min_request: Money; hold_days: number;
  };
  open_request: { id: number; amount_usd: number; requested_at: string } | null;
  ai: { used_today: number; cap: number };
  notifications: Record<"all" | "selected", { cap: number; left: number }>;
}

interface Subscriber {
  user_id: number; name: string; email: string | null; phone: string | null;
  status: "active" | "canceling" | "expired"; product: string | null; months: number | null;
  period_start: string | null; period_end: string | null;
}

interface Product {
  product_id: string; name: string; sold: number; renewals: number; refunded: number; earned: Money;
}

const STATUS: Record<Subscriber["status"], { label: string; tone: "success" | "warning" | "neutral" }> = {
  active: { label: "فعّال", tone: "success" },
  canceling: { label: "ألغى التجديد", tone: "warning" },
  expired: { label: "منتهٍ", tone: "neutral" },
};

export default function CoachHome() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { readOnly, activeCoach } = usePermissions();
  const [filter, setFilter] = useState<"all" | Subscriber["status"]>("all");

  // مفتاحُ الاستعلام يحمل السياق: تبويبُ مدرّبٍ آخر لا يُعرض تحته ردُّ سابقِه
  const key = (u: string) => [u, activeCoach];

  const { data: summaryRaw, isLoading }: UseQueryResult<any> = useGetQuery(key("/coach/summary"), "/coach/summary", {
    select: ({ data }: any) => data.data,
  });
  const { data: subscribersRaw }: UseQueryResult<any> = useGetQuery(key("/coach/subscribers"), "/coach/subscribers", {
    select: ({ data }: any) => data.data,
  });
  const { data: productsRaw }: UseQueryResult<any> = useGetQuery(key("/coach/products"), "/coach/products", {
    select: ({ data }: any) => data.data,
  });
  const summary = summaryRaw as Summary | undefined;
  const subscribers: Subscriber[] = subscribersRaw ?? [];
  const products: Product[] = productsRaw ?? [];

  const refresh = () =>
    Promise.all(["/coach/summary", "/coach/subscribers", "/coach/products"].map((u) => queryClient.invalidateQueries(key(u))));

  const { mutateAsync: requestPayout, isLoading: requesting } = usePostQuery({
    url: "/coach/payout-requests",
    contentType: "application/json",
  });

  const shown = useMemo(
    () => (filter === "all" ? subscribers : subscribers.filter((s) => s.status === filter)),
    [subscribers, filter]
  );

  if (isLoading || !summary) {
    return <p className="text-content-muted text-sm">جارٍ التحميل…</p>;
  }

  const m = summary.money;
  const canAsk =
    !readOnly && !summary.open_request && m.available.usd >= m.min_request.usd;

  const onRequest = async () => {
    const ok = await confirm({
      title: "طلب صرف الأرباح؟",
      message: `سيصل طلبٌ بمبلغ ${usd(m.available)} (${sar(m.available)}) إلى الإدارة، ويتحوّل رصيدك إلى «في انتظار التحويل».`,
      confirmLabel: "إرسال الطلب",
      tone: "neutral",
    });
    if (!ok) return;
    try {
      await requestPayout({} as any);
      await refresh();
    } catch {
      // الرسالة من `onError`.
    }
  };

  return (
    <div className="w-full space-y-5">
      <SectionHeader
        title={`ملخّص ${summary.coach.name}`}
        icon="analytics"
        hint="مشتركوك وأرباحك الصافية ومنتجاتك وإشعاراتك"
        actions={readOnly ? <Chip tone="warning" size="sm">قراءة فقط</Chip> : undefined}
      />

      {/* ── المشتركون ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile label="مشتركون فعّالون" value={String(summary.subscribers.active)} />
        <Tile label="ألغوا التجديد" value={String(summary.subscribers.canceling)} sub="ما زالوا مشتركين حتى نهاية مدّتهم" />
        <Tile label="انتهى اشتراكهم" value={String(summary.subscribers.expired)} sub="يظهرون ٣٠ يوماً بعد الانتهاء" />
        <Tile label="أرباحي المتاحة" value={usd(m.available)} sub={sar(m.available)} highlight />
      </div>

      {/* ── الأرباح ─────────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader
          level="section"
          title="الأرباح"
          icon="download"
          hint={`الصافي بعد نسبة المنصة والمتجر والذكاء. يصير الربح متاحاً بعد ${m.hold_days} يوماً من البيع (نافذة الاسترداد).`}
          divider
          actions={
            <Button primary size="small" onClick={onRequest} isLoading={requesting} disabled={!canAsk}>
              اطلب صرف المتاح
            </Button>
          }
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <Tile label="متاح للمطالبة" value={usd(m.available)} sub={sar(m.available)} highlight />
          <Tile label="معلَّق (لم تمرّ مدّة الاسترداد)" value={usd(m.on_hold)} sub={sar(m.on_hold)} />
          <Tile label="في انتظار التحويل" value={usd(m.pending)} sub={sar(m.pending)} />
          <Tile label="حُوِّل لك" value={usd(m.paid_out)} sub={sar(m.paid_out)} />
        </div>
        {summary.open_request ? (
          <p className="text-sm text-warning-400 mt-3">
            لديك طلب صرف بمبلغ <b dir="ltr">${summary.open_request.amount_usd}</b> قيد الانتظار منذ {summary.open_request.requested_at}.
          </p>
        ) : (
          m.available.usd < m.min_request.usd && (
            <p className="text-xs text-content-muted mt-3">
              الحدّ الأدنى لطلب الصرف {usd(m.min_request)}.
            </p>
          )
        )}
      </Card>

      {/* ── المنتجات ────────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader level="section" title="منتجاتي" icon="subscription" hint="كم باع كل منتج وكم ربحتَ منه" divider />
        {products.length === 0 ? (
          <p className="text-sm text-content-muted mt-4">لا مبيعات بعد.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-content-muted text-xs">
                <tr>
                  <th className="p-2 text-start">المنتج</th>
                  <th className="p-2 text-start">مبيعات</th>
                  <th className="p-2 text-start">تجديدات</th>
                  <th className="p-2 text-start">مستردّة</th>
                  <th className="p-2 text-start">ربحي</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.product_id} className="border-t border-line">
                    <td className="p-2 font-semibold text-content" dir="ltr">{p.name}</td>
                    <td className="p-2">{p.sold}</td>
                    <td className="p-2">{p.renewals}</td>
                    <td className="p-2">{p.refunded}</td>
                    <td className="p-2" dir="ltr">
                      <span className="font-bold text-brand-400">{usd(p.earned)}</span>
                      <span className="block text-[10px] text-content-faint">{sar(p.earned)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── المشتركون ───────────────────────────────────────────────── */}
      <Card padded>
        <SectionHeader
          level="section"
          title="مشتركوني"
          icon="users"
          divider
          actions={
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "active", "canceling", "expired"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    filter === f ? "bg-brand-400 text-ink-900 font-bold" : "bg-ink-800 text-content-muted"
                  }`}
                >
                  {f === "all" ? "الكل" : STATUS[f].label}
                </button>
              ))}
            </div>
          }
        />
        {shown.length === 0 ? (
          <p className="text-sm text-content-muted mt-4">لا مشتركين في هذا التصنيف.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-content-muted text-xs">
                <tr>
                  <th className="p-2 text-start">المشترك</th>
                  <th className="p-2 text-start">الحالة</th>
                  <th className="p-2 text-start">المنتج</th>
                  <th className="p-2 text-start">من</th>
                  <th className="p-2 text-start">إلى</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s.user_id} className="border-t border-line">
                    <td className="p-2">
                      <p className="font-semibold text-content">{s.name}</p>
                      {s.email && <p className="text-[11px] text-content-faint" dir="ltr">{s.email}</p>}
                    </td>
                    <td className="p-2"><Chip tone={STATUS[s.status].tone} size="sm">{STATUS[s.status].label}</Chip></td>
                    <td className="p-2" dir="ltr">{s.product ?? "—"}{s.months ? ` · ${s.months}m` : ""}</td>
                    <td className="p-2" dir="ltr">{s.period_start ?? "—"}</td>
                    <td className="p-2" dir="ltr">{s.period_end ?? "—"}</td>
                    <td className="p-2">
                      <Button soft size="small" onClick={() => navigate(`/users/${s.user_id}/plan`)}>
                        فتح
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <NotifyCard summary={summary} subscribers={subscribers} onSent={refresh} />

      <PasswordCard />

      <p className="text-xs text-content-faint">
        نداءات الذكاء اليوم: {summary.ai.used_today} من {summary.ai.cap}
      </p>
    </div>
  );
}

function NotifyCard({ summary, subscribers, onSent }: { summary: Summary; subscribers: Subscriber[]; onSent: () => Promise<unknown> }) {
  const { mutateAsync, isLoading } = usePostQuery({ url: "/coach/notifications", contentType: "application/json" });
  const [audience, setAudience] = useState<"all" | "selected">("all");
  const [picked, setPicked] = useState<number[]>([]);
  const left = summary.notifications[audience].left;
  const active = subscribers.filter((s) => s.status !== "expired");

  return (
    <Card padded>
      <SectionHeader
        level="section"
        title="إشعار لمشتركيّ"
        icon="bell"
        hint="يصل مشتركيك وحدهم — لا غيرهم من مستخدمي التطبيق"
        divider
      />
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values, helpers) => {
          if (audience === "selected" && picked.length === 0) {
            toast.error("اختر مشتركاً واحداً على الأقل");
            return;
          }
          try {
            await mutateAsync({ audience, ...values, ...(audience === "selected" ? { user_ids: picked } : {}) } as any);
            helpers.resetForm();
            setPicked([]);
            await onSent();
          } catch {
            // الرسالة من `onError`.
          }
        }}
      >
        {({ submitForm }) => (
          <Form className="flex flex-col gap-4 mt-4">
            <div className="flex gap-2">
              {(["all", "selected"] as const).map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-4 py-1.5 rounded-lg text-sm ${audience === a ? "bg-brand-400 text-ink-900 font-bold" : "bg-ink-800 text-content-muted"}`}
                >
                  {a === "all" ? "عامّ لكل مشتركيّ الفعّالين" : "خاصّ بمشتركين أختارهم"}
                </button>
              ))}
              <span className="ms-auto text-xs text-content-muted self-center">
                المتبقي اليوم: {left} من {summary.notifications[audience].cap}
              </span>
            </div>

            {audience === "selected" && (
              <div className="max-h-44 overflow-y-auto rounded-xl bg-ink-800/60 p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {active.length === 0 ? (
                  <p className="text-xs text-content-muted p-2">لا مشتركين فعّالين.</p>
                ) : (
                  active.map((s) => (
                    <label key={s.user_id} className="flex items-center gap-2 text-sm px-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={picked.includes(s.user_id)}
                        onChange={(e) =>
                          setPicked((p) => (e.target.checked ? [...p, s.user_id] : p.filter((x) => x !== s.user_id)))
                        }
                      />
                      {s.name}
                    </label>
                  ))
                )}
              </div>
            )}

            <Input name="title" label="العنوان" required />
            <TextArea name="body" label="النص" rows={3} />
            <div>
              <Button primary onClick={submitForm} isLoading={isLoading} disabled={left <= 0}>
                إرسال
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

function PasswordCard() {
  const { mutateAsync, isLoading } = usePostQuery({ url: "/me/password", contentType: "application/json" });

  return (
    <Card padded>
      <SectionHeader level="section" title="كلمة المرور" icon="shield" hint="يمكنك الإبقاء على الكلمة التي أنشأتها لك الإدارة" divider />
      <Formik
        initialValues={{ current_password: "", password: "", password_confirmation: "" }}
        onSubmit={async (values, helpers) => {
          try {
            await mutateAsync(values as any);
            helpers.resetForm();
          } catch {
            // الرسالة من `onError`.
          }
        }}
      >
        {({ submitForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input name="current_password" label="الحالية" type={"password" as any} dir="ltr" />
            <Input name="password" label="الجديدة (٨ أحرف فأكثر)" type={"password" as any} dir="ltr" />
            <Input name="password_confirmation" label="تأكيد الجديدة" type={"password" as any} dir="ltr" />
            <div className="md:col-span-3">
              <Button soft onClick={submitForm} isLoading={isLoading}>
                تغيير كلمة المرور
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

function Tile({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card padded="sm" className={highlight ? "!border-brand-400/40" : ""}>
      <p className="text-xs text-content-muted">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-brand-400" : "text-content"}`} dir="ltr">{value}</p>
      {sub && <p className="text-[11px] text-content-faint">{sub}</p>}
    </Card>
  );
}
