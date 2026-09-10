import { Button, Input } from "components";
import { Field } from "formik";
import usePermissions from "hooks/usePermissions";
import { Form, Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

interface Props {
  adminsData?: any;
  setAdminsData?: any;
}

const initialValues = {
  name: "",
  email: "",
  password: "",
  permissions: [] as string[],
  is_super: false,
};

const AddAdmin = ({ adminsData = null, setAdminsData }: Props) => {
  const isEditing = adminsData !== null;

  // خريطةُ الأقسام تأتي من الخادم (سجلّ `AdminSections`) — فلا تُكتب
  // التسميات العربية مرّتين ولا يتباعد الطرفان (نمط BUG-15/61). ومنحُ
  // الصلاحيات للمدير الأعلى وحده، فيُخفى المحرّر عن غيره.
  const { sections, isSuper } = usePermissions();

  const url = isEditing ? `/admins/${adminsData?.id}` : "/admins";

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("add-new-admins")?.click();
    setAdminsData(null);
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

      queryClient.invalidateQueries("/admins");
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...adminsData,
        // الخادم يردّ `null` لمن لا أقسام له، و`Field` المصفوفيّ يسقط عليها.
        permissions: adminsData?.permissions ?? [],
        is_super: Boolean(adminsData?.is_super),
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-6">
          <Input name="name" label="الإسم" />

          <Input name="email" label="البريد الالكتروني" />
          <Input
            dir="ltr"
            type="password"
            name="password"
            label="كلمّة المرور"
          />

          {isSuper && (
            <div className="flex flex-col gap-3 border-t border-blue_gray-900_01 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Field type="checkbox" name="is_super" className="w-4 h-4" />
                <span className="text-white text-sm font-bold">
                  مدير أعلى — كل الصلاحيات، ويمنحها لغيره
                </span>
              </label>

              <p className="text-xs text-gray-400">
                الأقسام المسموحة (تُتجاهَل للمدير الأعلى — يملكها كلها):
              </p>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(sections).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Field
                      type="checkbox"
                      name="permissions"
                      value={key}
                      className="w-4 h-4"
                    />
                    <span className="text-white text-sm">{label as string}</span>
                  </label>
                ))}
              </div>
            </div>
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
export default AddAdmin;
