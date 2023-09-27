// import React from "react";
import { Button, Card, Table, Text } from "components";
import useAxios from "hooks/useAxios";
import { useQueryClient } from "react-query";
import { Row } from "react-table";
import { toast } from "react-toastify";
import { useMemo } from "react";

export default function RequestsSidebar({ couponeData }: any) {
  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  // on accepts copoune request ========================>
  const axios = useAxios({});

  const queryClient = useQueryClient();

  const onAcceptRequest = async (id: number) => {
    try {
      await axios.post(`/accept-coupon-request/${id}`);

      toast.success("تم قبول الطلب");

      await queryClient.invalidateQueries("/coupons");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const requestsColumns = useMemo(
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
              {row.original.user_name}
            </div>
          );
        },
      },

      {
        Header: "مشترك أم لا",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.is_subscriped ? "مشترك" : "غير مشترك"}
            </span>
          );
        },
      },

      {
        Header: "نوع المستخدم",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.user_gender === "male" ? "ذكر" : "انثي"}
            </span>
          );
        },
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <Button
              onClick={() => onAcceptRequest(row.original?.id)}
              primaryBorder
            >
              قبول الطلب
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-[100px] h-[100px] bg-primary rounded-md" />
          <Text className="text-white">{couponeData?.name}</Text>
        </div>

        <Card className="p-6 !w-[200px] flex flex-col items-center">
          <Text as="h5" className="text-[30px] mb-4">
            النقاط
          </Text>
          <Text as="h5" className="text-[30px] mb-4">
            {couponeData?.points}
          </Text>
        </Card>
      </Card>

      <Card className="p-6">
        <Text as="h5">الكود</Text>
        <Text as="h2" className="text-center">
          {couponeData?.code}
        </Text>
      </Card>

      <Card className="p-6">
        <Card className="!w-fit p-2">
          <Text as="h5">عدد الطلبات {couponeData?.requests?.length}</Text>
        </Card>

        <Table data={couponeData?.requests ?? []} columns={requestsColumns} />
      </Card>

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
