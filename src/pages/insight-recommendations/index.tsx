import { Button, Table } from "components";
import React, { useState } from "react";
import { Row } from "react-table";
import { UseQueryResult, useQueryClient } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import useAxios from "hooks/useAxios";
import { toast } from "react-toastify";

// توصيات النظام للمدرب من تحليل ما بعد التمرين (غياب / صعوبة متكررة / تمرين
// متروك وله بديل). النظام لا يعدّل برنامج المستخدم أبدًا — المدرب يقرأ التوصية
// وينفّذ ما يراه من أدوات اللوحة ثم يعلّمها "عولجت" أو "تجاهُل".

const statusTabs = [
  { key: "pending", label: "قيد الانتظار" },
  { key: "handled", label: "عولجت" },
  { key: "dismissed", label: "متجاهَلة" },
] as const;

// لون شارة النوع
const typeColors: Record<string, string> = {
  deload_week: "bg-amber-500/20 text-amber-400",
  reschedule_missed_day: "bg-sky-500/20 text-sky-400",
  swap_exercise: "bg-violet-500/20 text-violet-400",
};

function InsightRecommendations() {
  const [status, setStatus] = useState<string>("pending");

  const url = `/insight-recommendations?status=${status}&per_page=200`;

  const { data }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
  });

  const items = data?.items ?? [];

  const queryClient = useQueryClient();
  const axios = useAxios({ contentType: "application/json" });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);
      await axios.post(`/insight-recommendations/${id}/status`, {
        status: newStatus,
      });
      toast.success("تم تحديث حالة التوصية");
      await queryClient.invalidateQueries(url);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "المستخدم",
        Cell: ({ row }: { row: Row<any> }) => (
          <div className="font-bold whitespace-nowrap">
            {row.original.user_name ?? `#${row.original.user_id}`}
          </div>
        ),
      },
      {
        Header: "النوع",
        Cell: ({ row }: any) => (
          <span
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              typeColors[row.original.type] ?? "bg-gray-500/20 text-gray-300"
            }`}
          >
            {row.original.type_label ?? row.original.type}
          </span>
        ),
      },
      {
        Header: "التوصية",
        Cell: ({ row }: any) => (
          <div className="max-w-[380px] break-words space-y-1">
            <div className="font-bold">{row.original.title}</div>
            <div className="opacity-80">{row.original.description}</div>
          </div>
        ),
      },
      {
        Header: "التاريخ",
        Cell: ({ row }: any) => (
          <span className="whitespace-nowrap">{row.original.date}</span>
        ),
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }: any) => (
          <div className="flex gap-2">
            {row.original.status === "pending" ? (
              <>
                <Button
                  className="!w-[90px]"
                  primary
                  isLoading={updatingId === row.original.id}
                  onClick={() => updateStatus(row.original.id, "handled")}
                >
                  عولجت
                </Button>
                <Button
                  className="!w-[90px]"
                  secondaryBorder
                  isLoading={updatingId === row.original.id}
                  onClick={() => updateStatus(row.original.id, "dismissed")}
                >
                  تجاهُل
                </Button>
              </>
            ) : (
              <Button
                className="!w-[120px]"
                secondaryBorder
                isLoading={updatingId === row.original.id}
                onClick={() => updateStatus(row.original.id, "pending")}
              >
                إرجاع للانتظار
              </Button>
            )}
          </div>
        ),
      },
    ],
    [updatingId, status]
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab.key}
            className="!w-[130px]"
            primary={status === tab.key}
            secondaryBorder={status !== tab.key}
            onClick={() => setStatus(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Table
        data={items}
        columns={columns}
        noDataMessage="لا توجد توصيات في هذه الحالة"
      />
    </div>
  );
}

export default InsightRecommendations;
