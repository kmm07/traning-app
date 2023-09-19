import { Button, Card, Img, Modal, Text } from "components";
import { RowTable } from "components/RowTable";
import { useDeleteQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import EditIngredient from "./editIngredient";
interface SideBarProps {
  ingredientData: any;
  categoryId: number;
}

function SideBar({ ingredientData = [], categoryId }: SideBarProps) {
  // ingredients actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/meal-ingredients/${ingredientData.id}`);

      await queryClient.invalidateQueries(
        `/meal-ingredients?meal_ingredient_category_id=${categoryId}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEditItem = () => {
    document.getElementById("add-new-ingredient")?.click();
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Img className="w-24" src={ingredientData?.image} />
          <Text size="3xl">{ingredientData?.name}</Text>
        </div>
      </div>
      <RowTable
        data={{
          columns: [
            Number(ingredientData?.calories).toFixed(2),
            Number(ingredientData?.protein).toFixed(2),
            Number(ingredientData?.carbohydrate).toFixed(2),
            Number(ingredientData?.fat).toFixed(2),
            Number(ingredientData?.trans_fat).toFixed(2),
            Number(ingredientData?.sugar).toFixed(2),
            Number(ingredientData?.size).toFixed(2),
          ],
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
        <div className="flex justify-between p-4 border-b">
          <Text size="3xl">حجم الحصة</Text>
          <span className=" border rounded-full px-10 py-2 flex justify-center items-center border-[#CFFF0F]">
            {Number(ingredientData?.size).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between p-4 border-b">
          <Text size="3xl">نوع الحصة</Text>
          <span className=" border rounded-full px-10 py-2 flex justify-center items-center border-[#CFFF0F]">
            {ingredientData?.measure}
          </span>
        </div>

        <div className="flex items-center justify-evenly mt-6">
          <Button className="w-[100px]" primary onClick={onEditItem}>
            تعديل
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
      </Card>

      <Modal id="add-new-ingredient">
        <EditIngredient values={ingredientData} categoryId={categoryId} />
      </Modal>
    </div>
  );
}

export default SideBar;
