import { Button, Input, Select, Text, TextArea } from "components";
import { Form, Formik } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const initialValues = {
  target: "all",
  user_ids: [],
  title: "",
  body: "",
  full_message: "",
  action: "none",
  action_label: "",
  priority: 50,
  valid_days: "",
};

const targetOptions = [
  { label: "كل المشتركين", value: "all" },
  { label: "مستخدمون محددون", value: "users" },
];

// نفس الأكشنات الثلاثة المجمّدة في عقد التطبيق — لا تضف غيرها
const actionOptions = [
  { label: "بدون زر", value: "none" },
  { label: "عرض رسالة (دايلوج بالنص الكامل)", value: "show_message" },
  { label: "فتح شاشة تحديث الوزن", value: "update_weight" },
];

function AddSystemNotice() {
  // المستخدمون للاختيار عند الإرسال لمجموعة =================>
  const usersURL = "/users";

  const { data: users, isLoading: isUsersLoading }: UseQueryResult<any> =
    useGetQuery(usersURL, usersURL, {
      select: ({ data }: { data: { data: { users: [] } } }) =>
        data.data.users?.map((user: any) => ({
          label: user.name,
          value: user.id,
        })),
    });

  const queryClient = useQueryClient();

  const url = "/user-notices";

  const { mutateAsync, isLoading } = usePostQuery({ url });

  const onSubmit = async (values: any, Helpers: any) => {
    if (values.target === "users" && values.user_ids.length === 0) {
      toast.error("اختر مستخدمًا واحدًا على الأقل");
      return;
    }

    if (values.action === "show_message" && !values.full_message.trim()) {
      toast.error("النص الكامل مطلوب مع زر عرض الرسالة");
      return;
    }

    const payload: any = {
      target: values.target,
      title: values.title,
      body: values.body,
      action: values.action,
      priority: Number(values.priority) || 50,
    };

    if (values.target === "users") payload.user_ids = values.user_ids;
    if (values.full_message.trim()) payload.full_message = values.full_message;
    if (values.action_label.trim()) payload.action_label = values.action_label;
    if (values.valid_days) payload.valid_days = Number(values.valid_days);

    try {
      await mutateAsync(payload);

      Helpers.resetForm();

      await queryClient.invalidateQueries(url);

      document.getElementById("add-system-notice")?.click();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "حدث خطأ ما");
    }
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize
    >
      {({ values, setFieldValue, submitForm, resetForm }) => (
        <Form className="space-y-8">
          <Select
            name="target"
            options={targetOptions}
            isForm={false}
            label="المستلمون"
            value={targetOptions.filter((opt) => opt.value === values.target)}
            onChange={(opt: any) => setFieldValue("target", opt?.value ?? "all")}
          />

          {values.target === "users" && (
            <Select
              name="user_ids"
              options={users ?? []}
              isLoading={isUsersLoading}
              isForm={false}
              isMulti
              label="المستخدمين"
              onChange={(val: any) =>
                setFieldValue(
                  "user_ids",
                  val.map((user: any) => user.value)
                )
              }
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input name="title" label="العنوان" />

            <Input name="body" label="نص الشريط (سطر قصير)" />
          </div>

          <Select
            name="action"
            options={actionOptions}
            isForm={false}
            label="زر الرسالة"
            value={actionOptions.filter((opt) => opt.value === values.action)}
            onChange={(opt: any) => setFieldValue("action", opt?.value ?? "none")}
          />

          {values.action === "show_message" && (
            <TextArea
              name="full_message"
              label="النص الكامل (يظهر في الدايلوج عند الضغط)"
              className="font-bold !w-full border-[1px] border-primary-100"
            />
          )}

          {values.action !== "none" && (
            <Input
              name="action_label"
              label="نص الزر (اختياري — الافتراضي: عرض / تحديث)"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input name="priority" label="الأولوية" />
              <Text size="sm" className="mt-1 opacity-70">
                50 عادية — 101 فأعلى تتصدّر فوق رسالة المدرب
              </Text>
            </div>

            <div>
              <Input name="valid_days" label="الصلاحية بالأيام" />
              <Text size="sm" className="mt-1 opacity-70">
                فارغة = تبقى حتى يشاهدها المستخدم
              </Text>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              className="w-[100px]"
              primary
              isLoading={isLoading}
              onClick={submitForm}
            >
              إرسال
            </Button>
            <Button
              className="w-[100px]"
              secondaryBorder
              onClick={() => {
                resetForm();
                document.getElementById("add-system-notice")?.click();
              }}
            >
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddSystemNotice;
