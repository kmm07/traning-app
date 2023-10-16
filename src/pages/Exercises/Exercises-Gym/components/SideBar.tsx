import {
  Button,
  Card,
  Img,
  Input,
  Text,
  TextArea,
  TrhButton,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";
import { useState } from "react";

function SideBar() {
  const [isLink, setIsLink] = useState(true);

  return (
    <Formik
      initialValues={{
        image: "",
        note: "",
      }}
      onSubmit={() => {}}
    >
      <Form className="flex flex-col gap-10">
        <div className="flex gap-5 justify-between w-full">
          <div className="flex gap-5 ">
            <Img className="w-24 rounded-2xl" src="/images/Background5.4.png" />
            <div className="flex flex-col ">
              <Text size="3xl">اليوم الاول</Text>
              <Text size="3xl">علوي</Text>
            </div>
          </div>
          <Card className="!w-fit p-6 text-white text-lg">عضلة الصدر</Card>
        </div>
        <Card className="flex  gap-5 p-4">
          <Text size="3xl">الفيديو </Text>
          <hr />
          <div className="flex gap-4 items-center">
            <div className="space-y-4">
              <Button
                onClick={() => setIsLink(true)}
                secondaryBorder={!isLink}
                primary={isLink}
              >
                ادخال رابط
              </Button>
              <Button
                secondaryBorder={isLink}
                primary={!isLink}
                onClick={() => setIsLink(false)}
              >
                رفع من الجهاز
              </Button>
            </div>
            {isLink ? (
              <Input name="video-link" />
            ) : (
              <UploadInput video name="video" />
            )}
          </div>
        </Card>
        <Card className="flex  gap-5 p-4">
          <Text size="3xl">صورة العضلة </Text>
          <hr />
          <UploadInput name="image" />
        </Card>
        <Card className="flex flex-col gap-5 p-4">
          <Text size="3xl">الملاحظة</Text>
          <hr />
          <TextArea name="note" />
        </Card>
        <TrhButton onDelete={() => {}} />
      </Form>
    </Formik>
  );
}

export default SideBar;
