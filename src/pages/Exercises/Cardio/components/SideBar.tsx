import {
  Button,
  Card,
  Img,
  Input,
  Modal,
  Text,
  TrhButton,
  UploadInput,
} from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useRef } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import AddCardio from "./add-exercise";
import { useAppSelector } from "hooks/useRedux";
import { selectIsImageDelete } from "redux/slices/imageDelete";
const initialValues = {
  image: "",
  name: "",
  cardios: [],
};

function SideBar({
  cardioData,
  setCardioData,
}: {
  cardioData: any;
  setCardioData: any;
}) {
  // cardio actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync } = useDeleteQuery();

  const onClose = () => {
    setCardioData(null);
    document.getElementById("my-drawer")?.click();
  };

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/cardios/${cardioData?.id}`);

      await queryClient.invalidateQueries(`/cardios`);

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // ON save Item =========================>

  const isEditing = cardioData !== null;

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const url = isEditing ? `/cardios/${cardioData?.id}` : "/cardios";

  const { mutateAsync: saveCardio } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  async function onSubmit(values: any, helpers: FormikHelpers<any>) {
    const formData = new FormData();

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) =>
      value[0] !== "cardios"
        ? formData.append(value[0], value[1] as any)
        : (value[1] as any).forEach((subValue: any, index: number) => {
            formData.append(`cardios[${index}][name]`, subValue.name);
            formData.append(`cardios[${index}][met]`, subValue.met);
            formData.append(`cardios[${index}][is_new]`, subValue.is_new);
            subValue.is_new === 0 &&
              formData.append(`cardios[${index}][id]`, subValue.id);
          })
    );

    isEditing && formData.append("_method", "PUT");

    try {
      !isImageDelete && isEditing && formData.delete("image");

      saveCardio(formData as any);

      await queryClient.invalidateQueries("/cardios");

      helpers.resetForm();

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const formRef = useRef<any>(null);

  // cardio exercises actions ==================>
  const onDeleteExercise = (item: any) => {
    const filteredData = formRef.current?.values?.cardios?.filter(
      (exercise: any) => exercise.name !== item.name
    );

    formRef.current.setFieldValue("cardios", filteredData);
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...cardioData }}
      onSubmit={onSubmit}
      innerRef={formRef}
      enableReinitialize
    >
      {({ values }: { values: any }) => (
        <Form className="flex flex-col gap-10">
          <div className="flex gap-5 justify-between w-full">
            <div className="flex gap-5 ">
              <UploadInput name="image" />{" "}
              <div className="flex flex-col ">
                <Input
                  name="name"
                  className="text-[25px] border-[1px]"
                  label="الإسم"
                />
              </div>
            </div>
          </div>

          {/* <Card className="flex  gap-5 p-4">
            <Text size="3xl">الصورة </Text>
            <hr />
            <UploadInput name="image" />
          </Card> */}

          <Card className="p-6">
            <Text as="h1" className="mb-4">
              مستوي الشدة
            </Text>
            {values.cardios?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 mb-6"
              >
                <Input name={`cardios.[${index}].name`} />

                <Input name={`cardios.[${index}].met`} />

                <Button onClick={() => onDeleteExercise(item)}>
                  <Img src="/images/trash.svg" />
                </Button>
              </div>
            ))}
            <Button
              className="flex items-center gap-1"
              onClick={() =>
                document.getElementById("cardio-exercise")?.click()
              }
            >
              <Img src="/images/plus.svg" />
              <Text className="!text-primary">إضافة</Text>
            </Button>

            <Modal id="cardio-exercise">
              <AddCardio />
            </Modal>
          </Card>

          <TrhButton onDelete={onDeleteItem} />
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
