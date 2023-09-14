import {
  Button,
  CheckBox,
  Input,
  Select,
  TextArea,
  UploadInput,
} from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { Form } from "react-router-dom";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface Props {
  weekData?: any;
  exerciesCategory: number;
  setWeekData?: any;
}

const initialValues = {
  week_num: "",
  training_category_id: "",
  target_text: "",
  image: "",
  name: "",
};

export default function WeekForm({
  weekData,
  setWeekData,
  exerciesCategory,
}: Props) {
  const isEditing = weekData !== null;

  const url = isEditing ? `/training-weeks/${weekData?.id}` : "/training-weeks";

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("my_modal")?.click();
    setWeekData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (isEditing) {
        !isImageDelete && delete values.image;

        await mutateAsync(
          formData({
            ...values,
            training_category_id: exerciesCategory,
            _method: "PUT",
          }) as any
        );
      } else {
        await mutateAsync(
          formData({
            ...values,
            training_category_id: exerciesCategory,
          }) as any
        );
      }

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries(
        `/training-weeks?category_id=${exerciesCategory}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...weekData,
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form>
          <UploadInput name="image" />
          <div className="grid grid-cols-2 gap-4 my-8">
            <Input name="name" label="الإسم" />

            <Input name="week_num" label="رقم الإسبوع" />
          </div>

          <TextArea name="target_text" label="نص الهدف" className="w-full" />

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
