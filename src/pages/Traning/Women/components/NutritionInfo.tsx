import {
  Card,
  Input,
  Modal,
  RadialProgress,
  Select,
  Text,
  UploadImg,
} from "components";
import { Form, Formik } from "formik";

function NutritionInfo() {
  const radial = [
    {
      percentage: 100,
      body_title: "البروتين",
      body_number: "13",
      className: "text-[#FFC300]",
    },
    {
      percentage: 10,
      body_title: "الدهون",
      body_number: "44",
      className: "text-[#00E8A2]",
    },
    {
      percentage: 30,
      body_title: "السعرات",
      body_number: "99",
      className: "text-[#E80054]",
    },
    {
      percentage: 55,
      body_title: "الكارب",
      body_number: "99",
      className: "text-[#00D4FF]",
    },
  ];
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
            label={<img src="/images/plus.svg" alt="plus" />}
            onSave={() => {}}
          >
            <NutritionModal />
          </Modal>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {radial.map((item, index) => (
          <RadialProgress
            key={index}
            percentage={item.percentage}
            label={item.body_number}
            className={item.className}
            body={
              <div className="flex flex-col gap-2 justify-center items-center">
                <Text>{item.body_title}</Text>
                <Text>{item.body_number}</Text>
              </div>
            }
          />
        ))}
      </div>
    </Card>
  );
}

function Food({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <Card className="flex gap-2 items-center !w-fit p-2 px-4">
      <Text>{label}</Text>
      <img
        className="h-5"
        src={isActive ? "/images/img_checkmark.svg" : "/images/img_clock5.png"}
        alt={label}
      />
    </Card>
  );
}

function NutritionModal() {
  return (
    <Formik
      initialValues={{
        image: "",
      }}
      onSubmit={() => {}}
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
