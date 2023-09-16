import { Modal, Table } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
// import AddNotification from "pages/Notifications/components/AddNotification";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { Row } from "react-table";
import AddCoupone from "./components/add-coupone";
import { Drawer } from "components/Drawer";
import CouponeSideBar from "./components/sideBar";
import { useAppDispatch } from "hooks/useRedux";
import { setImageDelete } from "redux/slices/imageDelete";

type Props = {};

export default function Coupones({}: Props) {
export default function Coupones() {
  const [active, setActive] = useState<number>();

  // get notifications data =================>
  const url = "/coupons";

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "اسم الكوبون",
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
              {row.original?.name}
            </div>
          );
        },
      },
      {
        Header: "وصف الكوبون",
        accessor: "description",
      },
      {
        Header: "نقاط الكوبون",
        accessor: "points",
      },
      {
        Header: "تفاصيل الكوبون",
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

  const [activeCopoune, setActiveCopoune] = useState<number>();

  const dispatch = useAppDispatch();

  const rowOnClick = (e: any) => {
    setActiveCopoune(e.original);

    dispatch(setImageDelete(false));
  };

  return (
    <div>
      <Table
        data={data ?? []}
        columns={columns}
        modalContent={<AddCoupone />}
        rowOnClick={rowOnClick}
        id="add-coupone"
        modalTitle="إضافة كوبون"
      />

      <Modal id="add-coupone">
        <AddCoupone />
      </Modal>

      <Drawer>
        <CouponeSideBar couponeData={activeCopoune} />
      </Drawer>
    </div>
  );
}
