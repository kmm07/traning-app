import { Table } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import CardioForm from "./add-cardio";

function Cardio() {
  const [cardioData, setCardioData] = useState<any>(null);

  // get cards data =================>
  const url = "/cardios";

  const { data: cardioList, isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "التمرين",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <span className="indicator-item badge-sm h-6 rounded-full badge badge-warning">
                  2
                </span>
                <div className="w-12 h-12 rounded-full">
                  <img src="/images/img_rectangle347.png" />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },

      {
        Header: "التمرين",
        accessor: "cardios",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original.cardios?.map(({ name }: { name: string }) => name)}
            </div>
          );
        },
      },
    ],
    []
  );
  const rowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | any
  ) => {
    const formattedCardioData = e.original.cardios?.map((cardio) => ({
      ...cardio,
      is_new: 0,
    }));

    setCardioData({ ...e.original, cardios: formattedCardioData });
  };

  if (isLoading) {
    return <>loading...</>;
  }
  return (
    <div className="w-full space-y-4">
      <Table
        data={cardioList ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة كارديو"
        modalContent={
          <CardioForm cardioData={cardioData} setCardioData={setCardioData} />
        }
      />

      <Drawer>
        <SideBar cardioData={cardioData} setCardioData={setCardioData} />
      </Drawer>
    </div>
  );
}

export default Cardio;
