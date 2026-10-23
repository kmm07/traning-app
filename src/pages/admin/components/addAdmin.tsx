import { Button, Input } from "components";
import { Field } from "formik";
import usePermissions from "hooks/usePermissions";
import { Form, Formik, FormikHelpers } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

interface Props {
  adminsData?: any;
  setAdminsData?: any;
}

/** أقسامُ حساب المدرّب — ما يبلغه الخادمُ في وضعه (ما سواها يُرفض له أصلاً). */
const COACH_SECTIONS = ["users", "messages", "training", "nutrition"];

const initialValues = {
  name: "",
  email: "",
  password: "",
  permissions: [] as string[],
  is_super: false,
  // [المرحلة ٤] نوعُ الحساب ونطاقُه
  type: "admin" as "admin" | "coach",
  coach_id: "" as string | number,
  access_level: "full" as "full" | "read",
  scope_mode: "all" as "all" | "selected",
  scope_coach_ids: [] as string[],
};

/*
 * إضافةُ حساب لوحة: **مسؤولٌ** أم **مدرّب**.
 *
 * • مدرّب: يُختار من المدرّبين المضافين سلفاً (لذلك يُضاف المدرّبُ أولاً ثم يُنشأ له وصول) — ويُحدَّد له
 *   «وصولٌ كامل» أو «قراءةٌ فقط». ويرى مشتركيه ومحتواه وحدهما.
 * • مسؤول: أقسامٌ تختارها، ومعها إمّا **كلُّ شيء** (كما هو اليوم) أو **مدرّبون بأعيانهم** يشرف عليهم.
 *
 * ⛔ كلمة السرّ ينشئها خالد؛ للمدرّب أن يغيّرها أو يبقيها (صفحة «ملخّصي»).
 */
