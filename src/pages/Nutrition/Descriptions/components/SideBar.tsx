import { Button, Card, Img, Input, Modal, Table, Text } from "components";
import { RowTable } from "components/RowTable";
import TableActions from "components/Table/actions";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import React, { useRef, useState } from "react";
import { Row } from "react-table";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import AddStep from "./addStep";
import EditIngredient from "./editIngredient";
import AddIngredient from "./add-ingredients";

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
  prepare: { url: "", video_type: "internal", steps: [], video: "" },
};

function SideBar({ setMealData, mealData, categoryId, meal }: SideBarProps) {
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

  // ingredients actions =====================>
  const formRef = useRef<any>(null);

  const onDeleteIngredient = (item: any) => {
    const filteredArray = formRef.current.values?.ingredients?.filter(
      (ingredient: any) =>
        ingredient.name !== item.name || ingredient.label !== item.label
    );

    formRef.current.setFieldValue("ingredients", filteredArray);
  };

  const [ingredientData, setIngredientData] = useState<any>(null);

  const onEditIngredient = (item: any) => {
    setIngredientData(item);
    document.getElementById("edit-ingredient")?.click();
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
        Cell: ({ row }: { row: Row<any> }) => <span>{row.original}</span>,
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
  const url = `/diet-meals/${mealData.id}`;
  const { mutateAsync: editMeal, isLoading: isEditLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    values.prepare.video_type === "external"
      ? delete values.prepare.video
      : delete values.prepare.url;

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) => {
      if (!["prepare", "ingredients"].includes(value[0])) {
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
            `meal_ingredients[${index}][parent_id]`,
            subValue.parent_id
          );
        });
      }
    });

    formData.append("_method", "PUT");

    formData.append("diet_category_id", categoryId as any);

    formData.append("meal", meal);

    console.log(formattedValues);

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

  const [parentId, setParentId] = useState<number | null>(null);

  const onAddSpareIngredient = (parentId: number) => {
    setParentId(parentId);
    document.getElementById("add-ingredient")?.click();
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...mealData,
      }}
      onSubmit={onSubmit}
      enableReinitialize
      innerRef={formRef}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form>
          <>
            {" "}
            <RowTable
              data={{
                columns: [
                  Number(values?.calories).toFixed(2),
                  Number(values?.protein).toFixed(2),
                  Number(values?.carbohydrate).toFixed(2),
                  Number(values?.fat).toFixed(2),
                  Number(values?.trans_fat).toFixed(2),
                  Number(values?.sugar).toFixed(2),
                ],
                header: [
                  "السعرات",
                  "البروتين",
                  "الكاربوهيدرات",
                  "الدهون",
                  "الدهون المتحولة",
                  "السكريات",
                ],
              }}
              title="القيمة الغذائية"
            />
            <Card className="px-4 pb-4">
              <div className="flex justify-between py-3">
                <Text size="3xl">المكونات</Text>
              </div>

              {values?.ingredients
                ?.filter(({ parent_id }: any) => parent_id === null)
                ?.map((ingredient: any) => (
                  <div className="mb-6 border-[1px] p-4 rounded-md">
                    <div className="grid grid-cols-6">
                      <div className="flex flex-col items-center gap-2 w-[100px]">
                        <Text as="h5">الإسم</Text>
                        <Text as="h5" className="!w-full overflow-hidden">
                          {ingredient?.name}
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">السعرات</Text>
                        <Text as="h5">{ingredient?.calories}</Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">الكاربوهيدرات</Text>
                        <Text as="h5">{ingredient?.carbohydrate}</Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">البروتين</Text>
                        <Text as="h5">{ingredient?.protein}</Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">الدهون</Text>
                        <Text as="h5">{ingredient?.fat}</Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Text as="h5">السكريات</Text>
                        <Text as="h5">{ingredient?.sugar}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => onDeleteIngredient(ingredient)}>
                          <Img src="/images/trash.svg" />
                        </Button>
                        <Button onClick={() => onEditIngredient(ingredient)}>
                          <Img src="/images/edit.svg" />
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
                              <Text as="h5">الإسم</Text>
                              <Text as="h5">{subIngredient?.name}</Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">السعرات</Text>
                              <Text as="h5">{subIngredient?.calories}</Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">الكاربوهيدرات</Text>
                              <Text as="h5">{subIngredient?.carbohydrate}</Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">البروتين</Text>
                              <Text as="h5">{subIngredient?.protein}</Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">الدهون</Text>
                              <Text as="h5">{subIngredient?.fat}</Text>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Text as="h5">السكريات</Text>
                              <Text as="h5">{subIngredient?.sugar}</Text>
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
            <Card className="px-4 pb-4">
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
            </Card>
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
            <Modal id="edit-ingredient">
              <EditIngredient
                editData={ingredientData as any}
                setEditData={setIngredientData}
              />
            </Modal>
            <Modal id="add-ingredient">
              <AddIngredient parentId={parentId} setParentId={setParentId} />
            </Modal>
          </>
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
