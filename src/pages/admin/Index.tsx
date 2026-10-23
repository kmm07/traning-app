import { Button, Modal, Table } from "components";
import TableActions from "components/Table/actions";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { Row } from "react-table";
import AddAdmin from "./components/addAdmin";
import { useConfirm } from "components/ConfirmDialog/context";
import { toast } from "react-toastify";
import { useAppSelector } from "hooks/useRedux";
import { selectAuthData } from "redux/slices/auth";
import { Chip } from "components";

export default function Admin() {
  const confirm = useConfirm();
  const [admins, setAdmins] = useState<any>();

  // get exercises categories ======================>
  const url = "/admins";

  const { data: admin = [], isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  // admin actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();
  const me = useAppSelector(selectAuthData)?.user;

  // تعطيلٌ/تفعيلٌ بلا حذف: يمنع الدخول فوراً (اللوحة والتطبيق) ويُعيده التفعيل
  const onToggle = async (a: any) => {
    const disabling = !a.disabled;
    if (
      !(await confirm({
        title: disabling ? "تعطيل الحساب؟" : "تفعيل الحساب؟",
        message: disabling
          ? "يُمنع من الدخول فوراً — حتى لو كان داخل اللوحة الآن — وتبقى بياناته كما هي."
          : "يستطيع الدخول مجدداً بكلمة مروره.",
        confirmLabel: disabling ? "تعطيل" : "تفعيل",
        tone: "neutral",
      }))
    ) {
      return;
    }
    try {
      const token = (JSON.parse(localStorage.getItem("userLogin") ?? "{}") || {}).token;
      await fetch(`https://personaltrainerkmm.com/api/admin/admins/${a.id}/${disabling ? "disable" : "enable"}`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, accept: "application/json" },
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.message ?? "تعذّر التنفيذ");
      });
      await queryClient.invalidateQueries("/admins");
    } catch (e: any) {
      toast.error(e?.message ?? "تعذّر التنفيذ");
    }
  };

  const onDelete = async (id: number) => {
    if (
      !(await confirm({
        title: "حذف حساب المسؤول؟",
        message: "يفقد الوصول إلى اللوحة فوراً.",
      }))
    ) {
      return;
    }

    try {
      await mutateAsync(`/admins/${id}`);

      await queryClient.invalidateQueries("/admins");
    } catch {
      // الرسالة من `onError`.
    }
  };

  const onEdit = async (value: any) => {
    await setAdmins(value);
    document.getElementById("add-new-admins")?.click();
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
        Header: "ايمال",
        accessor: "email",
      },

      {
        // [المرحلة ٤] نوعُ الحساب ونطاقُه
        Header: "النوع",
        Cell: ({ row }: { row: Row<any> }) => {
          const a = row.original;
          if (a.type === "coach") {
            return (
              <div className="flex items-center gap-2 flex-wrap">
                <Chip tone="brand" size="sm">مدرّب</Chip>
                <span>{a.coach_name}</span>
                {a.access_level === "read" && <Chip tone="warning" size="sm">قراءة فقط</Chip>}
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2 flex-wrap">
              <Chip tone={a.is_super ? "success" : "neutral"} size="sm">{a.is_super ? "مدير أعلى" : "مسؤول"}</Chip>
              {a.scope_mode === "selected" && (
                <Chip tone="neutral" size="sm">يشرف على {a.scope_coach_ids?.length ?? 0} مدرّب</Chip>
              )}
            </div>
          );
        },
      },

      {
        Header: "الحالة",
        Cell: ({ row }: { row: Row<any> }) =>
          row.original.disabled ? (
            <Chip tone="danger" size="sm">معطَّل</Chip>
          ) : (
            <Chip tone="success" size="sm">فعّال</Chip>
          ),
      },

      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-2">
              {row.original.id !== me?.id && (
                <Button soft size="small" onClick={() => onToggle(row.original)}>
                  {row.original.disabled ? "تفعيل" : "تعطيل"}
                </Button>
              )}
            <TableActions
              onDelete={
                row.original.id === 1
                  ? undefined
                  : () => onDelete(row.original.id)
              }
              onEdit={() => onEdit(row.original)}
            />
            </div>
          );
        },
      },
    ],
    [me?.id]
  );

  return (
    <div className="w-full space-y-4">
      {!isLoading ? (
        admin.length !== 0 ? (
          <Table
            data={admin ?? []}
            columns={columns}
            modalTitle="اضافة مسؤل جديد"
            modalContent={
              <AddAdmin adminsData={admins} setAdminsData={setAdmins} />
            }
            id="add-new-admins"
          />
        ) : (
          <>
            <Modal id="add-new-admins">
              <AddAdmin adminsData={admins} setAdminsData={setAdmins} />
            </Modal>

            <div
              className="flex justify-center"
              onClick={() => document.getElementById("add-new-admins")?.click()}
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
