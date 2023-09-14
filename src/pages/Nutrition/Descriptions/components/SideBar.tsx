import { Button, Card, Input, Modal, Table, Text } from "components";
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

  const columnsIngredients = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex text-white items-center gap-4">
              <div className="w-8 h-">
                <img src="/images/img_rectangle347.png" />
              </div>
              {row.original.name ?? row.original.label}
            </div>
          );
        },
      },
      {
        Header: "السعرات",
        accessor: "calories",
      },
      {
        Header: " الكاربوهيدرات",
        accessor: "carbohydrate",
      },
      {
        Header: "البروتين",
        accessor: "protein",
      },

      {
        Header: "الدهون",
        accessor: "fat",
      },

      {
        Header: "السكريات",
        accessor: "sugar",
      },

      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions
            onEdit={() => onEditIngredient(row.original)}
            onDelete={() => onDeleteIngredient(row.original)}
          />
        ),
      },
    ],
    []
  );

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
        (value[1] as any).forEach((subValue, index) =>
          formData.append(
            `meal_ingredients[${index}]`,
            subValue.id ?? subValue.value
          )
        );
      }
    });

    formData.append("_method", "PUT");

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
              <Table
                noPagination
                search={false}
                data={values?.ingredients ?? []}
                columns={columnsIngredients}
                modalTitle="اضافة مكون"
                modalContent={<AddIngredient />}
                id="add-ingredient"
              />
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
          </>
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
