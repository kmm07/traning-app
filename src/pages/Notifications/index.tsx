import { Card, Img, Modal, SettingCard, Table, Text } from "components";
import React, { useMemo, useState } from "react";
import { Row } from "react-table";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import AddNotification from "./components/AddNotification";

function Notifications() {
  const [active, setActive] = useState(0);

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
                    src={row.original.image || "/images/img_rectangle347.png"}
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
      {
        Header: "المستخدمين",
        accessor: "users_names",
        Cell: ({ row }: any) => (
          <div className="max-w-[300px] break-words">
            {row.original.users_names}
          </div>
        ),
      },
    ],
    []
  );

  const cardData = [
    {
      label: "الاشعارات العامه",
      id: 0,
    },
    {
      label: "الاشعارات المخصصة",
      id: 1,
    },
  ];

  const filteredNotifications = useMemo(() => {
    return data?.filter((notify: any) => notify.private === active);
  }, [active]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {cardData.map((item, index) => (
          <SettingCard
            id={item.id}
            key={index}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>

      {filteredNotifications?.length > 0 ? (
        <Table
          data={filteredNotifications ?? []}
          columns={columns}
          modalContent={<AddNotification active={active} />}
          id="add-notification"
          modalTitle="إضافة إشعار"
        />
      ) : (
        <Card className={"p-4 !w-[280px] !h-[120px] mx-auto"}>
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
        <AddNotification active={active} />
      </Modal>
    </div>
  );
}

export default Notifications;
