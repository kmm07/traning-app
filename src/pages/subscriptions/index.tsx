import { Button, Modal, Table } from "components";
import TableActions from "components/Table/actions";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { Row } from "react-table";
import AddNewSubscription from "./components/addSubscription";
import { useConfirm } from "components/ConfirmDialog/context";
import usePermissions from "hooks/usePermissions";

export default function Subscriptions() {
  const confirm = useConfirm();
  const [subscription, setSubscription] = useState<any>();

  // get exercises categories ======================>
  const url = "/subscriptions";

  const { data: subscriptions = [], isLoading }: UseQueryResult<any> =
    useGetQuery(url, url, {
      select: ({ data }: { data: { data: [] } }) => data.data,
    });
  // [اشتراكات المدرّبين] أسماءُ المدرّبين لعمود «المدرب» — لمن يملك القسم وحده
  const { can } = usePermissions();
  const { data: coachNames = {} }: UseQueryResult<any> =
    useGetQuery("/coaches", "/coaches", {
      select: ({ data }: any) =>
        Object.fromEntries((data.data ?? []).map((c: any) => [c.id, c.name])),
      enabled: can("coaches"),
    });

  // subscriptions actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    if (
      !(await confirm({
        title: "حذف باقة الاشتراك؟",
        message: "لا تعود معروضةً للشراء. واشتراكاتُ من اشترك بها لا تتأثّر.",
      }))
    ) {
      return;
    }

    try {
      await mutateAsync(`/subscriptions/${id}`);

      await queryClient.invalidateQueries("/subscriptions");
    } catch {
      // الرسالة من `onError`.
    }
  };

  const onEdit = async (value: any) => {
    await setSubscription(value);
    document.getElementById("add-new-subscription")?.click();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الإسم",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },

      {
        Header: "عدد الشهور",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.months}
            </span>
          );
        },
      },

      {
        Header: "المنتج",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.product_id}
            </span>
          );
        },
      },
      {
        Header: "المدرب",
        Cell: ({ row }: { row: Row<any> }) => {
          // `NULL` = باقةُ المنصّة (خالد)
          const id = row.original.coach_id;
          if (!id) return <span className="text-content-muted">المنصة</span>;
          return <span>{coachNames[id] ?? `#${id}`}</span>;
        },
      },
      {
        Header: "سعر الإشتراك",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.price}
            </span>
          );
        },
      },
      {
        Header: "المنصة",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.platform}
            </span>
          );
        },
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <TableActions
              onDelete={() => onDelete(row.original.id)}
              onEdit={() => onEdit(row.original)}
            />
          );
        },
      },
    ],
    [coachNames]
  );

  return (
    <div className="w-full space-y-4">
      {!isLoading ? (
        subscriptions.length !== 0 ? (
          <Table
            data={subscriptions ?? []}
            columns={columns}
            modalTitle="اضافة إشتراك"
            modalContent={
              <AddNewSubscription
                subscriptionData={subscription}
                setSubscriptionData={setSubscription}
              />
            }
            id="add-new-subscription"
          />
        ) : (
          <>
            <Modal id="add-new-subscription">
              <AddNewSubscription
                subscriptionData={subscription}
                setSubscriptionData={setSubscription}
              />
            </Modal>

            <div
              className="flex justify-center"
              onClick={() =>
                document.getElementById("add-new-subscription")?.click()
              }
            >
              <Button secondaryBorder>إضافة إشتراك</Button>
            </div>
          </>
        )
      ) : (
        <>loading...</>
      )}
    </div>
  );
}
