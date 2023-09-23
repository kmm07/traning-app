import { Button, Table } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import React from "react";
import { UseQueryResult } from "react-query";
import { Row } from "react-table";

export default function AddIngredient({ parentId, setParentId }: any) {
  // get descriptions data list =================>
  const url = `/meal-ingredients?meal_ingredient_category_id=${0}`;

  const { data: ingredientsList = [] }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: any[] } }) =>
        data.data.slice(0, 20).map((item: any) => ({
          image: item.image,
          id: item.id,
          name: item.name,
          calories: item.calories,
          fat: item.fat,
          protein: item.protein,
          sugar: item.sugar,
          trans_fat: item.trans_fat,
          carbohydrate: item.carbohydrate,
          size: item.size,
          measure: item.measure,
        })),
    }
  );

  const { setFieldValue, values } = useFormikContext<{ ingredients: any }>();

  const onClose = () => {
    document.getElementById("add-ingredient")?.click();
    setParentId(null);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
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
        Header: " السعرات",
        accessor: "calories",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.calories).toFixed(2)}</span>
        ),
      },
      {
        Header: "البروتين",
        accessor: "protein",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.protein).toFixed(2)}</span>
        ),
      },
      {
        Header: "الكاروبهيدرات",
        accessor: "carbohydrate",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.carbohydrate).toFixed(2)}</span>
        ),
      },
      {
        Header: "الدهون",
        accessor: "fat",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.fat).toFixed(2)}</span>
        ),
      },
      {
        Header: "الدهون المتحولة",
        accessor: "trans_fat",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.trans_fat).toFixed(2)}</span>
        ),
      },
      {
        Header: "السكريات",
        accessor: "sugar",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.sugar).toFixed(2)}</span>
        ),
      },
      {
        Header: "الحجم",
        accessor: "size",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.size).toFixed(2)}</span>
        ),
      },
      {
        Header: "المعيار",
        accessor: "measure",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{row.original.measure}</span>
        ),
      },
    ],
    []
  );

  const rowOnClick = (e: any) => {
    setFieldValue("ingredients", [
      ...(values.ingredients ?? []),
      { ...e.original, parent_id: parentId },
    ]);

    onClose();
  };

  return (
    <div>
      <Table
        data={ingredientsList ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        withoutCloseDrawer={true}
      />

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
