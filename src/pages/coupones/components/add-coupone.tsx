import { Button, Input, TextArea, UploadInput } from "components";
import { Form, Formik } from "formik";
// import { usePostQuery } from "hooks/useQueryHooks";
// import { useAppSelector } from "hooks/useRedux";
// import { useQueryClient } from "react-query";
// import { selectIsImageDelete } from "redux/slices/imageDelete";
// import { toast } from "react-toastify";
// import { useState } from "react";

const initialValues = {};

export default function AddCoupone() {
  // const url = "/coupons";

  // const isImageDelete = useAppSelector(selectIsImageDelete);

  // const { mutateAsync } = usePostQuery({
  //   url,
  //   contentType: "multipart/form-data",
  // });

  const onClose = () => {
    document.getElementById("add-coupone")?.click();
    // exerciseData(null);
  };

  // const queryClient = useQueryClient();

  // const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
  //   try {
  //     onClose();

  //     queryClient.invalidateQueries(`/exercises?exercise_category_id=`);
  //   } catch (error: any) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  // const [detail, setDetail] = useState<string>("");

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      enableReinitialize
    >
      {/* {({ values, setFieldValue }) => ( */}
      <Form className="flex flex-col gap-6">
        <UploadInput name="image" label="صورة" />
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" label="اسم الكوبون" />

          <Input name="points" type={"number" as any} label="نقاط الكوبون" />

          <Input name="code" label="كود الكوبون" />
        </div>

        <TextArea
          name="description"
          label="وصف الكوبون"
          className="border-[1px]"
        />

        {/* add details */}

        {/* {values.details?.map((detail: any) => (
            <div>
              <Text>{detail}</Text>
            </div>
          ))} */}

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

          <Button className={"!w-20"} primary type="submit" isLoading={false}>
            اضافة
          </Button>
        </div>
      </Form>
      {/* )} */}
    </Formik>
  );
}
