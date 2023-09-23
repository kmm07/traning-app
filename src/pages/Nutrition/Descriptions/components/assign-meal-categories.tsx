import { Button, Img, Select, Text } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

type Props = {};

export default function AssignMealCategories({}: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  const meals = [
    { label: "فطار", value: "Breakfast" },
    { label: "غداء", value: "Lunch" },
    { label: "سناكس", value: "Snack" },
    { label: "عشاء", value: "Dinner" },
  ];

  const { data: cardData }: UseQueryResult<any> = useGetQuery(
    "diet-categories",
    "diet-categories",
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data?.map((item: any) => ({ label: item.name, value: item.id })),
      refetchOnWindowFocus: false,
    }
  );

  const onChangeItem = (newValue: any, index: any, itemName: any) => {
    values.diet_categories[index][itemName] = newValue;

    setFieldValue("diet_categories", [...values.diet_categories]);
  };

  const onDeleteItem = (index: any) => {
    values.diet_categories.splice(index, 1);

    setFieldValue("diet_categories", [...values.diet_categories]);
  };

  const onAssignCategories = () => {
    setFieldValue("diet_categories", [
      ...(values.diet_categories ?? []),
      { meal: "", id: null },
    ]);
  };

  console.log(values.diet_categories);

  return (
    <div>
      {values.diet_categories?.map((item: any, index: number) => (
        <div
          key={index}
          className="flex items-center justify-between mb-4 gap-4 border-[1px] p-2 rounded-md"
        >
          <Select
            options={meals}
            name={`diet_categories.[${index}].meal`}
            value={item.meal}
            onChange={(e) => onChangeItem(e, index, "meal")}
            isForm={false}
          />
          <Select
            options={cardData ?? []}
            name={`diet_categories.[${index}].id`}
            value={item.id}
            onChange={(e) => onChangeItem(e, index, "id")}
            isForm={false}
          />
          <Button onClick={() => onDeleteItem(index)}>
            <Img src="/images/trash.svg" />
          </Button>
        </div>
      ))}
      <Button onClick={onAssignCategories}>
        <Img src="/images/plus.svg" />
        <Text className="!text-primary">إضافة تصنيف</Text>
      </Button>

      <div className="flex items-center justify-evenly mt-6">
        <Button
          className="w-[100px]"
          primary
          onClick={() => document.getElementById("edit-categories")?.click()}
        >
          حفظ
        </Button>
        <Button
          className="w-[100px]"
          primary
          onClick={() => document.getElementById("edit-categories")?.click()}
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}