const AddAdmin = ({ adminsData = null, setAdminsData }: Props) => {
  const isEditing = adminsData !== null;
  const { sections, isSuper } = usePermissions();

  const url = isEditing ? `/admins/${adminsData?.id}` : "/admins";

  const { mutateAsync, isLoading: isAddLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  // قائمةُ المدرّبين لاختيار مدرّب الحساب ولقائمة الإشراف
  const { data: coaches = [] } = useGetQuery("/coaches", "/coaches", {
    select: ({ data }: any) => data.data,
    enabled: isSuper,
  }) as unknown as { data: Array<{ id: number; name: string; is_house: boolean }> };

  const onClose = () => {
    document.getElementById("add-new-admins")?.click();
    setAdminsData(null);
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    if (values.type === "coach" && !values.coach_id) {
      toast.error("اختر المدرّب الذي يُنشأ له الوصول");
      return;
    }
    if (values.type === "admin" && values.scope_mode === "selected" && values.scope_coach_ids.length === 0) {
      toast.error("اختر مدرّباً واحداً على الأقل للإشراف");
      return;
    }

    const body: any = { ...values };
    // مربّعُ الرتبة العليا للمسؤول وحده — حسابُ المدرّب لا يكون أعلى
    if (values.type === "coach") {
      body.is_super = false;
      delete body.scope_mode;
      delete body.scope_coach_ids;
    } else {
      delete body.coach_id;
      delete body.access_level;
      if (values.scope_mode !== "selected") delete body.scope_coach_ids;
    }

    try {
      await mutateAsync(isEditing ? { ...body, _method: "PUT" } : body);

      helpers.resetForm();
      onClose();
      queryClient.invalidateQueries("/admins");
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  const editing = adminsData
    ? {
        ...adminsData,
        permissions: adminsData.permissions ?? [],
        is_super: Boolean(adminsData.is_super),
        type: adminsData.type ?? "admin",
        coach_id: adminsData.coach_id ?? "",
        access_level: adminsData.access_level ?? "full",
        scope_mode: adminsData.scope_mode ?? "all",
        scope_coach_ids: (adminsData.scope_coach_ids ?? []).map(String),
      }
    : {};

  return (
    <Formik
      initialValues={{ ...initialValues, ...editing }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm, values, setFieldValue }) => {
        const sectionList = Object.entries(sections).filter(
          ([key]) => values.type !== "coach" || COACH_SECTIONS.includes(key)
        );

        return (
          <Form className="flex flex-col gap-6">
            <Input name="name" label="الإسم" />

            <Input name="email" label="البريد الالكتروني" />
            <Input
              dir="ltr"
              type="password"
              name="password"
              label={isEditing ? "كلمّة المرور (اتركها فارغة لعدم التغيير)" : "كلمّة المرور"}
            />

            {isSuper && (
              <div className="flex flex-col gap-4 border-t border-blue_gray-900_01 pt-4">
                {/* ── نوعُ الحساب ─────────────────────────────────── */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">نوع الحساب</p>
                  <div className="flex gap-2">
                    {([["admin", "مسؤول"], ["coach", "مدرّب"]] as const).map(([val, label]) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => {
                          setFieldValue("type", val);
                          if (val === "coach") {
                            setFieldValue("is_super", false);
                            setFieldValue(
                              "permissions",
                              (values.permissions as string[]).filter((p) => COACH_SECTIONS.includes(p))
                            );
                          }
                        }}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold ${
                          values.type === val ? "bg-brand-400 text-ink-900" : "bg-ink-800 text-content-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── مدرّب: أيُّ مدرّب · ووصوله ─────────────────── */}
                {values.type === "coach" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">
                        المدرّب (يجب أن يكون مضافاً سلفاً من صفحة «المدربون»)
                      </p>
                      <Field as="select" name="coach_id" className="w-full rounded-lg bg-ink-800 border border-line px-3 py-2 text-sm">
                        <option value="">— اختر —</option>
                        {coaches.filter((c) => !c.is_house).map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Field>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-2">الوصول</p>
                      <div className="flex gap-2">
                        {([["full", "كامل — يعرض ويعدّل"], ["read", "قراءة فقط — يستعرض ويراسل"]] as const).map(([val, label]) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setFieldValue("access_level", val)}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              values.access_level === val ? "bg-brand-400 text-ink-900 font-bold" : "bg-ink-800 text-content-muted"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── مسؤول: رتبةٌ عليا؟ ونطاقُ الإشراف ───────────── */}
                {values.type === "admin" && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Field type="checkbox" name="is_super" className="w-4 h-4" />
                      <span className="text-white text-sm font-bold">
                        مدير أعلى — كل الصلاحيات، ويمنحها لغيره
                      </span>
                    </label>

                    {!values.is_super && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">يشرف على</p>
                        <div className="flex gap-2 mb-2">
                          {([["all", "كل المستخدمين والمحتوى"], ["selected", "مدرّبون بأعيانهم"]] as const).map(([val, label]) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setFieldValue("scope_mode", val)}
                              className={`px-4 py-2 rounded-lg text-sm ${
                                values.scope_mode === val ? "bg-brand-400 text-ink-900 font-bold" : "bg-ink-800 text-content-muted"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        {values.scope_mode === "selected" && (
                          <div className="grid grid-cols-2 gap-2">
                            {coaches.map((c) => (
                              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                                <Field type="checkbox" name="scope_coach_ids" value={String(c.id)} className="w-4 h-4" />
                                <span className="text-white text-sm">{c.is_house ? "المنصّة (خالد)" : c.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* ── الأقسام ─────────────────────────────────────── */}
                {!(values.type === "admin" && values.is_super) && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      {values.type === "coach"
                        ? "الأقسام المتاحة له (يراها لمشتركيه ومحتواه فقط):"
                        : "الأقسام المسموحة (تُتجاهَل للمدير الأعلى — يملكها كلها):"}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {sectionList.map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <Field type="checkbox" name="permissions" value={key} className="w-4 h-4" />
                          <span className="text-white text-sm">{label as string}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                onClick={submitForm}
                isLoading={isAddLoading}
              >
                حفظ
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export default AddAdmin;
