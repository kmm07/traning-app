import { Button, Input } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";

interface Props {
  adminsData?: any;
  setAdminsData?: any;
}

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const AddAdmin = ({ adminsData = null, setAdminsData }: Props) => {
  const isEditing = adminsData !== null;

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
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...adminsData }}
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
