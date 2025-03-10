import { Button, Card, Input, Img, Modal, SettingCard, LoadingTable, Text } from "components";
import React, { useState, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { UseQueryResult, useQueryClient } from "react-query";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import AddIngredientCategories from "./components/AddIngredientCategories";
import { toast } from "react-toastify";
import EditIngredient from "./components/editIngredient";
import Loading from "components/Loader";

function Ingredients() {
  const [categoryId, setCategoryId] = useState(1);

  const [ingredientData, setIngredientData] = useState<any>(null);

  const [valuesItem, setValuesItem] = useState(null);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const url = `/meal-ingredients?meal_ingredient_category_id=${categoryId}&per_page=25&page=${currentPage}&search_query=${searchQuery.trim()}`;

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

  const rowOnClick = (item: any) => {
    setIngredientData(item.original);
  };

  useEffect(() => {
    setCategoryId(cardData?.[0]?.id);
  }, [cardData]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-23 ">
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
                className={`h-[120px] ${
                  item.private === 1 ? "!border-[#CFFF0F]" : "!border-[#fff]"
                }`}
              />
            );
          })
        ) : (
          <Loading />
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

        {
          <div className="flex me-auto gap-4 items-center">
            <Button
              htmlFor="my-drawer"
              onClick={() => setIngredientData(null)}
              rounded={"full"}
              primary
            >
              {"إضافة مكون"}
            </Button>
          </div>
        }
      </div>
      <div className="!mt-10 w-full">
        {!isListLoading ? (
          <LoadingTable
            data={ingredientsList ?? []}
            columns={columns}
            rowOnClick={rowOnClick}
            setPage={setCurrentPage}
            pagination={pagination}
          />
        ) : (
          <Loading />
        )}
      </div>

      </div>
      {ingredientsList?.length === 0 && (
        <>
          <Modal id="add-new-ing">
            <EditIngredient values={null} categories={cardData} empty />
          </Modal>

          <div className="flex justify-center">
            <Button
              secondaryBorder
              onClick={() => document.getElementById("my-drawer")?.click()}
            >
              إضافة وصفة
            </Button>
          </div>
        </>
      )}

      <Modal id="add-new-nutrition">
        <AddIngredientCategories values={valuesItem} />
      </Modal>

      <Drawer>
        <SideBar ingredientData={ingredientData} categoryId={categoryId} currentPage={currentPage} searchQuery={searchQuery}/>
      </Drawer>
    </div>
  );
}

export default Ingredients;
