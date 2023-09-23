import { Button, Select } from "components";
import DateInput from "components/dateInput";
import { Formik, FormikHelpers } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import moment from "moment";
import { UseQueryResult, useQueryClient } from "react-query";
import { Form, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Props {
  subscriptionData?: any;
  setSubscriptionData?: any;
}

const initialValues = {
  start_date: moment().locale("en").format("YYYY-MM-DD"),
  expire_date: moment().locale("en").format("YYYY-MM-DD"),
  subscription_id: "",
};

export default function AddUserSubscription({
  subscriptionData = null,
  setSubscriptionData,
}: Props) {
  const { id } = useParams();

  // get subscriptions list ==========================>

  const subscriptionsListURL = "/subscriptions";

  const { data: subscriptions = [] }: UseQueryResult<any> = useGetQuery(
    subscriptionsListURL,
    subscriptionsListURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({
          label: item?.name,
          value: item?.id,
        })),
    }
  );

  const isEditing = subscriptionData !== null;

  const url = isEditing
    ? `/user-subscriptions/${subscriptionData?.id}`
    : "/user-subscriptions";

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
  });

  const onClose = () => {
    document.getElementById("add-user-subscription")?.click();
    setSubscriptionData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    const start_date = moment(new Date(values.start_date)).format("YYYY/MM/DD");

    const expire_date = moment(new Date(values.expire_date)).format(
      "YYYY/MM/DD"
    );

    try {
      if (isEditing) {
        await mutateAsync({
          ...values,
          user_id: id,
          start_date,
          expire_date,
          _method: "PUT",
        });
      } else {
        await mutateAsync({
          ...values,
          user_id: id,
          start_date,
          expire_date,
        });
      }

      await queryClient.invalidateQueries(`/user-subscriptions?user_id=${id}`);

      helpers.resetForm();

      onClose();
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
        <Form className="flex flex-col gap-6">
          <DateInput type="date" name="start_date" label="تاريخ البدء" />

          <DateInput type="date" name="expire_date" label="تاريخ الإنتهاء" />

          <Select
            name="subscription_id"
            options={subscriptions ?? []}
            label="نوع الإشتراك"
            // isForm={false}
            // onChange={(e) => setFieldValue("subscription_id", e)}
            // value={values.subscription_id}
          />

          <div className="flex gap-4 ">
            <Button
              className={"!w-20"}
              tertiary
              type="reset"
              htmlFor="add-new-nutrition"
              secondary
              onClick={onClose}
            >
              الغاء
            </Button>

            <Button
              className={"!w-20"}
              primary
              onClick={submitForm}
              isLoading={isAddLoading}
            >
              حفظ
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
