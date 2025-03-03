import { Button, Input, LoadingTable } from "components";
import Loading from "components/Loader";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { Row } from "react-table";

export default function AddIngredient({
  parentId,
  setParentId,
  setRefresher,
  refresher,
}: any) {
  // get descriptions data list =================>
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const url = `/meal-ingredients?meal_ingredient_category_id=${0}&per_page=25&page=${currentPage}&search_query=${searchQuery.trim()}`;
  

  const {
    data: ingredientsData,
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[]; pagination: any } }) => ({
      items: data.data.map((item: any) => ({
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
        image: item.image,
        code: item.code ?? "",
        brand: item.brand ?? "",
        one_size_calories: item.one_size_calories ?? 0,
        one_size_protein: item.one_size_protein ?? 0,
        one_size_carbohydrate: item.one_size_carbohydrate ?? 0,
        one_size_fat: item.one_size_fat ?? 0,
        one_size_trans_fat: item.one_size_trans_fat ?? 0,
        one_size_sugar: item.one_size_sugar ?? 0,
      })),
      pagination: data.pagination, // استخراج معلومات التصفح
    }),
    refetchOnWindowFocus: false,
  });
  
  const ingredientsList = ingredientsData?.items ?? [];
  const pagination = ingredientsData?.pagination ?? {};

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
          Header: "الكاربوهيدرات",
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
        {
          Header: "العلامة التجارية",
          accessor: "brand",
          Cell: ({ row }: { row: Row<any> }) => (
            <span>{row.original.brand == "" ? "-" : row.original.brand}</span>
          ),
        },
      ],
      []
    );

  const { setFieldValue, values } = useFormikContext<{ ingredients: any }>();

  const onClose = () => {
    document.getElementById("add-ingredient")?.click();
    setParentId(null);
  };
  

  const rowOnClick = (e: any) => {
    setFieldValue("ingredients", [
      ...(values.ingredients ?? []),
      { ...e.original, parent_id: parentId },
    ]);

    setRefresher((refresher += 1));

    onClose();
  };

  return (
    <div>
      <div className="flex flex-col p-5 items-end gap-4 bg-[#151423] overflow-hidden shadow-bs border-[#26243F] border rounded-[25px]">
      <div className=" flex gap-7 w-full justify-between items-center">
        <div className="flex-1 flex items-center gap-7">
          {
            <div className="w-1/2">
              <Input
                name=""
                isForm={false}
                inputSize="large"
                className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl  border-slate-800"
                onChange= {(e) => {
                  setSearchQuery(e.target.value.trim());
                  setCurrentPage(1);
                }
              }
              />
            </div>
          }
        </div>
      </div>
      <div className="!mt-10 w-full">
        {!isListLoading ? (
          <LoadingTable
            data={ingredientsList ?? []}
            columns={columns}
            rowOnClick={rowOnClick}
            setPage={setCurrentPage}
            pagination={pagination}
            withoutCloseDrawer={true}
          />
        ) : (
          <Loading />
        )}
      </div>

      </div>

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
