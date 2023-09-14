import { Button, Input } from "components";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";

interface ingredientData {
  name: string;
  calories: string;
  fat: string;
  sugar: string;
  carbohydrate: string;
  protein: string;
  trans_fat: string;
}

export default function EditIngredient({
  editData,
  setEditData,
}: {
  editData: any;
  setEditData: any;
}) {
  const [ingredientData, setIngredientData] = useState<ingredientData>({
    name: "",
    calories: "",
    carbohydrate: "",
    protein: "",
    fat: "",
    trans_fat: "",
    sugar: "",
  });

  const onClose = () => {
    document.getElementById("edit-ingredient")?.click();
    setEditData(null);
  };

  const { values, setFieldValue } = useFormikContext<{
    ingredients: any;
  }>();

  const onSaveIngredient = () => {
    if (editData !== null) {
      const filteredArray = values.ingredients.filter(
        (ingredient: ingredientData) => ingredient?.name !== editData?.name
      );

      setFieldValue("ingredients", [...filteredArray, ingredientData]);
    } else
      setFieldValue("ingredients", [...values.ingredients, ingredientData]);

    onClose();
  };

  useEffect(() => {
    if (editData === null) {
      setIngredientData({
        name: "",
        calories: "",
        carbohydrate: "",
        protein: "",
        fat: "",
        trans_fat: "",
        sugar: "",
      });
    } else setIngredientData({ ...editData });
  }, [editData]);

  console.log(editData);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="name"
          label={"الإسم"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, name: e.target.value })
          }
          value={ingredientData?.name}
          isForm={false}
        />
        <Input
          name="calories"
          label={"السعرات"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, calories: e.target.value })
          }
          value={ingredientData?.calories}
          isForm={false}
        />

        <Input
          name="carbohydrate"
          label={"الكربوهيدرات"}
          onChange={(e) =>
            setIngredientData({
              ...ingredientData,
              carbohydrate: e.target.value,
            })
          }
          value={ingredientData?.carbohydrate}
          isForm={false}
        />
        <Input
          name="protein"
          label={"البروتينات"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, protein: e.target.value })
          }
          value={ingredientData?.protein}
          isForm={false}
        />
        <Input
          name="fat"
          label={"الدهون"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, fat: e.target.value })
          }
          value={ingredientData?.fat}
          isForm={false}
        />
        <Input
          name="trans_fat"
          label={"الدهون المتحولة"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, trans_fat: e.target.value })
          }
          value={ingredientData?.trans_fat}
          isForm={false}
        />
        <Input
          name="sugar"
          label={"السكريات"}
          onChange={(e) =>
            setIngredientData({ ...ingredientData, sugar: e.target.value })
          }
          value={ingredientData?.sugar}
          isForm={false}
        />
      </div>
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
