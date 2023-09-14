import {
  Card,
  Input,
  Modal,
  RadialProgress,
  Select,
  Text,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";

function NutritionInfo({ activeUser }: { activeUser: any }) {
  const percentageCalc = (all, current) =>
    all === 0 && current === 0 ? 0 : Number((current / all) * 100).toFixed(1);

  const radial = [
    {
      body_title: "البروتين",
      percentage: percentageCalc(
        activeUser?.protein?.all,
        activeUser?.protein?.current
      ),
      body_number: Number(activeUser?.protein?.current).toFixed(2).toString(),
      className: "text-[#FFC300]",
    },
    {
      body_title: "الدهون",
      percentage: percentageCalc(
        activeUser?.fat?.all,
        activeUser?.fat?.current
      ),
      body_number: Number(activeUser?.fat?.current).toFixed(2).toString(),
      className: "text-[#00E8A2]",
    },
    {
      body_title: "السعرات",
      percentage: percentageCalc(
        activeUser?.calories?.all,
        activeUser?.calories?.current
      ),
      body_number: Number(activeUser?.calories?.current).toFixed(2).toString(),
      className: "text-[#E80054]",
    },
    {
      body_title: "الكارب",
      percentage: percentageCalc(
        activeUser?.carbs?.all,
        activeUser?.carbs?.current
      ),
      body_number: Number(activeUser?.carbs?.current).toFixed(2).toString(),
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
            percentage={item?.percentage}
            label={item?.body_number}
            className={item.className}
            body={
              <div className="flex flex-col gap-2 justify-center items-center">
                <Text>{item?.body_title}</Text>
                <Text>{item?.body_number}</Text>
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
        <UploadInput name="image" />
        <Input name="title" label="عنوان" />
        <Input name="url" label="ارفاق رابط" />
      </Form>
    </Formik>
  );
}

export default NutritionInfo;
