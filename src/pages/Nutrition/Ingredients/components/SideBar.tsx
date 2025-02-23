import { Button, Card, Input, Text, UploadInput } from "components";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import formData from "util/formData";
interface SideBarProps {
  ingredientData: any;
  categoryId: number;
  currentPage: number;
  searchQuery: string;
}

const initialValues = {
  name: "",
  calories: "",
  protein: "",
  carbohydrate: "",
  fat: "",
  sugar: "",
  trans_fat: "",
  measure: "",
  size: "",
  image: "",
  meal_ingredient_category_id: "",
  code: "",
  brand: "",
};

function SideBar({ ingredientData = [], categoryId, currentPage, searchQuery }: SideBarProps) {
  // ingredients actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/meal-ingredients/${ingredientData.id}`);

      await queryClient.invalidateQueries(
        `/meal-ingredients?meal_ingredient_category_id=${categoryId}&per_page=25&page=${currentPage}&search_query=${searchQuery.trim()}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };


  const isEditing = ingredientData !== null;

  const url = isEditing
    ? `/meal-ingredients/${ingredientData.id}`
    : "meal-ingredients";


  const { mutateAsync: addIngredient, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  const onSubmit = async (values: any, helpers: any) => {
    try {
      if (isEditing) {
        typeof values.image !== "object" && delete values.image;
        await addIngredient(
          formData({
            ...values,
            meal_ingredient_category_id: categoryId,
            _method: "PUT",
          }) as any
        );
      } else {
        await addIngredient(
          formData({
            ...values,
            meal_ingredient_category_id: categoryId,
          }) as any
        );
      }

      await queryClient.invalidateQueries(
        `/meal-ingredients?meal_ingredient_category_id=${categoryId}&per_page=25&page=${currentPage}&search_query=${searchQuery.trim()}`
      );

      onClose();

      helpers.resetForm();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const mealValue = [
    "السعرات",
    "البروتين",
    "الكاربوهيدرات",
    "الدهون",
    "الدهون المتحولة",
    "السكريات",
  ];

  return (
    <Formik
      initialValues={{ ...initialValues, ...ingredientData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form className="flex flex-col gap-10">
        <div className="flex justify-between">
          <div className="flex w-[550px] gap-4">
            <UploadInput name="image" />
            <Input name="name" className="font-bold !text-2xl" />
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-6 gap-6">
            {mealValue.map((item) => (
              <Text as="h5" key={item} className="!text-center w-full">
                {item}
              </Text>
            ))}
          </div>
          <div className="my-4 h-[4px] bg-primary" />
          <div className="grid grid-cols-6 gap-6">
            <Input name="calories" className="text-center font-bold" />
            <Input name="protein" className="text-center font-bold" />
            <Input name="carbohydrate" className="text-center font-bold" />
            <Input name="fat" className="text-center font-bold" />
            <Input name="trans_fat" className="text-center font-bold" />
            <Input name="sugar" className="text-center font-bold" />
          </div>
        </Card>
        <Card className="px-4 pb-4">
          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">حجم الحصة</Text>
            <div className="w-[200px]">
              <Input
                name="size"
                className="border rounded-full px-10 py-2 text-center border-[#CFFF0F]"
              />
            </div>
          </div>
          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">نوع الحصة</Text>
            <div className="w-[200px]">
              <Input
                name="measure"
                className=" border rounded-full px-10 py-2 text-center border-[#CFFF0F]"
              />
            </div>
          </div>
          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">Barcode</Text>
            <div className="w-[200px]">
              <Input
                name="code"
                className=" border rounded-full px-10 py-2 text-center border-[#CFFF0F]"
              />
            </div>
          </div>
          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">العلامة التجارية</Text>
            <div className="w-[200px]">
              <Input
                name="brand"
                className=" border rounded-full px-10 py-2 text-center border-[#CFFF0F]"
              />
            </div>
          </div>

          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              type="submit"
              isLoading={isAddLoading}
            >
              {isEditing ? "تعديل" : "إضافة"}
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
      </Form>
    </Formik>
  );
}

export default SideBar;
