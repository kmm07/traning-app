// import React from "react";
import { Button, Card, Input, Text, TextArea, UploadInput } from "components";
import { Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { useQueryClient } from "react-query";
import { Form } from "react-router-dom";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import { toast } from "react-toastify";

interface Props {
  couponeData: any;
}

const initialValues = {
  details: [],
  name: "",
  points: "",
  description: "",
  image: "",
  code: "",
};

export default function CouponeSideBar({ couponeData }: Props) {
  const url = `/coupons/${couponeData?.id}`;

  const isImageDelete = useAppSelector(selectIsImageDelete);

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
    // exerciseData(null);
  };

  const queryClient = useQueryClient();

  // on edit coupone ====================>
  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    const formData = new FormData();

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) => {
      if (value[0] !== "details") {
        formData.append(value[0], value[1] as any);
      } else {
        formData.append("details[]", value[1] as any);
      }
    });

    formData.append("_method", "PUT");

    try {
      !isImageDelete && formData.delete("image");

      await mutateAsync(formData as any);

      queryClient.invalidateQueries("/coupons");

      onClose();

      helpers.resetForm();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // on delete coupone ====================>
  const { mutateAsync: deleteCoupone, isLoading: isDeleteLoading } =
    useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await deleteCoupone(`/coupons/${couponeData.id}`);

      await queryClient.invalidateQueries("/coupons");

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...couponeData,
        image: couponeData?.file_path,
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, submitForm }) => (
        <Form className="flex flex-col gap-6">
          <Card className="flex items-center justify-between p-6">
            <div className="flex gap-4">
              <div className="w-[100px] h-[100px]">
                <img src={couponeData?.file_path} alt="image" />
              </div>
              <Input name="name" className="text-[30px]" />
            </div>

            <Card className="p-6 !w-[200px] flex flex-col items-center">
              <Text as="h5" className="text-[30px] mb-4">
                النقاط
              </Text>
              <Input name="points" className="text-[30px] text-center" />
            </Card>
          </Card>

          <Card className="p-6">
            <Text as="h5">الصورة</Text>

            <UploadInput name="image" />
          </Card>

          <Card className="p-6">
            <Text as="h5">الوصف</Text>
            <div>
              <TextArea name="description" />
            </div>
          </Card>

          <Card className="p-6">
            <Text as="h5">تفاصيل الكوبون</Text>
            <ul>
              {values.details?.map((_detail: any, index: number) => (
                <Input name={`details[${index}]`} />
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <Text as="h5">الكود</Text>
            <Input name="code" className="text-[35px] text-center" />
          </Card>

          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              isLoading={isLoading}
              onClick={submitForm}
            >
              تعديل
            </Button>
            <Button className="w-[100px]" primary onClick={onClose}>
              إلغاء
            </Button>
            <Button
              className="w-[100px]"
              danger
              onClick={onDeleteItem}
              isLoading={isDeleteLoading}
            >
              حذف
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
