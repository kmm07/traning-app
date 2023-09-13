import { Button, CheckBox, Input } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { useQueryClient } from "react-query";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";
import * as Yap from "yup";
const initialValues = {
  name: "",
  private: 0,
};

const validationSchema = Yap.object().shape({
  name: Yap.string().required("الاسم مطلوب"),
  private: Yap.string().required("الاسم مطلوب"),
});

function AddIngredientCategories({ values }: { values: any }) {
  const url = values
    ? `/meal-ingredient-categories/${values.id}`
    : "/meal-ingredient-categories";

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const queryClient = useQueryClient();

  async function onSubmit(values: any, helpers: FormikHelpers<any>) {
    try {
      if (values.id) {
        mutateAsync(formData({ ...values, _method: "PUT" }) as any);
      } else {
        mutateAsync(formData(values) as any);
      }
      await queryClient.invalidateQueries("/meal-ingredient-categories");

      helpers.resetForm();
      document.getElementById("add-new-nutrition")?.click();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Formik
      initialValues={{ ...initialValues, ...values }}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={validationSchema}
    >
      <Form className="flex flex-col justify-start gap-8">
        <Input name="name" label="الاسم" isForm />

        <CheckBox name="private" label="خاص" isForm />

        <div className="flex gap-4 ">
          <Button
            className={"!w-20"}
            tertiary
            type="reset"
            htmlFor="add-new-nutrition"
            secondary
            onClick={() => document.getElementById("my-drawer")?.click()}
          >
            الغاء
          </Button>

          <Button
            className={"!w-20"}
            primary
            type="submit"
            isLoading={isLoading}
          >
            اضافة
          </Button>
        </div>
      </Form>
    </Formik>
  );
}

export default AddIngredientCategories;
