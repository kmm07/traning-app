import { Card, Img, Modal, SettingCard, Table, Text } from "components";
import { Drawer } from "components/Drawer";
import React, { useState } from "react";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import AddDietCategories from "./components/AddDietCategories";

function Descriptions() {
  const [level, setLevel] = useState(1);
  const [valuesItem, setValuesItem] = useState();
  const [ingredients, setIngredients] = useState<any>();

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
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
        Header: " السعرات",
        accessor: "provider",
      },
      {
        Header: "البروتين",
        accessor: "gender",
      },
      {
        Header: "الكاروبهيدرات",
        accessor: "mail",
      },
      {
        Header: "الدهون",
        accessor: "phone",
      },
      {
        Header: "الدهون المتحولة",
        accessor: "country",
      },
      {
        Header: "السكريات",
        accessor: "device",
      },
    ],
    []
  );
  const { data: cardData }: UseQueryResult<any> = useGetQuery(
    "diet-categories",
    "diet-categories",
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  const { mutateAsync } = useDeleteQuery();
  const rowOnClick = (item: any) => {
    setIngredients([item]);
  };

  const onDelete = (id: number) => {
    mutateAsync(`diet-categories/${id}`);
  };
  const onEdit = (value: any) => {
    setValuesItem(value);
    document.getElementById("add-new-nutrition")?.click();
  };

  if (!cardData) {
    return <>loading...</>;
  }
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {cardData?.map((item: { name: string; id: number }) => (
          <SettingCard
            onDelete={onDelete}
            onEdit={() => onEdit(item)}
            id={item.id}
            key={item.id}
            label={item.name}
            active={level === item.id}
            onClick={() => setLevel(item.id)}
          />
        ))}
        <Card className={`p-4 w-[180px]  `}>
          <label
            htmlFor="add-new-nutrition"
            className={`flex flex-col cursor-pointer justify-between items-center relative `}
          >
            <Img
              className="w-16 absolute top-0 left-0"
              src="/images/plus.svg"
            />
            <Text size="3xl" className="mt-4">
              اضافة
            </Text>
          </label>
        </Card>
      </div>

      <Table
        data={[]}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة وجبة"
        modalContent={<>dd</>}
      />
      <Modal id="add-new-nutrition">
        <AddDietCategories values={valuesItem} />
      </Modal>
      <Drawer>
        <SideBar ingredients={ingredients} />
      </Drawer>
    </div>
  );
}

export default Descriptions;
