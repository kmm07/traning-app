import { Card, Img, Modal, Table, Text } from "components";
import React from "react";
import { Row } from "react-table";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import AddNotification from "./components/AddNotification";

function Notifications() {
  // get notifications data =================>
  const url = "/notifications";

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "عنوان الإشعار",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image ?? "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.title}
            </div>
          );
        },
      },

      {
        Header: "وصف الإشعار",
        accessor: "desctiption",
      },
      {
        Header: "تفاصيل الإشعار",
        accessor: "details",
        Cell: ({ row }: any) => (
          <div>
            {row.original.details?.map((detail: any, index: number) => (
              <span>
                {index === row.original.details?.length - 1
                  ? detail
                  : ` ${detail}، `}
              </span>
            ))}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-3"></div>
      {data?.length > 0 ? (
        <Table
          data={data ?? []}
          columns={columns}
          modalContent={<AddNotification />}
          id="add-notification"
          modalTitle="إضافة إشعار"
        />
      ) : (
        <Card className={"p-4 w-[180px]"}>
          <label
            htmlFor="add-notification"
            className={
              "flex flex-col cursor-pointer justify-between items-center relative"
            }
          >
            <Img
              className="w-16 absolute top-0 left-0"
              src="/images/plus.svg"
            />
            <Text size="3xl" className="mt-4">
              إرسال إشعار
            </Text>
          </label>
        </Card>
      )}

      <Modal id="add-notification">
        <AddNotification />
      </Modal>
    </div>
  );
}

export default Notifications;
