import { Button, CheckBox, Input, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";
import * as Yap from "yup";
const initialValues = {
  name: "",
  private: 0,
  image: "",
};

const validationSchema = Yap.object().shape({
  image: Yap.string().required("الصورة مطلوبة"),
  name: Yap.string().required("الاسم مطلوب"),
});

function AddDietCategories({ values }: { values: any }) {
  const url = values ? `diet-categories/${values.id}` : "diet-categories";
  const isImageDelete = useAppSelector(selectIsImageDelete);
  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  function onSubmit(values: any, helpers: FormikHelpers<any>) {
    try {
      if (values.id) {
        !isImageDelete && delete values.image;
        mutateAsync(formData({ ...values, _method: "PUT" }) as any);
      } else {
        mutateAsync(formData(values) as any);
      }
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
        <UploadInput name="image" label="الصورة" />
        <Input name="name" label="الاسم" />
        <CheckBox name="private" label="خاص" />
        <div className="flex gap-4 ">
          <Button
            className={"!w-20"}
            tertiary
            type="reset"
            htmlFor="add-new-nutrition"
            secondary
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

export default AddDietCategories;
