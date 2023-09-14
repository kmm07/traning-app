import { Button, Img, Input, Text, UploadInput } from "components";
import { Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Form } from "react-router-dom";

import { toast } from "react-toastify";

interface Props {
  cardioData: any;
  setCardioData: any;
}

const initialValues = {
  image: "",
  name: "",
  cardios: [],
};

export default function CardioForm({ cardioData, setCardioData }: Props) {
  const url = "/cardios";

  const onClose = () => {
    setCardioData(null);
    document.getElementById("my_modal")?.click();
  };

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const queryClient = useQueryClient();

  async function onSubmit(values: any, helpers: FormikHelpers<any>) {
    const formData = new FormData();

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) =>
      value[0] !== "cardios"
        ? formData.append(value[0], value[1] as any)
        : (value[1] as any).forEach((subValue: any, index: number) => {
            formData.append(`cardios[${index}][name]`, subValue.name);
            formData.append(`cardios[${index}][met]`, subValue.met);
          })
    );

    try {
      mutateAsync(formData as any);

      await queryClient.invalidateQueries("/cardios");

      helpers.resetForm();

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const [singleCardio, setSingleCardio] = useState<{
    name: string;
    met: number | string;
  }>({
    name: "",
    met: "",
  });

  const onSaveExercise = (setFieldValue: any, values: any) => {
    setFieldValue("cardios", [...values.cardios, singleCardio]);

    setSingleCardio({
      name: "",
      met: "",
    });
  };

  const onRenoveExercise = (
    values: any,
    setFieldValue: any,
    deletedExercise: any
  ) => {
    const filteredArray = values.cardios.filter(
      (item: any) => item.name !== deletedExercise.name
    );

    setFieldValue("cardios", filteredArray);
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...cardioData }}
      onSubmit={onSubmit}
      enableReinitialize
      //   validationSchema={validationSchema}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form className="flex flex-col justify-start gap-8">
          <UploadInput name="image" />

          <Input name="name" label="الاسم" />

          <div>
            <Text>التمارين:</Text>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                label="الاسم"
                isForm={false}
                value={singleCardio.name}
                onChange={(e) =>
                  setSingleCardio({ ...singleCardio, name: e.target.value })
                }
              />
              <Input
                name="met"
                label="met"
                isForm={false}
                value={singleCardio.met}
                onChange={(e) =>
                  setSingleCardio({ ...singleCardio, met: e.target.value })
                }
              />
            </div>

            <Button onClick={() => onSaveExercise(setFieldValue, values)}>
              إضافة التمرين
            </Button>
          </div>

          {values.cardios?.map((cardio: any) => (
            <div className="flex items-center gap-4">
              <Text>{cardio.name}</Text>
              <Text>{cardio.met}</Text>
              <Button
                onClick={() => onRenoveExercise(values, setFieldValue, cardio)}
              >
                <Img src="/images/trash.svg" />
              </Button>
            </div>
          ))}

          <div className="flex gap-4 ">
            <Button
              className={"!w-20"}
              tertiary
              type="reset"
              htmlFor="add-new-nutrition"
              secondary
              onClick={onClose}
            >
              الغاء
            </Button>

            <Button
              className={"!w-20"}
              primary
              type="submit"
              isLoading={isLoading}
              onClick={submitForm}
            >
              اضافة
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
