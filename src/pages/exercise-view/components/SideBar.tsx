import { Button, Card, Input, Text, TextArea, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import formData from "util/formData";

const initialValues = {
  name: "",
  image: "",
  notes: "",
  muscle_image: "",
  internal_video: "",
  external_video: "",
  video_type: "",
};

function SideBar({ exerciseData, categoryData }: any) {
  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  // exercises actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/exercises/${exerciseData.id}`);

      await queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${categoryData.id}`
      );

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const url = `/exercises/${exerciseData?.id}`;

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const { mutateAsync: editExercise, isLoading: isEditLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      if (values.external_video !== "") {
        delete values.internal_video;
      } else delete values.external_video;

      values.muscle_image === "" && delete values.muscle_image;

      values.image === "" && delete values.image;

      !isImageDelete && delete values.muscle_image;

      delete values.video_type;

      await editExercise(
        formData({
          ...values,
          exercise_category_id: categoryData.id,
          _method: "PUT",
        }) as any
      );

      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${categoryData.id}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  console.log("exerciseData >>>> ", exerciseData);
  return (
    <Formik
      initialValues={{ ...initialValues, ...exerciseData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form className="flex flex-col gap-10">
          <div className="flex gap-5 justify-between w-full">
            <div className="flex gap-5 ">
              <UploadInput name="image" className="w-24 rounded-2xl" />

              <div className="flex flex-col ">
                <Input name="name" label={"صورة التمرين"} />
              </div>
            </div>
            <Card className="!w-fit p-6 text-white text-lg">
              {categoryData?.name}
            </Card>
          </div>
          <Card className="flex  gap-5 p-4">
            <Text size="3xl">الفيديو </Text>
            <hr />
            <div className="flex gap-4 items-center">
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
            </div>
          </Card>
          <Card className="flex  gap-5 p-4">
            <Text size="3xl">صورة العضلة </Text>
            <hr />
            <UploadInput name="muscle_image" />
          </Card>
          <Card className="flex flex-col gap-5 p-4">
            <Text size="3xl">الملاحظة</Text>
            <hr />
            <TextArea name="notes" />
          </Card>
          <div className="flex justify-center">
            <a
              href={values.external_video ?? values.internal_video}
              target="_blank"
              className="p-4 bg-primary text-white rounded-lg"
            >
              تشغيل الفيديو
            </a>
          </div>
          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              onClick={submitForm}
              isLoading={isEditLoading}
            >
              تعديل
            </Button>
            <Button className="w-[100px]" primary onClick={onClose}>
              إلغاء
            </Button>
            <Button
              className="w-[100px]"
              danger
              onClick={onDeleteItem}
              isLoading={isLoading}
            >
              حذف
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
