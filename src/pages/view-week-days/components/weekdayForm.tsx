import { Form, Formik } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddWeekDayExercise from "./add-day-exercise";
const initialValues = {
  name: "",
  day_num: "",
  exercise_category_id: "",
  target_text: "",
  image: "",
  exercises: [],
};

export default function WeekDayForm() {
  const { id } = useParams();

  // on submit weekday data ======================>
  const url = "/training-week-days";
  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    const formattedData = Object.entries(values);

    formattedData.forEach((data) => {
      if (data[0] !== "exercises") {
        formData.append(data[0], data[1] as any);
      }

      if (data[0] === "exercises") {
        (data[1] as any).forEach((subData: any, i: number) => {
          Object.entries(subData).forEach((item: any) => {
            if (item[0] !== "sessions") {
              formData.append(
                `exercises[${i}][${item[0]}]`,
                item[0] === "exercise_id"
                  ? item[1]?.value
                  : item[0] === "private"
                  ? item[1]
                    ? 1
                    : 0
                  : item[1]
              );
            } else {
              item[1].forEach((item: any, sessionIndex: number) =>
                Object.entries(item).forEach((session: any) => {
                  formData.append(
                    `exercises[${i}][sessions][${sessionIndex}][${session[0]}]`,
                    session[1] as any
                  );
                })
              );
            }
          });
        });
      }
    });

    formData.append("training_week_id", id as any);

    try {
      await mutateAsync(formData as any);

      Helpers.resetForm();

      queryClient.invalidateQueries(
        `/training-week-days?training_week_id=${id}`
      );

      document.getElementById("add-week-day")?.click();
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ submitForm }: any) => (
        <Form>
          <AddWeekDayExercise
            isLoading={isLoading}
            onAddExercise={submitForm}
            categories={[]}
          />
        </Form>
      )}
    </Formik>
  );
}
