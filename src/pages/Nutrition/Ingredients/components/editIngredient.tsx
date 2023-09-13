import { Button, Input } from "components";
import { Form, Formik } from "formik";
import { usePostQuery, usePutQuery } from "hooks/useQueryHooks";
import { toast } from "react-toastify";

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
};

export default function EditIngredient({
  values,
  categoryId,
}: {
  values: any;
  categoryId: number;
}) {
  const isEditing = values !== null;

  const url = isEditing ? `/meal-ingredients/${values.id}` : "meal-ingredients";

  const { mutateAsync: addIngredient, isLoading: isAddLoading } = usePostQuery({
    url,
  });

  const { mutateAsync: editIngredient, isLoading: isEditLoading } = usePutQuery(
    { url }
  );

  const onSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await editIngredient({
          ...values,
          meal_ingredient_category_id: categoryId,
          _method: "PUT",
        });
      } else await addIngredient(values);

      document.getElementById("add-new-ingredient")?.click();

      document.getElementById("my-drawer")?.click();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...values }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form>
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" isForm label="الإسم" />
          <Input name="calories" isForm label="السعرات" />
          <Input name="protein" isForm label="البروتين" />
          <Input name="carbohydrate" isForm label="الكربوهيدرات" />
          <Input name="fat" isForm label="الدهون" />
          <Input name="sugar" isForm label="السكريات" />
          <Input name="trans_fat" isForm label="الدهون المتحولة" />
          <Input name="measure" isForm label="نوع الحصة" />
          <Input name="size" isForm label="حجم الحصة" />
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button
            className="w-[100px]"
            primary
            type="submit"
            isLoading={isAddLoading || isEditLoading}
          >
            تعديل
          </Button>
          <Button
            className="w-[100px]"
            secondaryBorder
            onClick={() =>
              document.getElementById("add-new-ingredient")?.click()
            }
          >
            إلغاء
          </Button>
        </div>
      </Form>
    </Formik>
  );
}
