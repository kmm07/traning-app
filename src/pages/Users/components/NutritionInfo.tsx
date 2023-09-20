import {
  Card,
  RadialProgress,
  Select,
  Text,
} from "components";
import {  useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

function NutritionInfo({ activeUser }: { activeUser: any }) {
  const { values } = useFormikContext<any>();

  const percentageCalc = (all: any, current: any) =>
    all === 0 && current === 0 ? 0 : Number((current / all) * 100).toFixed(1);

  const radial = [
    {
      name: "protein",
      body_title: "البروتين",
      percentage: percentageCalc(values?.protein, activeUser?.protein?.current),
      cardTitle: values?.protein,
      body_number: Number(activeUser?.protein?.current).toFixed(2).toString(),
      className: "text-[#FFC300]",
    },
    {
      name: "fat",
      body_title: "الدهون",
      percentage: percentageCalc(values?.fat, activeUser?.fat?.current),
      cardTitle: values?.fat,
      body_number: Number(activeUser?.fat?.current).toFixed(2).toString(),
      className: "text-[#00E8A2]",
    },
    {
      name: "calories",
      body_title: "السعرات",
      percentage: percentageCalc(
        values?.calories,
        activeUser?.calories?.current
      ),
      cardTitle: values?.calories,
      body_number: Number(activeUser?.calories?.current).toFixed(2).toString(),
      className: "text-[#E80054]",
    },
    {
      name: "carbohydrates",
      body_title: "الكارب",
      percentage: percentageCalc(
        values?.carbohydrates,
        activeUser?.carbs?.current
      ),
      cardTitle: values?.carbohydrates,
      body_number: Number(activeUser?.carbs?.current).toFixed(2).toString(),
      className: "text-[#00D4FF]",
    },
  ];

  // get diet categories =======================>
  const url = "/diet-categories";

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) =>
      data.data?.map((category: any) => ({
        label: category.name,
        value: category?.id,
      })),
  });

  // get meal arabic name ================>
  const getMealName = (name: string) => {
    switch (name) {
      case "Breakfast":
        return "فطار";
      case "Lunch":
        return "غداء";
      case "Snack":
        return "سناك";
      case "Dinner":
        return "عشاء";
    }
  };

  return (
    <Card className="grid grid-cols-2 gap-10 p-4">
      <div className="space-y-4">
        <Text size="2xl">الملعومات الغذائية</Text>
        <Select
          name="diet_category_id"
          options={data ?? []}
          label="الجدول الغذائي"
          placeholder="الجدول الغذائي"
        />

        <div className="flex gap-4 flex-wrap">
          {values.meals?.map((meal: any) => (
            <Food
              key={meal.meal}
              label={getMealName(meal.meal) as string}
              isActive={meal.done === 1}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {radial.map((item, index) => (
          <RadialProgress
            key={index}
            percentage={item?.percentage as any}
            label={item?.cardTitle}
            className={item.className}
            name={item?.name}
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



export default NutritionInfo;
