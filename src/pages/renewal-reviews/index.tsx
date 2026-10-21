import { Button, Chip, Modal, SectionHeader, Table, Tabs, TextArea } from "components";
import { Form, Formik } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { Row } from "react-table";

/*
 * [اشتراكات المدرّبين · المرحلة ١ — اللوحة] مراجعةُ المستوى عند التجديد —
 * `GET admin/renewal-reviews?status=` و`POST admin/renewal-reviews/{id}/done`.
 *
 * قرار خالد: عند **كل** تجديد (كل المشتركين، خالد ضمنهم) تنبيهٌ يراجع فيه
 * المدرّبُ هل ينتقل المستخدم مستوىً (مبتدئ ⇒ متوسط …).
 *
 * ⚖️ **والنقلُ نفسه لا يقع من هنا** — يقع من «خطة المستخدم» بالمسار القائم
 *    (تعديل المستخدم ثم إعادة بناء البرنامج). هذه الشاشة قائمةٌ وختمُ مراجعة،
 *    كي لا يصير لتغيير المستوى بابان يفترقان.
 */

const LVL: Record<string, string> = {
  junior: "مبتدئ",
  mid: "متوسط",
  senior: "متقدم",
};
const PLACE: Record<string, string> = { gym: "نادي", home: "بيت" };

const DONE_MODAL_ID = "renewal-review-done";

export default function RenewalReviews() {
  const [status, setStatus] = useState<"pending" | "done">("pending");
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState<any>(null);

  const url = `/renewal-reviews?status=${status}&page=${page}`;
  const { data, isLoading }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: any) => data.data,
    keepPreviousData: true,
  });

  const rows = data?.data ?? [];
  const pagination = data
    ? {
        total: data.total,
        current_page: data.current_page,
        per_page: data.per_page,
        total_pages: data.last_page,
      }
    : undefined;

  const columns = React.useMemo(
    () => [
      {
        Header: "المستخدم",
        Cell: ({ row }: { row: Row<any> }) => {
          const u = row.original.user;
          return u ? (
            <Link to={`/users/${u.id}/plan`} className="text-brand-400 hover:underline">
              {u.name} <span className="text-content-faint text-xs">#{u.id}</span>
            </Link>
          ) : (
            <span className="text-content-faint">حساب محذوف</span>
          );
        },
      },
      {
        Header: "المدرب",
        Cell: ({ row }: { row: Row<any> }) => row.original.coach?.name ?? "—",
      },
      {
        Header: "المستوى",
        Cell: ({ row }: { row: Row<any> }) => {
          const at = row.original.lvl_at_renewal;
          const now = row.original.user?.training_lvl;
          return (
            <div className="flex items-center gap-1.5">
              <Chip size="sm">{LVL[at] ?? at ?? "—"}</Chip>
              {now && now !== at && (
                <>
                  <span className="text-content-faint">←</span>
                  <Chip size="sm" tone="success">{LVL[now] ?? now}</Chip>
                </>
              )}
            </div>
          );
        },
      },
      {
        Header: "البرنامج",
        Cell: ({ row }: { row: Row<any> }) => {
          const u = row.original.user;
          if (!u) return "—";
          return (
            <span className="text-sm text-content-muted">
              {u.weekly_training} أيام · {PLACE[u.training_place] ?? u.training_place}
            </span>
          );
        },
      },
      {
        Header: "جلسات آخر ٣٠ يوماً",
        Cell: ({ row }: { row: Row<any> }) => row.original.user?.sessions_last_30_days ?? 0,
      },
      {
        Header: "التجديد",
        Cell: ({ row }: { row: Row<any> }) => (
          <span dir="ltr" className="text-sm">
            {String(row.original.created_at ?? "").slice(0, 10)}
          </span>
        ),
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) =>
          row.original.status === "pending" ? (
            <Button
              soft
              size="xSmall"
              onClick={() => {
                setCurrent(row.original);
                (document.getElementById(DONE_MODAL_ID) as HTMLInputElement | null)?.click();
              }}
            >
              تمت المراجعة
            </Button>
          ) : (
            <span className="text-xs text-content-muted">{row.original.note ?? ""}</span>
          ),
      },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <SectionHeader
        title="مراجعة التجديدات"
        icon="refresh"
        hint="كل تجديد اشتراك يصل هنا لتقرّر: هل ينتقل المستخدم إلى المستوى التالي؟ النقل نفسه من «خطة المستخدم»"
      />

      <Tabs
        tabs={[
          { name: "بانتظار المراجعة", isActive: status === "pending" },
          { name: "تمت مراجعتها", isActive: status === "done" },
        ]}
        onClick={(i) => {
          setStatus(i === 0 ? "pending" : "done");
          setPage(1);
        }}
      />

      {isLoading ? (
        <p className="text-content-muted text-sm">جارٍ التحميل…</p>
      ) : (
        <Table
          data={rows}
          columns={columns}
          pagination={pagination}
          setPage={setPage}
          noDataMessage={status === "pending" ? "لا تجديدات تنتظر المراجعة" : "لا شيء بعد"}
        />
      )}

      <Modal id={DONE_MODAL_ID} title="ختم المراجعة" size="sm">
        {current && <DoneForm review={current} onDone={() => setCurrent(null)} />}
      </Modal>
    </div>
  );
}

function DoneForm({ review, onDone }: { review: any; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = usePostQuery({
    url: `/renewal-reviews/${review.id}/done`,
    contentType: "application/json",
  });

  return (
    <Formik
      initialValues={{ note: "" }}
      onSubmit={async (values) => {
        try {
          await mutateAsync({ note: values.note || null } as any);
          (document.getElementById(DONE_MODAL_ID) as HTMLInputElement | null)?.click();
          await queryClient.invalidateQueries({
            predicate: (q) => String(q.queryKey).startsWith("/renewal-reviews"),
          });
          onDone();
        } catch {
          // الرسالة من `onError`.
        }
      }}
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-4">
          <p className="text-sm text-content-muted">
            {review.user?.name}: إن قرّرت نقل مستواه، انقله أولاً من{" "}
            <Link to={`/users/${review.user?.id}/plan`} className="text-brand-400">
              خطة المستخدم
            </Link>{" "}
            ثم اختم المراجعة هنا.
          </p>
          <TextArea name="note" label="ملاحظة (اختياري)" rows={2} placeholder="مثلاً: نُقل إلى متوسط" />
          <Button primary onClick={submitForm} isLoading={isLoading}>
            ختم المراجعة
          </Button>
        </Form>
      )}
    </Formik>
  );
}
