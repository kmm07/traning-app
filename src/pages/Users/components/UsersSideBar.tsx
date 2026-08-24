import UsersInfo from "shared/UserInfo";
import NutritionInfo from "./NutritionInfo";
import HeathInfo from "./HeathInfo";
import TrainingInfo from "./TrainingInfo";
import { Formik } from "formik";
import { Form, useNavigate } from "react-router-dom";
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
  has_change_into_calories: 0,
};

function UsersSideBar({
  activeUser,
  onOpenChat: onOpenChatInPlace,
}: {
  activeUser: any;
  /**
   * فتحُ المحادثة **في مكانها** (تبويبٌ في الدرج نفسه) — يمرّره
   * [`UserDrawerTabs`](src/shared/UserDrawerTabs.tsx).
   *
   * وبلاه يبقى السلوك القديم: انتقالٌ إلى `/dashboard`.
   */
  onOpenChat?: () => void;
}) {
  const navigate = useNavigate();

  // تخصيص الخطة: صفحة كاملة لتحرير تغذية وتدريب هذا المستخدم
  const onOpenPlan = () => {
    document.getElementById("my-drawer")?.click();
    navigate(`/users/${activeUser?.id}/plan`);
  };

  const onOpenChat = () => {
    if (onOpenChatInPlace) {
      onOpenChatInPlace();
      return;
    }

    // مسارُ التوافق — والمفتاح يقرؤه الآن `pages/Messages` فيفتح المحادثة.
    localStorage.setItem("open_chat_user_id", String(activeUser?.id));
    document.getElementById("my-drawer")?.click();
    navigate("/dashboard");
  };

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

      if (item[0] === "training_category_id") {
        formData.append("training_category_id", item[1]?.value);
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
    } catch (error: any) {
      console.log(error);
    }
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
        training_category_id: {
          label: activeUser?.category_name,
          value: activeUser?.category_id,
        },
        weekly_training: activeUser?.training_days,
        training_week_days: activeUser?.training_week_days,
      }}
      onSubmit={onEditUser}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form>
          <UsersInfo showUserInfo={false} activeUser={activeUser} />

          <div className="flex gap-3 mt-4">
            <Button primary size="small" onClick={onOpenPlan}>
              تخصيص الخطة (تغذية وتدريب)
            </Button>
            <Button secondaryBorder size="small" onClick={onOpenChat}>
              محادثة المستخدم
            </Button>
          </div>

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
