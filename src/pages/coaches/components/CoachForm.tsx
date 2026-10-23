import { Button, Input, Select, TextArea, UploadInput } from "components";
import { Form, Formik } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Coach, STATUS_LABEL } from "../shared";

/*
 * إضافةُ مدرّبٍ وتحريرُه — `POST admin/coaches` و`POST admin/coaches/{id}`.
 *
 * ⚖️ **«ظاهر» خيارٌ عند التحرير وحده** [المرحلة ٣]: الخادم يقبله بتغطيةٍ كاملة وإلا يردّ 422 بالناقص
 *    (قرار خالد: «لا يظهر المدرّب إلا بعد تغطية كل الجداول»). ولا يُنشأ مدرّبٌ جديد ظاهراً.
 *
 * ⛔ **ومدرّبُ المنصّة (خالد)** تُحرَّر منه الأسماءُ والنبذةُ والصورة وحدها —
 *    نسبتُه صفرٌ وحالتُه ثابتة، والخادم يُسقط غيرها على أيّ حال.
 *
 * ⚠️ **والصورة تُرسل ملفاً فقط** — `UploadInput` يحمل الرابط القائم نصّاً،
 *    و`image` على الخادم `mimes:` فنصٌّ فيها يُرفض بـ422 على كل حفظٍ لا
 *    يغيّر الصورة.
 */

export const COACH_MODAL_ID = "coach-form-modal";

interface Props {
  coach: Coach | null;
  onDone: () => void;
}

const baseStatusOptions = [
  { label: STATUS_LABEL.draft, value: "draft" },
  { label: STATUS_LABEL.hidden, value: "hidden" },
];

export default function CoachForm({ coach, onDone }: Props) {
  const isEditing = coach !== null;
  // [المرحلة ٣] «ظاهر» خيارٌ لمدرّب قائم فقط: يُنشأ مخفياً ثم يُفتح بعد اكتمال تغطيته (الخادم يردّ 422 بالناقص)
  const statusOptions = isEditing
    ? [...baseStatusOptions, { label: STATUS_LABEL.visible, value: "visible" }]
    : baseStatusOptions;
  const isHouse = Boolean(coach?.is_house);
  const url = isEditing ? `/coaches/${coach!.id}` : "/coaches";

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });
  const queryClient = useQueryClient();

  const close = () => {
    const toggle = document.getElementById(COACH_MODAL_ID) as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
    onDone();
  };

  const onSubmit = async (values: any) => {
    const payload: Record<string, any> = {
      name: values.name,
      bio: values.bio ?? "",
      offering_id: values.offering_id ?? "",
    };
    if (!isHouse) {
      payload.revenue_share_pct = values.revenue_share_pct;
      payload.status = values.status;
    }
    if (values.image instanceof File) payload.image = values.image;

    try {
      await mutateAsync(payload as any);
      await queryClient.invalidateQueries("/coaches");
      if (isEditing) await queryClient.invalidateQueries(`/coaches/${coach!.id}`);
      close();
    } catch {
      // الرسالة من `onError` في `usePostQuery`.
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: coach?.name ?? "",
        bio: coach?.bio ?? "",
        offering_id: coach?.offering_id ?? "",
        revenue_share_pct: coach?.revenue_share_pct ?? 50,
        status: coach?.status ?? "draft",
        image: coach?.image ?? "",
      }}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-5">
          <UploadInput name="image" label="الصورة" />
          <Input name="name" label="الاسم" required />

          {!isHouse && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="revenue_share_pct"
                label="نسبة المدرب من الصافي (٪)"
                type={"number" as any}
                min={0}
                max={100}
                dir="ltr"
              />
              <Select name="status" label="الحالة" options={statusOptions} />
            </div>
          )}

          <Input
            name="offering_id"
            label="معرّف الـOffering في RevenueCat"
            dir="ltr"
            placeholder="coach_xxx"
          />
          <TextArea name="bio" label="نبذة" rows={4} />

          {!isHouse && (
            <p className="text-xs text-content-muted leading-relaxed">
              الحالة «ظاهر» تُفتح بعد اكتمال تغطية المدرب: ٦٠ خانة تمرين و١٢
              خانة تغذية ومعرّف Offering. حتى ذلك لا يراه أي مستخدم — وتفاصيل الناقص في صفحة المدرب.
            </p>
          )}

          <div className="flex gap-3">
            <Button primary onClick={submitForm} isLoading={isLoading}>
              حفظ
            </Button>
            <Button secondaryBorder type="button" onClick={close}>
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
