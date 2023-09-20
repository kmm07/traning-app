import { Button, Input, Select, Text, TextArea, UploadInput } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { Form } from "react-router-dom";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useMemo } from "react";

interface Props {
  weekData?: any;
  exerciesCategory: number;
  setWeekData?: any;
  trainingWeeks?: any;
  onClose: () => void;
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
  exerciesCategory,
  trainingWeeks,
  onClose,
}: Props) {
  const isEditing = weekData !== null;

  const url = isEditing ? `/training-weeks/${weekData?.id}` : "/training-weeks";

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (values.week_type === "repeat") {
        await mutateAsync(
          formData({ repeat_id: values.repeat_id?.value }) as any
        );
        helpers.resetForm();

        onClose();

        queryClient.invalidateQueries(
          `/training-weeks?category_id=${exerciesCategory}`
        );
        return;
      }

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

  const repeatedWeaksOptions = useMemo(() => {
    return trainingWeeks?.map((week: any) => ({
      label: week.name,
      value: week.id,
    }));
  }, [trainingWeeks]);

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...weekData,
        week_type: "new",
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm, setFieldValue, values }) => (
        <Form>
          <div className="flex flex-col gap-4">
            <Text as="h1" className="!text-[30px]">
              {!isEditing ? "إضافة" : "تعديل"} اسبوع
            </Text>
            <div className="flex items-center gap-2">
              <label htmlFor="new-week" className="mb-2 text-lg text-white">
                اسبوع جديد
              </label>
              <input
                id="new-week"
                name="week_type"
                type="radio"
                checked={values.week_type === "new"}
                onChange={() => setFieldValue("week_type", "new")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="repeat-week" className="mb-2 text-lg text-white">
                اسبوع مكرر
              </label>
              <input
                id="repeat-week"
                name="week_type"
                type="radio"
                checked={values.week_type === "repeat"}
                onChange={() => setFieldValue("week_type", "repeat")}
              />
            </div>
            {values.week_type === "repeat" && (
              <div className="w-1/2">
                <Select
                  options={repeatedWeaksOptions ?? []}
                  name="repeat_id"
                  isForm={false}
                  value={values.repeat_id}
                  onChange={(e) => setFieldValue("repeat_id", e)}
                />
              </div>
            )}
          </div>

          <div className="!mb-10 flex items-center justify-between"></div>
          {values.week_type === "new" && (
            <>
              <Text as="h1" className="mb-2">
                رفع صورة
              </Text>
              <div className="w-3/4">
                <UploadInput name="image" />
              </div>

              <div className="grid grid-cols-2 gap-4 my-8">
                <Input name="name" label="الإسم" />

                <Input name="week_num" label="رقم الإسبوع" />
              </div>
              <TextArea
                name="target_text"
                placeholder="نص الهدف"
                className="w-full !border-[1px]"
              />
            </>
          )}

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
