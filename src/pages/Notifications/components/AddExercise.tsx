import { Input, UploadInput } from "components";
import { Form, Formik } from "formik";

function AddExercise() {
  return (
    <Formik
      onSubmit={() => {}}
      initialValues={{
        image: "",
        name: "",
      }}
    >
      <Form className="space-y-8">
        <Input name="name" label="اسم العضلة" />
        <UploadInput name="image" label="رفع صوره" />
      </Form>
    </Formik>
  );
}

export default AddExercise;
