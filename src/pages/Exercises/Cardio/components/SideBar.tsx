import {
  Card,
  Img,
  Input,
  Table,
  Text,
  TrhButton,
  UploadInput,
} from "components";
import TableActions from "components/Table/actions";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import React, { useRef } from "react";
import { useQueryClient } from "react-query";
import { Row } from "react-table";
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
  const isImageDelete = useAppSelector(selectIsImageDelete);

  const url = `/cardios/${cardioData?.id}`;

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

    formData.append("_method", "PUT");

    try {
      !isImageDelete && formData.delete("image");

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

  const columns = React.useMemo(
    () => [
      {
        Header: "الإسم",
        accessor: "name",
      },

      {
        Header: "مستوى الشدة",
        accessor: "met",
      },

      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions onDelete={() => onDeleteExercise(row.original)} />
        ),
      },
    ],
    []
  );

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
              <Img className="w-24 rounded-2xl" src={values?.image} />
              <div className="flex flex-col ">
                <Input name="name" className="text-[25px] border-none" />
              </div>
            </div>
          </div>

          <Card className="flex  gap-5 p-4">
            <Text size="3xl">الصورة </Text>
            <hr />
            <UploadInput name="image" />
          </Card>

          <Table
            noPagination
            search={false}
            data={values.cardios ?? []}
            columns={columns}
            modalTitle="اضافة"
            modalContent={<AddCardio />}
            id="cardio-exercise"
          />
          <TrhButton onDelete={onDeleteItem} />
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
