import { Button, Card, Img, SubState, Text } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import formData from "util/formData";

const initialValues = {};

function UserSubscriptionsSideBar({ subscriptionData, userData }: any) {
  const { id } = useParams();

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  // subscriptions actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/user-subscriptions/${subscriptionData?.id}`);

      await queryClient.invalidateQueries(`/user-subscriptions?user_id=${id}`);

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const url = `/user-subscriptions/${subscriptionData?.id}`;

  const { mutateAsync: editSubscription, isLoading: isEditLoading } =
    usePostQuery({
      url,
    });

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      await editSubscription(
        formData({
          ...values,
          _method: "PUT",
        }) as any
      );

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${subscriptionData.id}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...subscriptionData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-10">
          <Card className="p-6">
            <div className="flex items-center gap-8">
              <Img src={userData?.src} alt="user image" />
              <div>
                <Text as="h5">{userData.name}</Text>
                <Text as="h5">id:{userData.id}</Text>
              </div>
            </div>
          </Card>

          <Card className="px-10 py-6 flex flex-col gap-8">
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ البداية</Text>
              <Text
                as="h5"
                className="border-[1px] border-primary rounded-md p-2"
              >
                {subscriptionData?.start_date}
              </Text>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ النهاية</Text>
              <Text
                as="h5"
                className="border-[1px] border-primary rounded-md p-2"
              >
                {subscriptionData?.expire_date}
              </Text>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">حالة الإشتراك</Text>
              <SubState state={userData.subscription_status} />
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تم إستهلاكة</Text>
              <Text as="h5"> </Text>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">التفاصيل</Text>
              <Text as="h5"> </Text>
            </div>
          </Card>

          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              onClick={submitForm}
              isLoading={isEditLoading}
            >
              حفظ
            </Button>
            <Button className="w-[100px]" primary onClick={onClose}>
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
        </Form>
      )}
    </Formik>
  );
}

export default UserSubscriptionsSideBar;
