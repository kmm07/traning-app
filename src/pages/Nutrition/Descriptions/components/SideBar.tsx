import { Button, Card, Modal, Table, Text } from "components";
import { RowTable } from "components/RowTable";
import TableActions from "components/Table/actions";
import { useDeleteQuery } from "hooks/useQueryHooks";
import React from "react";
import { Row } from "react-table";
import { toast } from "react-toastify";
import AddIngredient from "./addIngredient";
import { useQueryClient } from "react-query";

interface SideBarProps {
  mealData: any;
  setMealData: any;
  categoryId: number;
  meal: string;
}

function SideBar({ mealData, setMealData, categoryId, meal }: SideBarProps) {
  // list actions ======================>
  const { mutateAsync, isLoading } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/diet-meals/${mealData.id}`);
      document.getElementById("my-drawer")?.click();

      queryClient.invalidateQueries(
        `/diet-meals?diet_category_id=${categoryId}&meal=${meal}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // ingredients actions =====================>
  const onDeleteIngredient = (item: any) => {
    const filteredArray = mealData.ingredients?.filter(
      (ingredient: any) => ingredient.id != item.id
    );

    // setMealData({ ...mealData, ingredients: filteredArray });
  };

  const onEditIngredient = (item: any) => {
    console.log(item);
  };

  const onAddIngredient = () => {};

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
        accessor: "calories",
      },
      {
        Header: " الكاربوهيدرات",
        accessor: "carbohydrate",
      },
      {
        Header: "البروتين",
        accessor: "protein",
      },

      {
        Header: "الدهون",
        accessor: "fat",
      },

      {
        Header: "السكريات",
        accessor: "sugar",
      },

      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions
            onEdit={() => onEditIngredient(row.original)}
            onDelete={() => onDeleteIngredient(row.original)}
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
          columns: [
            Number(mealData?.calories).toFixed(2),
            Number(mealData?.protein).toFixed(2),
            Number(mealData?.carbohydrate).toFixed(2),
            Number(mealData?.fat).toFixed(2),
            Number(mealData?.trans_fat).toFixed(2),
            Number(mealData?.sugar).toFixed(2),
          ],
          header: [
            "السعرات",
            "البروتين",
            "الكاربوهيدرات",
            "الدهون",
            "الدهون المتحولة",
            "السكريات",
          ],
        }}
        title="القيمة الغذائية"
      />

      <Card className="px-4 pb-4">
        <div className="flex justify-between py-3">
          <Text size="3xl">المكونات</Text>
        </div>
        <Table
          noPagination
          search={false}
          data={mealData?.ingredients ?? []}
          columns={columnsIngredients}
          modalTitle="اضافة مكون"
          modalContent={<AddIngredient />}
          id=""
        />
      </Card>

      <Card className="px-4 pb-4">
        <div className="flex justify-between py-3">
          <Text size="3xl">طريقة التحضير</Text>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <label htmlFor="internal" className="mb-2">
                رفع من الجهاز
              </label>
              <input id="internal" name="video-url" type="radio" />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="external" className="mb-2">
                ادخال رابط
              </label>
              <input id="external" name="video-url" type="radio" />
            </div>
          </div>
        </div>

        <Table
          noPagination
          search={false}
          data={mealData?.prepare?.steps ?? []}
          columns={[
            {
              Header: "",
              accessor: "description",
              className: "w-full",
              Cell: ({ row }: { row: Row<any> }) => <span>{row.original}</span>,
            },
            {
              Header: " ",
              Cell: ({ row }: { row: Row<any> }) => (
                <TableActions
                  onEdit={() => onEditIngredient(row.original)}
                  onDelete={() => onDeleteIngredient(row.original.id)}
                />
              ),
            },
          ]}
          modalTitle="اضافة خطوة"
          modalContent={<>dd</>}
        />
      </Card>

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary>
          حفظ
        </Button>
        <Button
          className="w-[100px]"
          primary
          onClick={() => document.getElementById("my-drawer")?.click()}
        >
          إلغاء
        </Button>
        <Button
          className="w-[100px]"
          danger
          onClick={onDeleteItem}
          isLoading={isLoading}
        >
          حذف
        </Button>
      </div>

      <Modal>safasdf</Modal>
    </>
  );
}

export default SideBar;
