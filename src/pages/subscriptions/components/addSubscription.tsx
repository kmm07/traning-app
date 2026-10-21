import { Button, Input, Select } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import usePermissions from "hooks/usePermissions";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

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
  coach_id: "" as number | string,
};

const AddNewSubscription = ({
  subscriptionData = null,
  setSubscriptionData,
}: Props) => {
  const isEditing = subscriptionData !== null;

  const url = isEditing
    ? `/subscriptions/${subscriptionData?.id}`
    : "/subscriptions";

  /*
   * [اشتراكات المدرّبين] صاحبُ الباقة.
   *
   * 🔴 **الخادم يكتب `coach_id` من الطلب في كل حفظ — وغيابُه يعني «المنصّة»**
   *    ⇒ نموذجٌ لا يرسله كان **ينقل باقة المدرّب إلى خالد بصمت** عند أيّ
   *    تعديلٍ لسعرها. ولذلك يُرسل الحقل **دائماً** بقيمة الصفّ القائمة، حتى
   *    لمن لا يملك قسم «المدربون» فلا يرى المحدِّد.
   *
   * ⚖️ ومدرّبُ المنصّة يُرسل بمعرّفه، والخادم يخزّنه `NULL` — المعنى الواحد
   *    لخالد في كل جدول.
   */
  const { can } = usePermissions();
  const { data: coachesData }: any = useGetQuery("/coaches", "/coaches", {
    select: ({ data }: any) => data.data,
    enabled: can("coaches"),
  });
  const coaches: any[] = coachesData ?? [];
  const house = coaches.find((c: any) => c.is_house);
  const coachOptions = coaches.map((c: any) => ({
    label: c.is_house ? `${c.name} (المنصة)` : c.name,
    value: c.id,
  }));

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
      const body = { ...values, coach_id: values.coach_id ?? "" };
      if (isEditing) {
        await mutateAsync({
          ...body,
          _method: "PUT",
        });
      } else {
        await mutateAsync(body);
      }

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries("/subscriptions");
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  const platformTypes = [
    { label: "Andriod", value: "android" },
    { label: "IOS", value: "ios" },
  ];

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...subscriptionData,
        coach_id: subscriptionData?.coach_id ?? house?.id ?? "",
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-6">
          <Input name="name" label="الإسم" />

          <Input name="months" label="عدد الشهور" type={"number" as any} />

          <Input name="product_id" label="المنتج" />

          <Input name="price" label="سعر الإشتراك" type={"number" as any} />

          <Select name="platform" options={platformTypes} label="المنصة" />

          {can("coaches") && coachOptions.length > 0 && (
            <Select name="coach_id" options={coachOptions} label="المدرب" />
          )}

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
