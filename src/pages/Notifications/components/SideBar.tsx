import {
  Card,
  Img,
  Input,
  Text,
  TextArea,
  TrhButton,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";

function SideBar() {
  return (
    <Formik
      initialValues={{
        image: "",
        desc: "",
        details: "",
      }}
      onSubmit={() => {}}
    >
      <Form className="flex flex-col gap-5">
        <div className="flex gap-3 justify-between w-full">
          <div className="flex gap-3 ">
            <Img className="w-24 rounded-2xl" src="/images/Background5.4.png" />
            <div className="flex flex-col ">
              <Text size="xl">عنوان</Text>
            </div>
          </div>
        </div>

        <Card className="flex  gap-3 p-4">
          <Text size="xl">صورة </Text>
          <hr />
          <UploadInput name="image" />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <Text size="xl">الوصف</Text>
          <hr />
          <TextArea name="desc" />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <Text size="xl">التفاصيل</Text>
          <hr />
          <TextArea name="details" />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <Text size="xl">رابط</Text>
          <hr />
          <Input name="link" />
        </Card>
        <TrhButton onDelete={() => {}} />
      </Form>
    </Formik>
  );
}

export default SideBar;
