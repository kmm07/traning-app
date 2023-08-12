import { Card, Input, Modal, Select, Text, UploadImg } from "components";
import { Form, Formik } from "formik";

function NutritionInfo() {
  return (
    <Card className="grid grid-cols-2 gap-10 p-4">
      <div className="space-y-4">
        <Text size="2xl">الملعومات الغذائية</Text>
        <Select
          isForm={false}
          options={[]}
          label="الجدول الغذائي"
          placeholder="الجدول الغذائي"
        />
        <div className="flex">
          <div>
            <Food label="الفطور" isActive={true} />
          </div>
          <Modal
            id="user_modal_add_food"
            label={<img src="images/plus.svg" alt="plus" />}
            onSave={() => {}}
          >
            <NutritionModal />
          </Modal>
        </div>
      </div>
      <div>s</div>
    </Card>
  );
}

function Food({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <Card className="flex gap-2 items-center !w-fit p-2 px-4">
      <Text>{label}</Text>
      <img
        className="h-5"
        src={isActive ? "images/img_checkmark.svg" : "images/img_clock5.png"}
        alt={label}
      />
    </Card>
  );
}

function NutritionModal({}) {
  return (
    <Formik
      initialValues={{
        image: "",
      }}
    >
      <Form className="space-y-4">
        <div>
          <Text size="2xl">اشعار مخصص</Text>
        </div>
        <UploadImg name="image" />
        <Input name="title" label="عنوان" />
        <Input name="url" label="ارفاق رابط" />
      </Form>
    </Formik>
  );
}

export default NutritionInfo;
