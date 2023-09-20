import { Button, Card, Img, Modal, SettingCard, Table, Text } from "components";
import { Drawer } from "components/Drawer";
import React, { useState, useEffect } from "react";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import AddDietCategories from "./components/AddDietCategories";
import AddDescription from "./add-description";

interface DescriptionType {
  calories: number;
  carbohydrate: number;
  fat: number;
  id: number;
  image: string;
  name: string;
  protein: number;
  sugar: number;
  trans_fat: number;
  ingredients: { name: string };
  prepare: any;
  diet_mea_categories: any;
}

function Descriptions() {
  const [categoryId, setCategoryId] = useState();

  const [meal, setMeal] = useState("Lunch");

  const [valuesItem, setValuesItem] = useState();

  const [mealData, setMealData] = useState<any>();

  // get cards data =================>
  const { data: cardData, isLoading: isCardsLoading }: UseQueryResult<any> =
    useGetQuery("diet-categories", "diet-categories", {
      select: ({ data }: { data: { data: [] } }) => data.data,
      refetchOnWindowFocus: false,
    });

  // get descriptions data list =================>
  const url = `/diet-meals?diet_category_id=${categoryId}&meal=${meal}`;

  const {
    data: descriptionsList = [],
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: DescriptionType[] } }) =>
      data.data.map((item: DescriptionType) => ({
        id: item.id,
        name: item.name,
        calories: item.calories,
        fat: item.fat,
        protein: item.protein,
        sugar: item.sugar,
        trans_fat: item.trans_fat,
        carbohydrate: item.carbohydrate,
        ingredients: item.ingredients,
        prepare: item.prepare,
        image: item.image,
        diet_mea_categories: item.diet_mea_categories,
      })),
    refetchOnWindowFocus: false,
    enabeld: categoryId !== undefined,
  });

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const rowOnClick = (item: any) => {
    setMealData(item.original);
  };

  const onDelete = (id: number) => {
    mutateAsync(`diet-categories/${id}`);
  };
  const onEdit = (value: any) => {
    setValuesItem(value);
    document.getElementById("add-new-nutrition")?.click();
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
    ],
    []
  );

  useEffect(() => {
    setCategoryId(cardData?.[0]?.id);
  }, [cardData]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {!isCardsLoading ? (
          cardData?.map(
            (item: { name: string; id: number; private: number }) => (
              <SettingCard
                onDelete={onDelete}
                onEdit={() => onEdit(item)}
                id={item.id}
                key={item.id}
                label={item.name}
                active={categoryId === item.id}
                onClick={() => setCategoryId(item.id as any)}
                className={
                  item.private === 1 ? "!border-[#CFFF0F]" : "!border-[#fff]"
                }
              />
            )
          )
        ) : (
          <>laoding...</>
        )}
        <Card className={"p-4 w-[180px]"}>
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

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <Button
          primary={meal === "Breakfast"}
          secondaryBorder={meal !== "Breakfast"}
          onClick={() => setMeal("Breakfast")}
        >
          فطور
        </Button>
        <Button
          primary={meal === "Lunch"}
          secondaryBorder={meal !== "Lunch"}
          onClick={() => setMeal("Lunch")}
        >
          غداء
        </Button>
        <Button
          primary={meal === "Snack"}
          secondaryBorder={meal !== "Snack"}
          onClick={() => setMeal("Snack")}
        >
          سناكس{" "}
        </Button>
        <Button
          primary={meal === "Dinner"}
          secondaryBorder={meal !== "Dinner"}
          onClick={() => setMeal("Dinner")}
        >
          عشاء{" "}
        </Button>
      </div>

      {!isListLoading ? (
        <Table
          data={descriptionsList ?? []}
          columns={columns}
          rowOnClick={rowOnClick}
          modalTitle="اضافة وجبة"
          modalContent={<AddDescription />}
        />
      ) : (
        <>loading...</>
      )}

      {descriptionsList?.length === 0 && (
        <>
          <Modal id="add-new-desc">
            <AddDescription emptyData />
          </Modal>

          <div className="flex justify-center">
            <Button
              secondaryBorder
              onClick={() => document.getElementById("add-new-desc")?.click()}
            >
              إضافة وجبة
            </Button>
          </div>
        </>
      )}

      <Modal id="add-new-nutrition">
        <AddDietCategories values={valuesItem} />
      </Modal>

      <Drawer>
        <SideBar
          setMealData={setMealData}
          mealData={mealData ?? {}}
          categoryId={categoryId as any}
          meal={meal}
        />
      </Drawer>
    </div>
  );
}

export default Descriptions;
