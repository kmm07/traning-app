import { Button, Card, Chip, SectionHeader } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";

/*
 * [اشتراكات المدرّبين · المرحلة ٤] سجلُّ التدقيق — من عدّل ماذا ومتى.
 *
 * تبويبٌ علويّ لكل مدرّب ينقلك بين سجلّاتهم؛ و«الكل» يجمعها. الفاعلُ المعروض **حقيقيّ دائماً**:
 * رسالةٌ أرسلها خالدٌ تظهر للمستخدم باسم مدرّبه، وهنا تظهر باسم خالد.
 *
 * ⛔ السجلُّ يحفظ المعرّفات وأسماءَ الحقول لا قِيَمها: لا نصَّ رسالة ولا كلمةَ سرّ.
 */

interface Row {
  id: number;
  admin_id: number;
  coach_id: number | null;
  subject_user_id: number | null;
  method: string;
  route: string;
  status: number;
  summary: { params?: string[]; fields?: string[]; context?: boolean | null } | null;
  created_at: string;
  admin?: { id: number; name: string; email: string; coach_id: number | null };
}

interface CoachRow { id: number; name: string; is_house: boolean }

const METHOD_TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  POST: "success", PUT: "warning", PATCH: "warning", DELETE: "danger",
};

export default function AuditLog() {
  const [coachId, setCoachId] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);

  const { data: coachesRaw }: UseQueryResult<any> = useGetQuery("/coaches", "/coaches", {
    select: ({ data }: any) => data.data,
  });
  const coaches: CoachRow[] = coachesRaw ?? [];

  const qs = new URLSearchParams({ page: String(page), per_page: "30" });
  if (coachId) qs.set("coach_id", String(coachId));
  if (userId.trim()) qs.set("user_id", userId.trim());
  const url = `/audit-log?${qs.toString()}`;

  const { data, isLoading }: UseQueryResult<any> = useGetQuery(["/audit-log", coachId, userId, page], url, {
    select: ({ data }: any) => data.data,
  });
  const rows: Row[] = data?.data ?? [];

  return (
    <div className="w-full space-y-4">
      <SectionHeader title="سجل التدقيق" icon="shield" hint="من عدّل ماذا ومتى — الفاعل الحقيقي دائماً" />

      <div className="flex items-end gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="سجلّ مدرّب">
        {[{ id: null as number | null, name: "الكل" }, ...coaches.map((c) => ({ id: c.id as number | null, name: c.is_house ? "المنصّة" : c.name }))].map(
          (t) => (
            <button
              key={t.id ?? "all"}
              role="tab"
              aria-selected={coachId === t.id}
              onClick={() => { setCoachId(t.id); setPage(1); }}
              className={`px-4 py-2 rounded-t-xl text-sm whitespace-nowrap ${
                coachId === t.id ? "bg-ink-800 text-content font-semibold border border-b-0 border-line" : "text-content-muted"
              }`}
            >
              {t.name}
            </button>
          )
        )}
        <input
          value={userId}
          onChange={(e) => { setUserId(e.target.value.replace(/\D/g, "")); setPage(1); }}
          placeholder="رقم مستخدم"
          dir="ltr"
          className="ms-auto mb-1 w-32 rounded-lg bg-ink-800 border border-line px-3 py-1.5 text-sm"
        />
      </div>

      <Card padded>
        {isLoading ? (
          <p className="text-sm text-content-muted">جارٍ التحميل…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-content-muted">لا سجلّات.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-content-muted text-xs">
                <tr>
                  <th className="p-2 text-start">الوقت</th>
                  <th className="p-2 text-start">الفاعل</th>
                  <th className="p-2 text-start">الإجراء</th>
                  <th className="p-2 text-start">المستخدم</th>
                  <th className="p-2 text-start">الحقول</th>
                  <th className="p-2 text-start">النتيجة</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-line align-top">
                    <td className="p-2 text-content-muted" dir="ltr">{String(r.created_at).replace("T", " ").slice(0, 19)}</td>
                    <td className="p-2">
                      <p className="font-semibold text-content">{r.admin?.name ?? `#${r.admin_id}`}</p>
                      <p className="text-[11px] text-content-faint">
                        {r.admin?.coach_id ? "حساب مدرّب" : "مسؤول"}
                        {r.summary?.context ? " · داخل تبويب" : ""}
                      </p>
                    </td>
                    <td className="p-2">
                      <Chip tone={METHOD_TONE[r.method] ?? "neutral"} size="sm">{r.method}</Chip>{" "}
                      <span dir="ltr" className="text-content">{r.route}</span>
                    </td>
                    <td className="p-2" dir="ltr">{r.subject_user_id ? `#${r.subject_user_id}` : "—"}</td>
                    <td className="p-2 text-content-muted max-w-[22rem] truncate" dir="ltr">
                      {(r.summary?.fields ?? []).join(", ") || "—"}
                    </td>
                    <td className="p-2">
                      <Chip tone={r.status < 300 ? "success" : r.status < 500 ? "warning" : "danger"} size="sm">{r.status}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center gap-3 mt-4">
          <Button soft size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
          <span className="text-xs text-content-muted">صفحة {data?.current_page ?? page} من {data?.last_page ?? 1}</span>
          <Button soft size="small" disabled={!data || page >= (data.last_page ?? 1)} onClick={() => setPage((p) => p + 1)}>التالي</Button>
        </div>
      </Card>
    </div>
  );
}
