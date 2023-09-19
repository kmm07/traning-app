import UsersInfo from "shared/UserInfo";
import NutritionInfo from "./NutritionInfo";
import HeathInfo from "./HeathInfo";
import TrainingInfo from "./TrainingInfo";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import { Button } from "components";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";

const initialValues = {
  points: "",
  weight: "",
  height: "",
  age: "",
  weekly_activity: "",
  target_weight: "",
  diet_category_id: "",
  protein: "",
  fat: "",
  calories: "",
  carbohydrates: "",
};

function UsersSideBar({ activeUser }: { activeUser: any }) {
  const getTargetText = (target: string) => {
    return target === "decrease"
      ? "إنقاص الوزن"
      : target === "increase"
      ? "زيادة الوزن"
      : "الحفاظ عي الوزن";
  };

  const onClose = () => document.getElementById("my-drawer")?.click();

  const url = `users/${activeUser?.id}`;

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const queryClient = useQueryClient();

  const onEditUser = async (values: any) => {
    delete values.training_week_days;

    delete values.chat;

    delete values.meals;

    const formData = new FormData();

    const formattedData = Object.entries(values);

    formattedData.forEach((item: any) => {
      if (item[0] === "rest_days") {
        (item[1] as any)?.forEach((day: any) =>
          formData.append("rest_days[]", day as any)
        );
        return;
      }
      if (item[0] === "target") {
        formData.append("target", item[1]?.value);
        return;
      }

      formData.append(item[0], item[1] as any);
    });

    formData.append("_method", "PUT");

    try {
      await mutateAsync(formData as any);

      await queryClient.invalidateQueries("/users");

      // helpers.resetForm();

      onClose();
    } catch (error: any) {}
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...activeUser,
        target: {
          label: getTargetText(activeUser?.target),
          value: activeUser?.target,
        },
        carbohydrates: activeUser?.carbs?.all,
        protein: activeUser?.protein?.all,
        fat: activeUser?.fat?.all,
        calories: activeUser?.calories?.all,
        type: activeUser?.gender,
        training_category_id: activeUser?.category_id,
        weekly_training: activeUser?.training_days,
        training_week_days: activeUser?.training_week_days,
      }}
      onSubmit={onEditUser}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form>
          <UsersInfo showUserInfo={false} activeUser={activeUser} />

          <HeathInfo />

          <NutritionInfo activeUser={activeUser} />

          <TrainingInfo />

          <div className="flex items-center justify-evenly mt-6">
            <Button
              primary
              className="w-[120px]"
              onClick={submitForm}
              isLoading={isLoading}
            >
              حفظ
            </Button>
            <Button danger onClick={onClose} className="w-[120px]">
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UsersSideBar;
