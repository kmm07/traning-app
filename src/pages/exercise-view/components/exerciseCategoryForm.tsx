import { Button, CheckBox, Input } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { Form } from "react-router-dom";
import formData from "util/formData";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface Props {
  categoryData: any;
  setCategoryData: any;
  gender?: string;
}

const initialValues = {
  home: "",
  private: "",
  name: "",
};

export default function ExerciseCategoryForm({
  categoryData,
  setCategoryData,
}: Props) {
  console.log(categoryData);

  const isEditing = ![null, undefined].includes(categoryData);

  const url = isEditing
    ? `/exercise-categories/${categoryData?.id}`
    : "/exercise-categories";

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("new-exercise-category")?.click();
    setCategoryData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (isEditing) {
        await mutateAsync(
          formData({
            ...values,
            home: values.home ? 1 : 0,
            private: values.ptivate ? 1 : 0,
            _method: "PUT",
          }) as any
        );
      } else {
        await mutateAsync(
          formData({
            ...values,
            home: values.home ? 1 : 0,
            private: values.ptivate ? 1 : 0,
          }) as any
        );
      }

      await queryClient.invalidateQueries("/exercise-categories");

      helpers.resetForm();

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...categoryData,
        home: categoryData?.home === 1 ? true : false,
        private: categoryData?.private === 1 ? true : false,
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form>
          <Input name="name" label="الإسم" />
          <div className="my-8 flex items-center justify-center gap-8">
            <CheckBox name="home" label="منزلي" />

            <CheckBox name="private" label="خاص" />
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              className="w-[100px]"
              primary
              isLoading={isAddLoading}
              onClick={submitForm}
            >
              {isEditing ? "تعديل" : "حفظ"}
            </Button>
            <Button className="w-[100px]" secondaryBorder onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
