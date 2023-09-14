import { Card, Img, Modal, SettingCard, Table, Text } from "components";
import React, { useState, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { UseQueryResult, useQueryClient } from "react-query";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import AddIngredientCategories from "./components/AddIngredientCategories";
import EditIngredient from "./components/editIngredient";
import { toast } from "react-toastify";

function Ingredients() {
  const [categoryId, setCategoryId] = useState(1);

  const [ingredientData, setIngredientData] = useState<any>();

  const [valuesItem, setValuesItem] = useState();

  // get cards data =================>
  const categoriesURL = "/meal-ingredient-categories";

  const { data: cardData, isLoading: isCardsLoading }: UseQueryResult<any> =
    useGetQuery(categoriesURL, categoriesURL, {
      select: ({ data }: { data: { data: [] } }) => data.data,
      refetchOnWindowFocus: false,
    });

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    try {
      await mutateAsync(`meal-ingredient-categories/${id}`);

      await queryClient.invalidateQueries("/meal-ingredient-categories");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEdit = (value: any) => {
    setValuesItem(value);
    document.getElementById("add-new-nutrition")?.click();
  };

  // get descriptions data list =================>
  const url = `/meal-ingredients?meal_ingredient_category_id=${categoryId}`;

  const {
    data: ingredientsList = [],
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[] } }) =>
      data.data.slice(0, 20).map((item: any) => ({
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

    refetchOnWindowFocus: false,
  });

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
    ],
    []
  );

  const rowOnClick = (item: any) => {
    setIngredientData(item.original);
  };

  useEffect(() => {
    setCategoryId(cardData?.[0]?.id);
  }, [cardData]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {!isCardsLoading ? (
          cardData?.map((item: any) => {
            return (
              <SettingCard
                onDelete={onDelete}
                onEdit={() => onEdit(item)}
                id={item.id}
                key={item.id}
                label={item.name}
                active={categoryId === item.id}
                onClick={() => setCategoryId(item.id)}
              />
            );
          })
        ) : (
          <>loading...</>
        )}

        <Card className={`p-4 w-[180px] cursor-pointer`}>
          <label
            htmlFor="add-new-nutrition"
            className={`flex flex-col justify-between items-center relative `}
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

      {!isListLoading ? (
        <Table
          data={ingredientsList ?? []}
          columns={columns}
          rowOnClick={rowOnClick}
          modalTitle="اضافة مكون"
          modalContent={<EditIngredient values={null} categories={cardData} />}
        />
      ) : (
        <>loading...</>
      )}

      <Modal id="add-new-nutrition">
        <AddIngredientCategories values={valuesItem} />
      </Modal>

      <Drawer>
        <SideBar ingredientData={ingredientData} categoryId={categoryId} />
      </Drawer>
    </div>
  );
}

export default Ingredients;
