import { Button, Card, Chip, SectionHeader } from "components";
import { useConfirm } from "components/ConfirmDialog/context";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import useAxios from "hooks/useAxios";
import { apiErrorMessage } from "util/apiError";
import { toast } from "react-toastify";
import { Coach, Money, sar, usd } from "../shared";

/*
 * [اشتراكات المدرّبين · المرحلة ٣–٤ — اللوحة] ما يديره خالد على المدرّب:
 *   • طلباتُ الصرف الواردة منه
 *   • التغطية (٦٠ خانة تمرين + ١٢ تغذية) وقوالبُه ومولّدُ خانات النادي وإظهارُه
 *   • كلفةُ الذكاء وسقفُه اليوميّ
 *   • حساباتُ الدخول المربوطة به
 *
 * ⚖️ **الإظهارُ حكمٌ للخادم**: الزرُّ يُرسل `visible` والخادمُ يردّ 422 بالناقص بالاسم (يُعرض كما هو) —
 *    لا نسخةَ ثانية لتعريف «مكتمل» هنا.
 */

const GENDER: Record<string, string> = { male: "رجال", female: "نساء" };
const LEVEL: Record<string, string> = { junior: "مبتدئ", mid: "متوسط", senior: "متقدم" };
const PLACE: Record<string, string> = { gym: "نادي", home: "بيت" };
const GOAL: Record<string, string> = { decrease: "تقليل وزن", keep: "ثبات وزن", increase: "زيادة وزن" };
const MEAL: Record<string, string> = { Breakfast: "فطور", Lunch: "غداء", Dinner: "عشاء", Snack: "سناك" };

interface PendingRequest { id: number; amount_usd: number; requested_at: string }
interface Account { id: number; name: string; email: string; access_level: string; disabled_at: string | null }

/** ── طلب الصرف ─────────────────────────────────────────────────────── */
export function PayoutRequestCard({ coach, onDone }: { coach: Coach & { pending_request?: PendingRequest | null; payout_balance?: any }; onDone: () => Promise<void> }) {
  const confirm = useConfirm();
  const req = coach.pending_request;
  const bal = coach.payout_balance;
  const { mutateAsync: pay, isLoading: paying } = usePostQuery({
    url: `/coaches/${coach.id}/payouts`,
    contentType: "application/json",
  });
  const { mutateAsync: reject, isLoading: rejecting } = usePostQuery({
    url: `/coach-payout-requests/${req?.id ?? 0}/reject`,
    contentType: "application/json",
  });

  if (!bal) return null;

  const today = new Date().toISOString().slice(0, 10);

  const accept = async () => {
    if (!req) return;
    if (
      !(await confirm({
        title: "تسجيل التحويل؟",
        message: `سيُسجَّل تحويل $${req.amount_usd} للمدرب اليوم ويُغلق الطلب. حوِّل المبلغ فعلاً أولاً.`,
        confirmLabel: "سجّل التحويل",
        tone: "neutral",
      }))
    )
      return;
    try {
      await pay({ amount_usd: req.amount_usd, paid_at: today, period: today.slice(0, 7), request_id: req.id } as any);
      await onDone();
    } catch {
      // الرسالة من `onError`.
    }
  };

  const decline = async () => {
    if (!req) return;
    if (!(await confirm({ title: "رفض الطلب؟", message: "يعود المبلغ إلى رصيده المتاح.", confirmLabel: "رفض" }))) return;
    try {
      await reject({} as any);
      await onDone();
    } catch {
      // الرسالة من `onError`.
    }
  };

  return (
    <Card padded className={req ? "!border-warning-500/50" : ""}>
      <SectionHeader
        level="section"
        title="طلب الصرف"
        icon="download"
        hint={`المتاح للمطالبة ${usd(bal.available)} · معلَّق ${usd(bal.on_hold)} (مدّة الاسترداد ${bal.hold_days} يوماً)`}
        divider
      />
      {req ? (
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <Chip tone="warning" size="sm">في انتظار التحويل</Chip>
          <b dir="ltr" className="text-lg">${req.amount_usd}</b>
          <span className="text-xs text-content-muted" dir="ltr">{req.requested_at}</span>
          <div className="ms-auto flex gap-2">
            <Button primary size="small" onClick={accept} isLoading={paying}>تسجيل التحويل</Button>
            <Button dangerSoft size="small" onClick={decline} isLoading={rejecting}>رفض</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-content-muted mt-4">لا طلب صرف قيد الانتظار.</p>
      )}
    </Card>
  );
}

