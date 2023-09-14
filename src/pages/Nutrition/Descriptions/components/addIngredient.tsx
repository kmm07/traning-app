import { Input } from "components";
import React, { useState } from "react";

interface ingredientData {
  name: string;
  calories: string;
  carb: string;
  protine: string;
  fat: string;
  sugar: string;
}

export default function AddIngredient() {
  const [ingredientData, setIngredientData] = useState<any>({
    name: "",
    calories: "",
    carb: "",
    protine: "",
    fat: "",
    sugar: "",
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        name="name"
        label={"الإسم"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, name: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="calories"
        label={"السعرات"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, calories: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="name"
        label={"الإسم"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, name: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="carb"
        label={"الكربوهيدرات"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, carb: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="protine"
        label={"البروتينات"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, protine: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="fat"
        label={"الدهون"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, fat: e.target.value })
        }
        isForm={false}
      />
      <Input
        name="sugar"
        label={"السكريات"}
        onChange={(e) =>
          setIngredientData({ ...ingredientData, sugar: e.target.value })
        }
        isForm={false}
      />
    </div>
  );
}
