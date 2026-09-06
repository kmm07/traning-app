import { Button, Card, Input, Text } from "components";
import { usePutQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Field, Form, Formik } from "formik";
import { apiErrorMessage } from "util/apiError";
import { toast } from "react-toastify";

/**
 * تحريرُ صنفٍ من **كتالوج الأطعمة المستورد** — لا من كتالوج المدرّب.
 *
 * 🔴 **لماذا درجٌ ثانٍ لا فرعٌ في الأوّل:** الصفّان لا يتقاسمان حقولاً بل
 * جدولين. `SideBar` يحرّر `meal_ingredients` (سكر · دهونٌ متحوّلة · حصّةٌ
 * مرجعية · صورة · فئة · حذف) و**لا شيء من ذلك يوجد في المصدر المستورد**:
 * أساسُه ١٠٠ جم/مل ثابتاً وقيمُه أربع. فنموذجٌ واحد بحقولٍ نصفُها معطَّل
 * يعرض للمدرّب خاناتٍ لا تفعل شيئاً — وهو ما يُقرأ عطلاً.
 *
 * ⛔ **وثلاثةٌ تُعرض ولا تُحرَّر بقصد:** الباركود (مفتاحُ المسح) · ونوعُ الصنف
 * (محورُ فصل الأدوار) · والظهورُ (للعدسة قرارُها). والخادمُ يتجاهلها إن
 * أُرسلت — بحارسٍ يقيس ذلك، لا بثقةٍ في النموذج.
 */

interface Props {
  /** صفُّ القائمة كما وصل — يحمل `food_item_id` وهو المعرّفُ الحقيقيّ */
  data: any;
  /** مفتاحُ استعلام القائمة كي تُبطَل بعد الحفظ */
  listKey: string;
}

const CONFIDENCE: Record<string, string> = {
  high: "مؤكَّدة",
  medium: "متوسّطة",
  estimate: "تقديرية",
};

/**
 * ⚖️ **الفراغُ يُرسَل `null` لا `""` ولا صفراً — والتمييزُ دلاليّ.**
 * المصدرُ يفرّق «بلا قيمةٍ معلومة» (`NULL`) عن «صفرٍ مقيس» (ماء · شاي سادة).
 * فحقلٌ يُفرّغه المدرّب يعني «لا أعرف» لا «صفر سعرة».
 */
const orNull = (v: unknown) =>
  v === "" || v === undefined || v === null ? null : v;

function FoodItemSideBar({ data, listKey }: Props) {
  const queryClient = useQueryClient();

  const onClose = () => document.getElementById("my-drawer")?.click();

  const { mutateAsync, isLoading } = usePutQuery({
    url: `/food-items/${data?.food_item_id}`,
    contentType: "application/json",
  });

  const onSubmit = async (values: any) => {
    try {
      await mutateAsync({
        name: values.name,
        brand: orNull(values.brand),
        calories: orNull(values.calories),
        protein: orNull(values.protein),
        carbohydrate: orNull(values.carbohydrate),
        fat: orNull(values.fat),
        serving_basis: values.serving_basis === "100ml" ? "100ml" : "100g",
      });

      await queryClient.invalidateQueries(listKey);

      onClose();
    } catch (error: any) {
      // 422 يصل بنصٍّ عربيٍّ يسمّي الحقل — يُعرض كما هو ولا يُستبدل بعامّ
      toast.error(apiErrorMessage(error));
    }
  };

  const initial = {
    name: data?.name ?? "",
    brand: data?.brand ?? "",
    calories: data?.calories ?? "",
    protein: data?.protein ?? "",
    carbohydrate: data?.carbohydrate ?? "",
    fat: data?.fat ?? "",
    serving_basis: data?.serving_basis === "100ml" ? "100ml" : "100g",
  };

  const chips = [
    data?.item_type_label,
    data?.code ? `باركود ${data.code}` : null,
    data?.confidence ? `الدقّة: ${CONFIDENCE[data.confidence] ?? data.confidence}` : null,
  ].filter(Boolean);

  return (
    <Formik initialValues={initial} onSubmit={onSubmit} enableReinitialize>
      <Form className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Input name="name" className="font-bold !text-2xl" />

          <div className="flex flex-wrap gap-2">
            {chips.map((c: any) => (
              <span
                key={c}
                className="text-xs px-2 py-[2px] rounded-full border border-sky-400 text-sky-400 whitespace-nowrap"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <Text as="h5" className="mb-4">
            {data?.basis_label ?? "القيم لكل ١٠٠ جم"}
          </Text>

          <div className="grid grid-cols-4 gap-6">
            {["السعرات", "البروتين", "الكاربوهيدرات", "الدهون"].map((t) => (
              <Text as="h5" key={t} className="!text-center w-full">
                {t}
              </Text>
            ))}
          </div>

          <div className="my-4 h-[4px] bg-primary" />

          <div className="grid grid-cols-4 gap-6">
            <Input name="calories" className="text-center font-bold" />
            <Input name="protein" className="text-center font-bold" />
            <Input name="carbohydrate" className="text-center font-bold" />
            <Input name="fat" className="text-center font-bold" />
          </div>

          {/* ⚠️ يُقال صراحةً لا يُترك ليُكتشف: خانةٌ فارغة ليست صفراً */}
          <p className="mt-4 text-sm text-gray-400 leading-6">
            اترك الخانة فارغةً إن كانت القيمة مجهولة — <b>الفراغ ليس صفراً</b>.
            وتصحيحُ أيّ قيمةٍ يرفع دقّةَ الصنف إلى «مؤكَّدة».
          </p>
        </Card>

        <Card className="px-4 pb-4">
          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">العلامة التجارية</Text>
            <div className="w-[220px]">
              <Input
                name="brand"
                className="border rounded-full px-6 py-2 text-center border-[#CFFF0F]"
              />
            </div>
          </div>

          <div className="flex justify-between p-4 border-b">
            <Text size="3xl">أساس القيم</Text>
            <div className="w-[220px]">
              {/* ⛔ `Select` المشترك يثبّت `<Field name="department">` في جسمه
                  فلا يربط اسمَه — وقائمةٌ من خيارين لا تستحقّ إصلاحه هنا. */}
              <Field
                as="select"
                name="serving_basis"
                className="w-full bg-transparent border rounded-full px-6 py-2 text-center border-[#CFFF0F] text-white"
              >
                <option className="text-black" value="100g">لكل ١٠٠ جم</option>
                <option className="text-black" value="100ml">لكل ١٠٠ مل</option>
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-evenly mt-6">
            <Button className="w-[120px]" primary type="submit" isLoading={isLoading}>
              حفظ
            </Button>
            <Button className="w-[120px]" primary onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </Card>
      </Form>
    </Formik>
  );
}

export default FoodItemSideBar;
