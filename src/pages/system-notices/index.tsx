import { Button, Card, Img, Modal, Table, Text } from "components";
import React from "react";
import { Row } from "react-table";
import { UseQueryResult, useQueryClient } from "react-query";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import AddSystemNotice from "./components/AddSystemNotice";
import { useConfirm } from "components/ConfirmDialog/context";

// شارة الأكشن كما يراها المستخدم في شريط الهوم
const actionLabels: Record<string, string> = {
  show_message: "عرض رسالة",
  update_weight: "تحديث الوزن",
  none: "بدون زر",
};

function SystemNotices() {
  const confirm = useConfirm();
  // دفعات رسائل النظام مع إحصاء المشاهدة =================>
  const url = "/user-notices";

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const queryClient = useQueryClient();

  const { mutateAsync: deleteBatch, isLoading: isDeleting } = useDeleteQuery();

  const onDelete = async (batch: string) => {
    // ⛔ كان `window.confirm` — يحجب الخيط، وزرّاه لا يُعرَّبان، ويظهر باسم
    // النطاق فيُقرأ رسالةَ متصفّحٍ لا رسالةَ لوحة. وُحِّد على حوار اللوحة.
    if (
      !(await confirm({
        title: "سحب هذه الرسالة؟",
        message: "تختفي فوراً من الهوم لكل المستلمين.",
        confirmLabel: "سحب",
      }))
    ) {
      return;
    }

    try {
      await deleteBatch(`/user-notices/${batch}`);

      await queryClient.invalidateQueries(url);
    } catch {
      // ⛔ وكان **بلا `catch`** ⇒ فشلُ السحب وعدٌ مرفوضٌ بلا معالج.
      // الرسالة الآن من `useDeleteQuery.onError`.
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "العنوان",
        Cell: ({ row }: { row: Row<any> }) => (
          <div className="max-w-[200px] break-words font-bold">
            {row.original.title}
          </div>
        ),
      },
      {
        Header: "نص الشريط",
        Cell: ({ row }: any) => (
          <div className="max-w-[260px] break-words">{row.original.body}</div>
        ),
      },
      {
        Header: "الزر",
        Cell: ({ row }: any) => (
          <span>{actionLabels[row.original.action] ?? row.original.action}</span>
        ),
      },
      {
        Header: "الأولوية",
        accessor: "priority",
      },
      {
        Header: "المشاهدات",
        Cell: ({ row }: any) => (
          <span>
            {row.original.seen_count} / {row.original.sent_count}
          </span>
        ),
      },
      {
        Header: "سارية حتى",
        Cell: ({ row }: any) => (
          <span>
            {row.original.valid_until
              ? new Date(row.original.valid_until).toLocaleDateString("ar")
              : "حتى المشاهدة"}
          </span>
        ),
      },
      {
        Header: "تاريخ الإرسال",
        Cell: ({ row }: any) => (
          <span>
            {new Date(row.original.created_at).toLocaleDateString("ar")}
          </span>
        ),
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }: any) => (
          <Button
            className="!w-[80px]"
            secondaryBorder
            isLoading={isDeleting}
            onClick={() => onDelete(row.original.batch)}
          >
            سحب
          </Button>
        ),
      },
    ],
    [isDeleting]
  );

  return (
    <div className="w-full space-y-4">
      {data?.length > 0 ? (
        <Table
          data={data ?? []}
          columns={columns}
          modalContent={<AddSystemNotice />}
          id="add-system-notice"
          modalTitle="إرسال رسالة نظام"
        />
      ) : (
        <Card className={"p-4 !w-[280px] !h-[120px] mx-auto"}>
          <label
            htmlFor="add-system-notice"
            className={
              "flex flex-col cursor-pointer justify-between items-center relative"
            }
          >
            <Img
              className="w-16 absolute top-0 left-0"
              src="/images/plus.svg"
            />
            <Text size="3xl" className="mt-4">
              إرسال رسالة نظام
            </Text>
          </label>
        </Card>
      )}

      <Modal id="add-system-notice">
        <AddSystemNotice />
      </Modal>
    </div>
  );
}

export default SystemNotices;
