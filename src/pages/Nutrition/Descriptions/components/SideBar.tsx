import { Button, Card, Table, Text } from "components";
import { RowTable } from "components/RowTable";
import TableActions from "components/Table/actions";
import React from "react";
import { Row } from "react-table";

interface SideBarProps {
  ingredients: any;
}

function SideBar({ ingredients = [] }: SideBarProps) {
  console.log(
    "🚀 ~ file: SideBar.tsx:11 ~ SideBar ~ ingredients:",
    ingredients
  );
  const columnsIngredients = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex text-white items-center gap-4">
              <div className="w-8 h-">
                <img src="/images/img_rectangle347.png" />
              </div>
              {row.original.name}
            </div>
          );
        },
      },
      {
        Header: "السعرات",
        accessor: "",
      },
      {
        Header: " الكاربوهيدرات",
        accessor: "provider",
      },
      {
        Header: "البروتين",
        accessor: "gender",
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
      {
        Header: "الحجم",
        accessor: "size",
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions
            onEdit={() => {
              console.log("🚀 ~ file: SideBar.tsx:89 ~ SideBar ~ row", row);
            }}
            onDelete={() => {
              console.log("🚀 ~ file: SideBar.tsx:93 ~ SideBar ~ row", row);
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <RowTable
        data={{
          columns: ["1", "2", "3", "4", "5", "6", "7"],
          header: [
            "السعرات",
            "البروتين",
            "الكاربوهيدرات",
            "الدهون",
            "الدهون المتحولة",
            "السكريات",
            "الحجم",
          ],
        }}
        title="القيمة الغذائية"
      />
      <Card className="px-4 pb-4">
        <div className="flex justify-between py-3">
          <Text size="3xl">المكونات</Text>
          <Button rounded="full" primary>
            اضافة مكون
          </Button>
        </div>
        <Table
          noPagination
          search={false}
          data={ingredients}
          columns={columnsIngredients}
          modalTitle="اضافة مكون"
          modalContent={<>dd</>}
        />
      </Card>
      <Card className="px-4 pb-4">
        <div className="flex justify-between py-3">
          <Text size="3xl">طريقة التحضير</Text>
        </div>
        <Table
          noPagination
          search={false}
          data={[
            {
              description: "ahmedddd",
            },
          ]}
          columns={[
            {
              Header: " ",
              accessor: "description",
              className: "w-full",
            },
            {
              Header: " ",
              Cell: ({ row }: { row: Row<any> }) => (
                <TableActions
                  onEdit={() => {
                    console.log(
                      "🚀 ~ file: SideBar.tsx:89 ~ SideBar ~ row",
                      row
                    );
                  }}
                  onDelete={() => {
                    console.log(
                      "🚀 ~ file: SideBar.tsx:93 ~ SideBar ~ row",
                      row
                    );
                  }}
                />
              ),
            },
          ]}
          modalTitle="اضافة خطوة"
          modalContent={<>dd</>}
        />
      </Card>
    </>
  );
}

export default SideBar;
