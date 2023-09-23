import { Button, CheckBox, Input, Select, UploadInput } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { Form } from "react-router-dom";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface Props {
  categoryData: any;
  setCategoryData: any;
  gender?: string;
}

const initialValues = {
  lvl: "",
  days_num: "",
  gender: "",
  home: "",
  private: "",
  image: "",
  name: "",
};

export default function ExerciseCategoryForm({
  categoryData,
  setCategoryData,
  gender = "male",
}: Props) {
  const genderTypes = [
    { label: "ذكر", value: "male" },
    { label: "انثي", value: "female" },
  ];

  const levelTypes = [
    { label: "مبتدئ", value: "junior" },
    { label: "متوسط", value: "mid" },
    { label: "متقدم", value: "senior" },
  ];

  const isEditing = categoryData !== null;

  const url = isEditing
    ? `/training-categories/${categoryData?.id}`
    : "/training-categories";

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("add-new-exercise-category")?.click();
    setCategoryData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (isEditing) {
        !isImageDelete && delete values.image;

        values.image.startsWith("https") && delete values.image;

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

      await queryClient.invalidateQueries(
        `/training-categories?lvl=junior&gender=${gender}&days_num=3&home=0`
      );

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
          <UploadInput name="image" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Input name="name" label="الإسم" />

            <Input name="days_num" label="عدد الأيام" />

            <Select options={levelTypes} name="lvl" label="المستوي" />

            <Select options={genderTypes} name="gender" label="النوع" />

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
              {"حفظ"}
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
