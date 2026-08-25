// import React from "react";
import { Button, Card, Input, Text, TextArea, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useAppSelector } from "hooks/useRedux";
import { useQueryClient } from "react-query";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";
import { useConfirm } from "components/ConfirmDialog/context";

interface Props {
  couponeData: any;
}

const initialValues = {
  details: [],
  name: "",
  points: "",
  description: "",
  image: "",
};

export default function CouponeSideBar({ couponeData }: Props) {
  const confirm = useConfirm();
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
        /**
         * ⛔ كان `formData.append("details[]", value[1])` — والقيمة **مصفوفة**
         * فتُحوَّل إلى نصٍّ واحد `"أ,ب,ج"` ⇒ تصل الخادم **عنصراً واحداً**
         * ملصوقاً، و`'details'=>'required|array'` تقبله فلا يظهر خطأ:
         * عطبُ بياناتٍ صامت لا رفضٌ ظاهر.
         * والصيغة الصحيحة موجودةٌ في المستودع نفسه (`shared/UserInfo.tsx`).
         */
        ((value[1] as any) ?? []).forEach((detail: any, index: number) =>
          formData.append(`details[${index}]`, detail)
        );
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
      toast.error(apiErrorMessage(error));
    }
  };

  // on delete coupone ====================>
  const { mutateAsync: deleteCoupone, isLoading: isDeleteLoading } =
    useDeleteQuery();

  const onDeleteItem = async () => {
    if (
      !(await confirm({
        title: "حذف الكوبون؟",
        message: "لا يعود قابلاً للمطالبة، ومن طالب به سابقاً لا يتأثّر.",
      }))
    ) {
      return;
    }

    try {
      await deleteCoupone(`/coupons/${couponeData.id}`);

      await queryClient.invalidateQueries("/coupons");

      onClose();
    } catch {
      // الرسالة من `onError`.
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
                <Input key={index} name={`details[${index}]`} />
              ))}
            </ul>
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
