import { Button, Img, Input, Text, TextArea, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { apiErrorMessage } from "util/apiError";

const initialValues = {
  details: [],
  name: "",
  points: "",
  description: "",
  image: "",
};

export default function AddCoupone() {
  const url = "/coupons";

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onClose = () => {
    document.getElementById("add-coupone")?.click();
    // exerciseData(null);
  };

  const queryClient = useQueryClient();

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

    try {
      await mutateAsync(formData as any);

      queryClient.invalidateQueries("/coupons");

      onClose();

      helpers.resetForm();
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  const [detail, setDetail] = useState<string>("");

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-6">
          <UploadInput name="image" label="صورة" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="اسم الكوبون" />

            <Input name="points" type={"number" as any} label="نقاط الكوبون" />

            {/*
              ⛔ نُزع حقل «كود الكوبون» — كان يُملأ ويُرسَل و**يتجاهله الخادم**:
              العمود `coupons.code` محذوفٌ منذ هجرة ٢٠٢٣ (وهو أصلُ BUG-18).
              وبقرار خالد (٢٥ أغسطس) صارت كلُّ الكوبونات **مطالبةً يدوية لا
              كوداً** ⇒ الحقل لا وجهةَ له ولا معنى.
            */}
          </div>

          <TextArea
            name="description"
            label="وصف الكوبون"
            className="border-[1px]"
          />

          <Text as="h5">إضافة تفاصيل الكوبون:</Text>
          <div>
            <TextArea
              /* ⛔ كان `name="description"` — **الاسمَ عينه** لحقل الوصف أعلاه.
                 غيرُ ضارٍّ اليوم لأن `isForm={false}` يجعله محكوماً بـ`detail`،
                 لكنه لغمٌ ينفجر لحظة ربطه بـformik. */
              name="detail-draft"
              label="تفاصيل الكوبون"
              className="border-[1px]"
              isForm={false}
              onChange={(e) => setDetail(e.target.value)}
              value={detail}
            />
            <Button
              secondaryBorder
              onClick={() => {
                setFieldValue("details", [...values.details, detail]);
                setDetail("");
              }}
            >
              إضافة
            </Button>
          </div>

          {/* add details */}
          {values.details?.map((detail: any) => (
            <div>
              <Text as="h5">{detail}</Text>
              <Button
                onClick={() => {
                  const filteredArray = values.details.filter(
                    (item: any) => item !== detail
                  );

                  setFieldValue("details", filteredArray);
                }}
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
            >
              اضافة
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
