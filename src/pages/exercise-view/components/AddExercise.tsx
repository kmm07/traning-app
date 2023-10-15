import { Button, Input, TextArea, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import formData from "util/formData";
import { toast } from "react-toastify";
const initialValues = {
  name: "",
  image: "",
  notes: "",
  muscle_image: "",
  internal_video: "",
  external_video: "",
  video_type: "",
};

interface Props {
  exercise_category_id?: number;
  exerciseData?: any;
}

function AddExercise({ exercise_category_id, exerciseData = null }: Props) {
  const isEditing = exerciseData !== null;

  const url = isEditing ? `/exercises/${exerciseData?.id}` : "/exercises";

  const { mutateAsync } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("add-new-exercise")?.click();
    exerciseData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (values.external_video !== "") {
        delete values.internal_video;
      } else delete values.external_video;

      if (isEditing) {
        typeof values.image === "string" && delete values.image;
        typeof values.muscle_image === "string" && delete values.muscle_image;

        await mutateAsync(
          formData({
            ...values,
            exercise_category_id,
            _method: "PUT",
          }) as any
        );
      } else {
        await mutateAsync(
          formData({
            ...values,
            exercise_category_id,
          }) as any
        );
      }

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${exercise_category_id}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-6">
          <UploadInput name="image" label="صورة التمرين" />

          <UploadInput name="muscle_image" label="صورة العضلة" />

          <Input name="name" label="اسم العضلة" />

          <div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <label htmlFor="internal" className="mb-2">
                  رفع من الجهاز
                </label>
                <input
                  id="internal"
                  name="video_type"
                  type="radio"
                  checked={values.video_type === "internal"}
                  onChange={() => setFieldValue("video_type", "internal")}
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="external" className="mb-2">
                  ادخال رابط
                </label>
                <input
                  id="external"
                  name="video_type"
                  type="radio"
                  checked={values.video_type === "external"}
                  onChange={() => setFieldValue("video_type", "external")}
                />
              </div>
            </div>

            {values?.video_type === "external" ? (
              <Input name="external_video" label={"رابط الفيديو"} />
            ) : (
              <Input
                type={"file" as any}
                name="internal_video"
                accept="video/*"
                isForm={false}
                onChange={(e: any) =>
                  setFieldValue("internal_video", e.target?.files[0])
                }
              />
            )}
          </div>

          <TextArea name="notes" label="ملاحظات" />

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

            <Button className={"!w-20"} primary type="submit" isLoading={false}>
              اضافة
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddExercise;