/** ── التغطية · القوالب · المولّد · الإظهار ─────────────────────────── */
export function CoverageCard({ coach }: { coach: Coach }) {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [showMissing, setShowMissing] = useState(false);

  const { data: cov }: UseQueryResult<any> = useGetQuery(`/coaches/${coach.id}/coverage`, `/coaches/${coach.id}/coverage`, {
    select: ({ data }: any) => data.data,
    enabled: !coach.is_house,
  });
  const { data: tpl }: UseQueryResult<any> = useGetQuery(`/coaches/${coach.id}/templates`, `/coaches/${coach.id}/templates`, {
    select: ({ data }: any) => data.data,
    enabled: !coach.is_house,
  });

  const { mutateAsync: clone, isLoading: cloning } = usePostQuery({ url: `/coaches/${coach.id}/templates/clone`, contentType: "application/json" });
  const { mutateAsync: generate, isLoading: generating } = usePostQuery({ url: `/coaches/${coach.id}/generate-gym-slots`, contentType: "application/json" });
  const { mutateAsync: setStatus, isLoading: saving } = usePostQuery({ url: `/coaches/${coach.id}`, contentType: "application/json", withToast: false });

  if (coach.is_house) return null;

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries(`/coaches/${coach.id}/coverage`),
      queryClient.invalidateQueries(`/coaches/${coach.id}/templates`),
      queryClient.invalidateQueries(`/coaches/${coach.id}`),
      queryClient.invalidateQueries("/coaches"),
    ]);

  const doClone = async () => {
    try {
      const r: any = await clone({} as any);
      const d = r?.data?.data;
      toast.info(`نُسخ ${d?.created ?? 0} قالباً${d?.skipped ? ` · وتُرك ${d.skipped} موجوداً` : ""}`);
      await refresh();
    } catch {
      // الرسالة من `onError`.
    }
  };

  const doGenerate = async () => {
    if (
      !(await confirm({
        title: "توليد خانات النادي؟",
        message: "تُبنى ٣٠ خانة من قوالب هذا المدرب. الموجود منها لا يُمسّ.",
        confirmLabel: "ولّد",
        tone: "neutral",
      }))
    )
      return;
    try {
      const r: any = await generate({} as any);
      const d = r?.data?.data;
      const msg = `أُنشئت ${d?.created ?? 0} · موجودة ${d?.exists ?? 0} · فشلت ${d?.failed ?? 0}`;
      d?.failed ? toast.warning(msg) : toast.success(msg);
      await refresh();
    } catch {
      // الرسالة من `onError`.
    }
  };

  const toggleVisible = async () => {
    const next = coach.status === "visible" ? "hidden" : "visible";
    try {
      await setStatus({ status: next } as any);
      toast.success(next === "visible" ? "ظهر المدرب للمستخدمين" : "أُخفي المدرب");
      await refresh();
    } catch {
      // الخادمُ يردّ 422 بالناقص بالاسم — يُعرض من `onError` كما هو.
    }
  };

  const t = cov?.training;
  const d = cov?.diet;
  const pct = (x?: { covered: number; required: number }) => (x ? Math.round((x.covered / x.required) * 100) : 0);

  return (
    <Card padded>
      <SectionHeader
        level="section"
        title="المحتوى والتغطية"
        icon="training"
        hint="لا يظهر المدرب للمستخدمين حتى تكتمل خانات تمرينه الستون وخانات تغذيته الاثنتا عشرة"
        divider
        actions={
          <Button primary={coach.status !== "visible"} dangerSoft={coach.status === "visible"} size="small" onClick={toggleVisible} isLoading={saving}>
            {coach.status === "visible" ? "إخفاء المدرب" : "إظهار المدرب"}
          </Button>
        }
      />

      {!cov ? (
        <p className="text-sm text-content-muted mt-4">جارٍ التحميل…</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Bar label="خانات التمرين" done={t.covered} total={t.required} pct={pct(t)} />
            <Bar label="خانات التغذية" done={d.covered} total={d.required} pct={pct(d)} />
            <Bar label="قوالب الأيام" done={tpl?.present ?? 0} total={tpl?.required ?? 42} pct={tpl ? Math.round((tpl.present / tpl.required) * 100) : 0} />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {cov.in_app ? <Chip tone="success" size="sm">✓ ظاهر الآن في تطبيق المستخدم</Chip> : <Chip tone="warning" size="sm">✗ غير ظاهر في التطبيق</Chip>}
            {!cov.in_app && (cov.in_app_blockers ?? []).map((b: string) => <span key={b} className="text-xs text-content-muted">{b}</span>)}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {cov.complete ? <Chip tone="success" size="sm">التغطية كاملة</Chip> : <Chip tone="warning" size="sm">التغطية ناقصة</Chip>}
            {!cov.offering_ready && <Chip tone="warning" size="sm">أدخل معرّف الـOffering</Chip>}
            <div className="ms-auto flex gap-2">
              <Button soft size="small" onClick={doClone} isLoading={cloning}>استنسخ قوالب المنصة</Button>
              <Button soft size="small" onClick={doGenerate} isLoading={generating}>ولّد خانات النادي</Button>
              {!cov.complete && (
                <Button secondaryBorder size="small" onClick={() => setShowMissing((v) => !v)}>
                  {showMissing ? "إخفاء الناقص" : "عرض الناقص"}
                </Button>
              )}
            </div>
          </div>

          {showMissing && !cov.complete && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-content mb-2">تمرين ناقص ({t.missing.length})</p>
                <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto">
                  {t.missing.map((m: any, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-ink-800 text-content-muted">
                      {GENDER[m.gender]} · {LEVEL[m.level]} · {m.days} أيام · {PLACE[m.place]}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-content mb-2">تغذية ناقصة ({d.missing.length})</p>
                <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto">
                  {d.missing.map((m: any, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-ink-800 text-content-muted">
                      {GOAL[m.goal]} · {MEAL[m.meal]} ({m.recipes})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-content-faint">
            خانات البيت (٣٠) والتغذية (١٢) تُبنى من صفحات الجداول والوصفات داخل تبويب هذا المدرب — تُنسب إليه تلقائياً.
          </p>
        </div>
      )}
    </Card>
  );
}

function Bar({ label, done, total, pct }: { label: string; done: number; total: number; pct: number }) {
  return (
    <div className="rounded-xl bg-ink-800/60 p-3">
      <div className="flex justify-between text-xs text-content-muted">
        <span>{label}</span>
        <span dir="ltr">{done}/{total}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-700 overflow-hidden">
        <div className="h-full bg-brand-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** ── كلفة الذكاء وسقفه ─────────────────────────────────────────────── */
export function AiUsageCard({ coach }: { coach: Coach }) {
  const queryClient = useQueryClient();
  const [cap, setCap] = useState("");
  const { data }: UseQueryResult<any> = useGetQuery(`/coaches/${coach.id}/ai-usage`, `/coaches/${coach.id}/ai-usage?days=30`, {
    select: ({ data }: any) => data.data,
    enabled: !coach.is_house,
  });
  const { mutateAsync, isLoading } = usePostQuery({ url: `/coaches/${coach.id}/ai-cap`, contentType: "application/json" });

  if (coach.is_house) return null;

  const save = async (value: number | null) => {
    try {
      await mutateAsync({ cap: value } as any);
      setCap("");
      await queryClient.invalidateQueries(`/coaches/${coach.id}/ai-usage`);
    } catch {
      // الرسالة من `onError`.
    }
  };

  const m = (x?: Money) => (x ? `${usd(x)} · ${sar(x)}` : "—");

  return (
    <Card padded>
      <SectionHeader
        level="section"
        title="الذكاء الاصطناعي"
        icon="analytics"
        hint="آخر ٣٠ يوماً. المخصوم من نصيب المدرب ثابتٌ شهرياً — هنا الكلفة الفعلية للمقارنة"
        divider
      />
      {!data ? (
        <p className="text-sm text-content-muted mt-4">جارٍ التحميل…</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <Mini label="الكلفة الفعلية" value={m(data.total)} />
            <Mini label="ضغطها المدرب بيده" value={m(data.by_coach)} />
            <Mini label="استهلكها مشتركوه" value={m(data.by_users)} />
            <Mini label="المخصوم من كشفه" value={m(data.charged)} />
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <p className="text-xs text-content-muted mb-1">
                السقف اليومي لنداءات المدرب ({data.cap.custom ? "مخصَّص" : "الافتراضي"}) · اليوم {data.cap.used_today} من {data.cap.daily}
              </p>
              <input
                value={cap}
                onChange={(e) => setCap(e.target.value.replace(/\D/g, ""))}
                placeholder={String(data.cap.daily)}
                dir="ltr"
                className="w-28 rounded-lg bg-ink-800 border border-line px-3 py-2 text-sm"
              />
            </div>
            <Button soft size="small" isLoading={isLoading} disabled={cap === ""} onClick={() => save(Number(cap))}>حفظ السقف</Button>
            {data.cap.custom && <Button secondaryBorder size="small" onClick={() => save(null)}>العودة للافتراضي</Button>}
          </div>

          {data.features.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs whitespace-nowrap">
                <thead className="text-content-muted">
                  <tr><th className="p-1.5 text-start">الميزة</th><th className="p-1.5 text-start">نداءات</th><th className="p-1.5 text-start">نجحت</th><th className="p-1.5 text-start">الكلفة</th></tr>
                </thead>
                <tbody>
                  {data.features.map((f: any) => (
                    <tr key={f.feature} className="border-t border-line">
                      <td className="p-1.5">{f.label}{f.coach_triggered && <span className="text-brand-400"> · من المدرب</span>}</td>
                      <td className="p-1.5">{f.calls}</td>
                      <td className="p-1.5">{f.succeeded}</td>
                      <td className="p-1.5" dir="ltr">${f.cost_usd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-800/60 px-3 py-2.5">
      <p className="text-[11px] text-content-muted">{label}</p>
      <p className="text-sm font-bold text-content" dir="ltr">{value}</p>
    </div>
  );
}

/** ── حساباتُ الدخول المربوطة بالمدرب ─────────────────────────────── */
export function AccountsCard({ coach }: { coach: Coach & { accounts?: Account[] } }) {
  if (coach.is_house) return null;
  const accounts = coach.accounts ?? [];

  return (
    <Card padded>
      <SectionHeader
        level="section"
        title="حسابات الدخول"
        icon="shield"
        hint="تُنشأ وتُعطَّل من صفحة «المسؤولون» (نوع الحساب: مدرّب)"
        divider
        actions={<Link to="/admins" className="text-sm text-brand-400">إدارة الحسابات</Link>}
      />
      {accounts.length === 0 ? (
        <p className="text-sm text-content-muted mt-4">لا حساب دخول لهذا المدرب بعد.</p>
      ) : (
        <div className="mt-4 divide-y divide-line">
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="font-semibold text-content">{a.name}</span>
              <span className="text-content-muted" dir="ltr">{a.email}</span>
              {a.access_level === "read" && <Chip tone="warning" size="sm">قراءة فقط</Chip>}
              {a.disabled_at ? <Chip tone="danger" size="sm">معطَّل</Chip> : <Chip tone="success" size="sm">فعّال</Chip>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/** ── إنشاءُ Offering المدرّب في RevenueCat (معاينةٌ ثم تنفيذ) ─────────────────── */
const KIND: Record<string, string> = {
  product: "منتجٌ في RevenueCat",
  entitlement_link: "ربطٌ بالـentitlement",
  offering: "Offering",
  package: "حزمة",
  package_link: "ربطُ منتجٍ بحزمة",
};
const STATUS: Record<string, string> = { exists: "موجود", create: "سيُنشأ", created: "أُنشئ" };

export function OfferingCard({ coach }: { coach: Coach }) {
  const axios = useAxios({ contentType: "application/json" });
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [plan, setPlan] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [basePlan, setBasePlan] = useState("");
  const [busy, setBusy] = useState(false);

  if (coach.is_house) return null;

  const body = () => (basePlan.trim() ? { android_base_plan_id: basePlan.trim() } : {});

  /** الخادمُ يردّ 422 بـ`plan.issues` — تُعرض بالاسم لا برسالةٍ عامّة. */
  const call = async (path: string, extra: object = {}) => {
    setBusy(true);
    setErr(null);
    try {
      const r = await axios.post(`/coaches/${coach.id}/${path}`, { ...body(), ...extra });
      return r.data?.data;
    } catch (e: any) {
      const p = e?.response?.data?.plan;
      if (p) setPlan(p);
      setErr(apiErrorMessage(e));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const preview = async () => {
    const d = await call("offering/preview");
    if (d) setPlan(d);
  };

  const apply = async () => {
    if (
      !(await confirm({
        title: "إنشاء الـOffering في RevenueCat؟",
        message: "يُسجَّل المنتجات ويُربط بالـentitlement وتُنشأ الحزم. الموجود لا يُكرَّر، ولا يتغيّر ظهورُ المدرب.",
        confirmLabel: "أنشئ",
        tone: "neutral",
      }))
    )
      return;
    const d = await call("offering", { confirm: true });
    if (d) {
      setPlan(d);
      toast.success(`تم — معرّف الـOffering: ${d.offering}`);
      await Promise.all([queryClient.invalidateQueries(`/coaches/${coach.id}`), queryClient.invalidateQueries(`/coaches/${coach.id}/coverage`), queryClient.invalidateQueries("/coaches")]);
    }
  };

  const needsBase = plan?.issues?.some((i: any) => i.code === "base_plan_missing");

  return (
    <Card padded>
      <SectionHeader
        level="section"
        title="Offering في RevenueCat"
        icon="subscription"
        hint="يُنشأ من باقات هذا المدرب في صفحة الاشتراكات. المنتجات تُنشأ في المتجرين يدوياً أولاً."
        divider
        actions={
          <div className="flex gap-2">
            <Button soft size="small" onClick={preview} isLoading={busy}>معاينة</Button>
            <Button primary size="small" onClick={apply} isLoading={busy} disabled={!plan?.ready || plan?.applied}>أنشئ</Button>
          </div>
        }
      />
      <p className="text-xs text-content-muted mt-3">
        المعرّف الحالي: {coach.offering_id ? <b>{coach.offering_id}</b> : "غير مُدخَل"} · يُحفظ تلقائياً بعد الإنشاء.
      </p>

      {needsBase && (
        <div className="mt-3 max-w-xs">
          <label className="text-xs text-content-muted block mb-1">base plan لمنتجات أندرويد (مثل monthly)</label>
          <input
            value={basePlan}
            onChange={(e) => setBasePlan(e.target.value)}
            className="w-full rounded-lg bg-ink-800 border border-line px-3 py-2 text-sm"
            placeholder="monthly"
          />
          <p className="text-[11px] text-content-faint mt-1">أدخله ثم اضغط «معاينة» ثانيةً.</p>
        </div>
      )}

      {err && <p className="text-sm text-danger-400 mt-3">{err}</p>}

      {plan?.issues?.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-warning-400 list-disc ps-5">
          {plan.issues.map((i: any, k: number) => (
            <li key={k}>{i.message}</li>
          ))}
        </ul>
      )}

      {plan?.steps?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {plan.steps.map((s: any, k: number) => (
            <span key={k} className="px-2 py-1 rounded-md bg-ink-800 text-content-muted">
              {KIND[s.kind] ?? s.kind}: <b>{s.ref}</b> — {STATUS[s.status] ?? s.status}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
