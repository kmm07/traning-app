import { Button, Input, Select, UploadInput } from "components";
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
  image: "",
  meal_ingredient_category_id: "",
};

export default function EditIngredient({
  values,
  categoryId,
  categories,
}: {
  values?: any;
  categoryId?: number;
  categories?: any;
}) {
  const isEditing = values !== null;

  const url = isEditing ? `/meal-ingredients/${values.id}` : "meal-ingredients";

  const { mutateAsync: addIngredient, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const { mutateAsync: editIngredient, isLoading: isEditLoading } = usePutQuery(
    { url, contentType: "multipart/form-data" }
  );

  const onClose = () => {
    if (isEditing) {
      document.getElementById("add-new-ingredient")?.click();

      document.getElementById("my-drawer")?.click();
    } else {
      document.getElementById("my_modal")?.click();
    }
  };

  const onSubmit = async (values: any, helpers: any) => {
    try {
      if (isEditing) {
        await editIngredient({
          ...values,
          meal_ingredient_category_id: categoryId,
          _method: "PUT",
        });
      } else await addIngredient(values);

      onClose();

      // helpers.resetForm();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const formmatedCategories = categories?.map((category: any) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <Formik
      initialValues={{ ...initialValues, ...values }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form>
        {!isEditing && <UploadInput name="image" className="mb-8" />}
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
          {!isEditing && (
            <Select
              options={formmatedCategories ?? []}
              label="فئة المكون"
              name="meal_ingredient_category_id"
              isForm
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-4 mt-8">
          <Button
            className="w-[100px]"
            primary
            type="submit"
            isLoading={isAddLoading || isEditLoading}
          >
            {isEditing ? "تعديل" : "حفظ"}
          </Button>
          <Button className="w-[100px]" secondaryBorder onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </Form>
    </Formik>
  );
}
