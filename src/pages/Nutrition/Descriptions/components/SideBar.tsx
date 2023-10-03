import {
  Button,
  Card,
  Img,
  Input,
  Modal,
  Table,
  Text,
  UploadInput,
} from "components";
import TableActions from "components/Table/actions";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import React, { useEffect, useRef, useState } from "react";
import { Row } from "react-table";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import AddStep from "./addStep";
import AddIngredient from "./add-ingredients";
import AssignMealCategories from "./assign-meal-categories";

interface SideBarProps {
  mealData: any;
  setMealData: any;
  categoryId: number;
  meal: string;
}

const initialValues = {
  name: "",
  meal: "",
  image: "",
  meal_ingredients: [],
  diet_categories: [],
  prepare: { url: "", video_type: "internal", steps: [], video: "" },
};

function SideBar({
  setMealData,
  mealData = null,
  categoryId,
  meal,
}: SideBarProps) {
  const [refresher, setRefresher] = useState<any>(0);

  // list actions ======================>
  const { mutateAsync, isLoading } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/diet-meals/${mealData.id}`);
      document.getElementById("my-drawer")?.click();

      queryClient.invalidateQueries(
        `/diet-meals?diet_category_id=${categoryId}&meal=${meal}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const getItemPercentage = (size: number, itemValue: number) => {
    return Number(itemValue * size).toFixed(2);
  };

  const reCalculateNutrationValues = () => {
    const mainMeals = formRef.current?.values?.ingredients?.filter(
      ({ parent_id }: { parent_id: number }) => parent_id === null
    );

    let carbohydrate = 0;
    let trans_fat = 0;
    let protein = 0;
    let calories = 0;
    let sugar = 0;
    let fat = 0;

    mainMeals?.forEach((meal: any) => {
      carbohydrate += Number(meal.one_size_carbohydrate) * meal.size;

      trans_fat += Number(meal.one_size_trans_fat) * meal.size;

      protein += Number(meal.one_size_protein) * meal.size;

      calories += Number(meal.one_size_calories) * meal.size;

      sugar += Number(meal.one_size_sugar) * meal.size;

      fat += Number(meal.one_size_fat) * meal.size;
    });

    formRef.current?.setFieldValue(
      "carbohydrate",
      Math.round(Number(carbohydrate))
    );

    formRef.current?.setFieldValue("trans_fat", Math.round(Number(trans_fat)));

    formRef.current?.setFieldValue("protein", Math.round(Number(protein)));

    formRef.current?.setFieldValue("calories", Math.round(Number(calories)));

    formRef.current?.setFieldValue("sugar", Math.round(Number(sugar)));

    formRef.current?.setFieldValue("fat", Math.round(Number(fat)));

    formRef.current?.setFieldValue("ingredients", [
      ...(formRef.current?.values.ingredients ?? []),
    ]);
  };

  // ingredients actions =====================>
  const formRef = useRef<any>(null);

  const onDeleteIngredient = (item: any) => {
    const filteredArray = formRef.current.values?.ingredients?.filter(
      (ingredient: any) =>
        ingredient.name !== item.name || ingredient.label !== item.label
    );

    formRef.current.setFieldValue("ingredients", filteredArray);
    setRefresher((prev: any) => (prev += 1));
  };

  // steps actions =====================>
  const onDeleteStep = (item: any) => {
    const filteredArray = formRef.current.values?.prepare?.steps?.filter(
      (step: any) => step !== item
    );

    formRef.current.setFieldValue("prepare", {
      ...formRef.current.values?.prepare,
      steps: filteredArray,
    });
  };
  const [stepsData, setStepsData] = useState<any>(null);

  const onEditStep = (item: any) => {
    setStepsData(item);

    document.getElementById("add-step")?.click();
  };

  const columnsSteps = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "description",
        className: "w-full",
        Cell: ({ row }: { row: Row<any> }) => (
          <p className="max-w-[500px] break-words">{row.original}</p>
        ),
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions
            onEdit={() => onEditStep(row.original)}
            onDelete={() => onDeleteStep(row.original)}
          />
        ),
      },
    ],
    []
  );

  const onClose = () => {
    formRef.current?.resetForm();
    document.getElementById("my-drawer")?.click();
  };

  // on submit meal data ======================>
  const isEditing = mealData !== null;

  const url = isEditing ? `/diet-meals/${mealData.id}` : "/diet-meals";

  const { mutateAsync: editMeal, isLoading: isEditLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const [parentId, setParentId] = useState<number | null>(null);

  const onAddSpareIngredient = (parentId: number) => {
    setParentId(parentId);
    document.getElementById("add-ingredient")?.click();
  };

  const meals = [
    { label: "فطار", value: "Breakfast" },
    { label: "غداء", value: "Lunch" },
    { label: "سناكس", value: "Snack" },
    { label: "عشاء", value: "Dinner" },
  ];

  const onViewCategories = () =>
    document.getElementById("edit-categories")?.click();

  const mealValue = [
    "السعرات",
    "البروتين",
    "الكاربوهيدرات",
    "الدهون",
    "الدهون المتحولة",
    "السكريات",
  ];

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    delete values.diet_mea_categories;

    values.prepare.video_type === "external"
      ? delete values.prepare.video
      : delete values.prepare.url;

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) => {
      if (!["prepare", "ingredients", "diet_categories"].includes(value[0])) {
        formData.append(value[0], value[1] as any);
        return;
      }

      if (value[0] === "prepare") {
        Object.entries(value[1] as any).forEach((subValue) =>
          subValue[0] !== "steps"
            ? formData.append(`prepare[${subValue[0]}]`, subValue[1] as any)
            : (subValue[1] as any).forEach((step: string, index: number) =>
                formData.append(`prepare[steps][${index}]`, step as any)
              )
        );
        return;
      }

      if (value[0] === "ingredients") {
        (value[1] as any).forEach((subValue: any, index: any) => {
          formData.append(
            `meal_ingredients[${index}][id]`,
            subValue.id ?? subValue.value
          );

          formData.append(
            `meal_ingredients[${index}][size]`,
            subValue.size ?? subValue.size
          );

          formData.append(
            `meal_ingredients[${index}][parent_id]`,
            subValue.parent_id === null ? "" : subValue.parent_id
          );
        });
      }

      if (value[0] === "diet_categories") {
        (value[1] as any).forEach((category: any, index: any) => {
          formData.append(`diet_categories[${index}][id]`, category.id?.value);

          formData.append(
            `diet_categories[${index}][meal]`,
            category.meal.value
          );
        });
      }
    });

    isEditing && formData.append("_method", "PUT");

    formData.append("diet_category_id", categoryId as any);

    formData.append("meal", meal);

    try {
      await editMeal(formData as any);

      await queryClient.invalidateQueries(
        `/diet-meals?diet_category_id=${categoryId}&meal=${meal}`
      );

      Helpers.resetForm();

      setMealData(null);

      document.getElementById("my-drawer")?.click();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (refresher > 0) {
      reCalculateNutrationValues();
    }
  }, [refresher]);

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...mealData,
        calories: Math.round(mealData?.calories ?? 0),
        protein: Math.round(mealData?.protein ?? 0),
        fat: Math.round(mealData?.fat ?? 0),
        carbohydrate: Math.round(mealData?.carbohydrate ?? 0),
        sugar: Math.round(mealData?.calories ?? 0),
        trans_fat: Math.round(mealData?.trans_fat ?? 0),
        prepare: { ...mealData?.prepare, video_type: "internal" },
        diet_categories: mealData?.diet_mea_categories?.map((item: any) => ({
          meal: meals.find((meal) => meal.value === item.meal),
          id: { label: item.category_name, value: item.id },
        })),
      }}
      onSubmit={onSubmit}
      enableReinitialize
      innerRef={formRef}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form>
          <>
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-full">
                  <UploadInput name="image" />
                </div>
                <Input name="name" className="text-lg" />
              </div>

              <div>
                <Text className="flex items-center gap-4">الصنف</Text>
                <Card
                  className="grid grid-cols-3 p-4 gap-4 max-w-[450px] cursor-pointer text-center"
                  onClick={onViewCategories}
                >
                  {values.diet_categories?.map(
                    (category: any, index: number) => (
                      <div
                        key={index}
                        className="mb-2 border-primary border-[1px] p-1 rounded-full"
                      >
                        {category?.id?.label} / {category?.meal?.label}
                      </div>
                    )
                  )}
                </Card>
              </div>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-6 gap-6">
                {mealValue.map((item) => (
                  <Text as="h5" key={item} className="!text-center w-full">
                    {item}
                  </Text>
                ))}
              </div>
              <div className="my-4 h-[4px] bg-primary" />
              <div className="grid grid-cols-6 gap-6">
                <Input name="calories" className="text-center font-bold" />
                <Input name="protein" className="text-center font-bold" />
                <Input name="carbohydrate" className="text-center font-bold" />
                <Input name="fat" className="text-center font-bold" />
                <Input name="trans_fat" className="text-center font-bold" />
                <Input name="sugar" className="text-center font-bold" />
              </div>
            </Card>

            <Card className="relative px-4 pb-4">
              <div className="flex justify-between py-3">
                <Text size="3xl">المكونات</Text>
              </div>

              {values?.ingredients
                ?.filter(({ parent_id }: any) => parent_id === null)
                ?.map((ingredient: any, index: number) => (
                  <div className="mb-6 border-[1px] p-4 rounded-md">
                    <div className="grid grid-cols-7">
                      <div className="flex flex-col items-center gap-2 w-[100px]">
                        <div className="avatar indicator">
                          <div className="w-12 h-12 rounded-full">
                            <img
                              src={
                                ingredient.image ||
                                "/images/img_rectangle347.png"
                              }
                            />
                          </div>
                        </div>
                        <Text as="h5" className="!w-full overflow-hidden">
                          {ingredient?.name}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">السعرات</Text>
                        <Text as="h5">
                          {getItemPercentage(
                            ingredient?.size,
                            ingredient?.one_size_calories
                          )}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">الكاربوهيدرات</Text>
                        <Text as="h5">
                          {getItemPercentage(
                            ingredient?.size,
                            ingredient?.one_size_carbohydrate
                          )}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">البروتين</Text>
                        <Text as="h5">
                          {getItemPercentage(
                            ingredient?.size,
                            ingredient?.one_size_protein
                          )}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">الدهون</Text>
                        <Text as="h5">
                          {getItemPercentage(
                            ingredient?.size,
                            ingredient?.one_size_fat
                          )}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">السكريات</Text>
                        <Text as="h5">
                          {getItemPercentage(
                            ingredient?.size,
                            ingredient?.one_size_sugar
                          )}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">الحجم</Text>
                        <Input
                          name={`ingredients.[${index}].size`}
                          className="text-center"
                          isForm={false}
                          value={ingredient.size}
                          onChange={(e) => {
                            ingredient.size = e.target.value;

                            setFieldValue("ingredients", [
                              ...values.ingredients,
                            ]);
                            setRefresher((prev: any) => (prev += 1));
                          }}
                        />
                        <Text>{ingredient.measure}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => onDeleteIngredient(ingredient)}>
                          <Img src="/images/trash.svg" />
                        </Button>

                        <Button
                          secondaryBorder
                          className="w-[120px] !mt-4"
                          onClick={() => onAddSpareIngredient(ingredient?.id)}
                        >
                          إضافة مكون بديل
                        </Button>
                      </div>
                    </div>

                    <Text as="h5">المكونات البديلة:</Text>

                    <div>
                      {values?.ingredients
                        ?.filter(
                          (item: any) => item.parent_id === ingredient?.id
                        )
                        ?.map((subIngredient: any) => (
                          <div className="grid grid-cols-7 mb-6 border-[1px] p-4 rounded-md">
                            <div className="flex flex-col items-center gap-2 w-[100px]">
                              <div className="avatar indicator">
                                <div className="w-12 h-12 rounded-full">
                                  <img
                                    src={
                                      subIngredient.image ||
                                      "/images/img_rectangle347.png"
                                    }
                                  />
                                </div>
                              </div>
                              <Text as="h5" className="!w-full overflow-hidden">
                                {subIngredient?.name}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">السعرات</Text>
                              <Text as="h5">
                                {getItemPercentage(
                                  subIngredient?.size,
                                  subIngredient?.calories
                                )}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">الكاربوهيدرات</Text>
                              <Text as="h5">
                                {getItemPercentage(
                                  subIngredient?.size,
                                  subIngredient?.carbohydrate
                                )}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">البروتين</Text>
                              <Text as="h5">
                                {getItemPercentage(
                                  subIngredient?.size,
                                  subIngredient?.protein
                                )}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">الدهون</Text>
                              <Text as="h5">
                                {getItemPercentage(
                                  subIngredient?.size,
                                  subIngredient?.fat
                                )}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">السكريات</Text>
                              <Text as="h5">
                                {getItemPercentage(
                                  subIngredient?.size,
                                  subIngredient?.sugar
                                )}
                              </Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">الحجم</Text>
                              <Input
                                name=""
                                className="text-center"
                                isForm={false}
                                value={subIngredient.size}
                                onChange={(e) => {
                                  subIngredient.size = e.target.value;
                                  setFieldValue("ingredients", [
                                    ...values.ingredients,
                                  ]);
                                }}
                              />
                              <Text>{subIngredient.measure}</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() =>
                                  onDeleteIngredient(subIngredient)
                                }
                              >
                                <Img src="/images/trash.svg" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

              <Button
                secondaryBorder
                onClick={() =>
                  document.getElementById("add-ingredient")?.click()
                }
              >
                إضافة مكون
              </Button>
            </Card>

            <Modal
              id="add-ingredient"
              modalClassName="[&>.modal-box]:!max-w-full !z-[1000]"
            >
              <AddIngredient
                parentId={parentId}
                setParentId={setParentId}
                setRefresher={setRefresher}
                refresher={refresher}
              />
            </Modal>

            <Card className="relative px-4 pb-4">
              <div className="flex justify-between py-3">
                <Text size="3xl">طريقة التحضير</Text>
                <div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <label htmlFor="internal" className="mb-2">
                        رفع من الجهاز
                      </label>
                      <input
                        id="internal"
                        name="video_type"
                        type="radio"
                        checked={values.prepare?.video_type === "internal"}
                        onChange={() =>
                          setFieldValue("prepare.video_type", "internal")
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label htmlFor="external" className="mb-2">
                        ادخال رابط
                      </label>
                      <input
                        id="external"
                        name="video_type"
                        type="radio"
                        checked={values.prepare?.video_type === "external"}
                        onChange={() =>
                          setFieldValue("prepare.video_type", "external")
                        }
                      />
                    </div>
                  </div>

                  {values.prepare?.video_type !== "" ? (
                    values.prepare?.video_type === "external" ? (
                      <Input name="prepare.url" label={"رابط الفيديو"} />
                    ) : (
                      <Input
                        type={"file" as any}
                        name="prepare.video"
                        accept="video/*"
                        isForm={false}
                        onChange={(e: any) =>
                          setFieldValue("prepare", {
                            ...values.prepare,
                            video: e.target?.files[0],
                          })
                        }
                      />
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {values?.prepare?.steps?.length > 0 ? (
                <Table
                  noPagination
                  search={false}
                  data={values?.prepare?.steps ?? []}
                  columns={columnsSteps}
                  modalTitle="اضافة خطوة"
                  modalContent={
                    <AddStep editData={stepsData} setEditData={setStepsData} />
                  }
                  id="add-step"
                />
              ) : (
                <Button
                  secondaryBorder
                  onClick={() =>
                    document.getElementById("add-step-empty")?.click()
                  }
                >
                  إضافة خطوة
                </Button>
              )}
            </Card>
            <Modal id="add-step-empty" modalClassName="absolute">
              <AddStep
                editData={stepsData}
                setEditData={setStepsData}
                isEmpty={true}
              />
            </Modal>

            <div className="flex items-center justify-evenly mt-6">
              <Button
                className="w-[100px]"
                primary
                isLoading={isEditLoading}
                onClick={submitForm}
              >
                حفظ
              </Button>
              <Button className="w-[100px]" primary onClick={onClose}>
                إلغاء
              </Button>
              <Button
                className="w-[100px]"
                danger
                onClick={onDeleteItem}
                isLoading={isLoading}
              >
                حذف
              </Button>
            </div>

            <Modal id="edit-categories">
              <AssignMealCategories />
            </Modal>
          </>
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
