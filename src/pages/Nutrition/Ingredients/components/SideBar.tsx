import { Button, Card, Input, Text, UploadInput } from "components";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import formData from "util/formData";
import { useState } from "react";
import DeleteIngredientDecision, {
  InUsePayload,
} from "./DeleteIngredientDecision";
import { apiErrorMessage } from "util/apiError";
import { useConfirm } from "components/ConfirmDialog/context";
interface SideBarProps {
  ingredientData: any;
  categoryId: number;
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
};

function SideBar({ ingredientData = [], categoryId }: SideBarProps) {
  const confirm = useConfirm();
  // ingredients actions =====================>
  const queryClient = useQueryClient();

  // ⚠️ التوست العامّ مُطفأ هنا وحده: 422 `ingredient_in_use` يُعالَج بحوار
  // قرارٍ أغنى، وتوستُ «فشل» فوقه يناقض شاشةً تعرض مخرجاً.
  const { mutateAsync, isLoading } = useDeleteQuery({
    suppressErrorToast: true,
  });

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  // 🔴 الحذف صار **قراراً لا فعلاً واحداً**: الخادم يردّ 422 `ingredient_in_use`
  // على مكوّنٍ تستعمله وصفات، ومعه عددُها وقائمتُها. فتُلتقط الحمولة ويُعرض
  // حوارُ القرار بدل توست خطأٍ لا مخرج منه.
  const [inUse, setInUse] = useState<InUsePayload | null>(null);

  const removeIngredient = async (body?: Record<string, unknown>) => {
    try {
      await mutateAsync(
        body
          ? { url: `/meal-ingredients/${ingredientData.id}`, data: body }
          : `/meal-ingredients/${ingredientData.id}`
      );

      await queryClient.invalidateQueries(
        `/meal-ingredients?meal_ingredient_category_id=${categoryId}`
      );

      setInUse(null);
      onClose();
    } catch (error: any) {
      const data = error?.response?.data;

      if (data?.error_code === "ingredient_in_use") {
        setInUse({
          usage_count: data.usage_count,
          recipes: data.recipes ?? [],
        });

        return;
      }

      // `invalid_replacement` وغيرُه يُعرضان برسالة الخادم — وهي عربيةٌ جاهزة.
      toast.error(data?.message ?? "تعذّر الحذف");
    }
  };

  const onDeleteItem = async () => {
    if (
      !(await confirm({
        title: "حذف المكوّن؟",
        message:
          "إن كانت تستعمله وصفاتٌ فسيعرض الخادم خياراتِ الاستبدال بدل الحذف.",
      }))
    ) {
      return;
    }

    await removeIngredient();
  };


  const isEditing = ingredientData !== null;

  const url = isEditing
    ? `/meal-ingredients/${ingredientData.id}`
    : "meal-ingredients";


  const { mutateAsync: addIngredient, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });


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
        `/meal-ingredients?meal_ingredient_category_id=${categoryId}`
      );

      onClose();

      helpers.resetForm();
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
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
        {inUse && ingredientData && (
          <DeleteIngredientDecision
            name={ingredientData.name}
            id={ingredientData.id}
            payload={inUse}
            isLoading={isLoading}
            onCancel={() => setInUse(null)}
            onReplace={(replacementId) =>
              void removeIngredient({ replace_with_id: replacementId })
            }
            onForce={() => void removeIngredient({ force: true })}
          />
        )}

        <div className="flex justify-between">
          <div className="flex gap-4">
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
