import { Button, Select } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";

export default function AddIngredient({ parentId, setParentId }: any) {
  const [ingredients, setIngredients] = useState([]);

  // get descriptions data list =================>
  const url = `/meal-ingredients?meal_ingredient_category_id=${0}`;

  const { data: ingredientsList = [] }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: any[] } }) =>
        data.data.slice(0, 20).map((item: any) => ({
          image: item.image,
          value: item.id,
          label: item.name,
          calories: item.calories,
          fat: item.fat,
          protein: item.protein,
          sugar: item.sugar,
          trans_fat: item.trans_fat,
          carbohydrate: item.carbohydrate,
          size: item.size,
          measure: item.measure,
        })),
    }
  );

  const { setFieldValue, values } = useFormikContext<{ ingredients: any }>();

  const onClose = () => {
    document.getElementById("add-ingredient")?.click();
    setParentId(null);
  };

  const onSaveIngredient = () => {
    setFieldValue("ingredients", [...values.ingredients, ...ingredients]);

    onClose();
  };

  return (
    <div>
      <Select
        options={ingredientsList ?? []}
        name=""
        label="المكونات"
        onChange={(val: any) =>
          setIngredients(
            val.map((value: any) => ({ ...value, parent_id: parentId }))
          )
        }
        isMulti
        isForm={false}
      />

      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onSaveIngredient}>
          إضافة
        </Button>
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
