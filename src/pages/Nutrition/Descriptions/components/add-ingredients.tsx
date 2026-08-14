import { Button, Input, Table } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import React, { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import { Row } from "react-table";

const PER_PAGE = 25;

export default function AddIngredient({
  parentId,
  setParentId,
  setRefresher,
  refresher,
}: any) {
  // البحث خادميّ لا محلّيّ: الكتالوج فيه أكثر من ١٧ ألف مكوّن، وحقل بحث
  // الجدول كان يرشّح الصفحة المحمَّلة وحدها (٢٤ صفّاً) فيبدو أن أغلب
  // المكوّنات غير موجودة. الخادم يدعم `search_query` أصلاً.
  const [search, setSearch] = useState("");

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // get descriptions data list =================>
  const url = `/meal-ingredients?meal_ingredient_category_id=${0}&per_page=${PER_PAGE}&page=${page}${
    query ? `&search_query=${encodeURIComponent(query)}` : ""
  }`;

  const { data: ingredientsData }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({
      data,
    }: {
      data: { data: any[]; pagination: any };
    }) => ({
      items: (data.data ?? []).map((item: any) => ({
        ...item,
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
      pagination: data.pagination,
    }),
    refetchOnWindowFocus: false,
  });

  const ingredientsList = ingredientsData?.items ?? [];

  const pagination = ingredientsData?.pagination ?? null;

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

    setRefresher((refresher += 1));

    onClose();
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          name=""
          isForm={false}
          inputSize="large"
          placeholder="ابحث في كل المكوّنات..."
          value={search}
          className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl border-slate-800"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        data={ingredientsList ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        withoutCloseDrawer={true}
        search={false}
        pagination={pagination ?? undefined}
        setPage={setPage}
      />

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
