import { Button, Select } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";

type Props = {};

export default function AddIngredient({}: Props) {
  const [ingredients, setIngredients] = useState([]);

  // get descriptions data list =================>
  const url = `/meal-ingredients?meal_ingredient_category_id=${1}`;

  const {
    data: ingredientsList = [],
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[] } }) =>
      data.data.slice(0, 20).map((item: any) => ({
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
  });

  const { setFieldValue, values } = useFormikContext<{ ingredients: any }>();

  const onClose = () => document.getElementById("add-ingredient")?.click();

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
        onChange={(val: any) => setIngredients(val.map((value: any) => value))}
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
