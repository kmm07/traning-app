import { Button, Input, Select } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";

interface Props {
  subscriptionData?: any;
  setSubscriptionData?: any;
}

const initialValues = {
  name: "",
  months: "",
  product_id: "",
  platform: "",
  price: "",
};

const AddNewSubscription = ({
  subscriptionData = null,
  setSubscriptionData,
}: Props) => {
  const isEditing = subscriptionData !== null;

  const url = isEditing
    ? `/subscriptions/${subscriptionData?.id}`
    : "/subscriptions";

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("add-new-subscription")?.click();
    setSubscriptionData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (isEditing) {
        await mutateAsync({
          ...values,
          _method: "PUT",
        });
      } else {
        await mutateAsync({
          ...values,
        });
      }

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries("/subscriptions");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const platformTypes = [
    { label: "Andriod", value: "android" },
    { label: "IOS", value: "ios" },
  ];

  return (
    <Formik
      initialValues={{ ...initialValues, ...subscriptionData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-6">
          <Input name="name" label="الإسم" />

          <Input name="months" label="عدد الشهور" type={"number" as any} />

          <Input name="product_id" label="product_id" />

          <Input name="price" label="سعر الإشتراك" type={"number" as any} />

          <Select name="platform" options={platformTypes} label="المنصة" />

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
};
export default AddNewSubscription;
