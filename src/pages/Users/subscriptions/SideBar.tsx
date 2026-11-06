import { Button, Card, Img, Select, SubState, Text } from "components";
import DateInput from "components/dateInput";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import moment from "moment";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirm } from "components/ConfirmDialog/context";

const initialValues = {};

function UserSubscriptionsSideBar({ subscriptionData, userData }: any) {
  const confirm = useConfirm();
  const { id } = useParams();

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  // subscriptions actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    if (
      !(await confirm({
        title: "حذف اشتراك المستخدم؟",
        message:
          "المجانيّ يُحذف. والمدفوع **يبقى سجلّاً** ويسقط وصولُه فوراً — " +
          "فيظهر في القائمة بعد الحذف، وهو مقصود (الدليل الماليّ لا يُمحى).",
      }))
    ) {
      return;
    }

    try {
      await mutateAsync(`/user-subscriptions/${subscriptionData?.id}`);

      await queryClient.invalidateQueries(`/user-subscriptions?user_id=${id}`);

      onClose();
    } catch {
      // الرسالة من `useDeleteQuery.onError`.
    }
  };

  // قائمة الباقات لتغيير نوع الاشتراك — الاسم وحده يتكرّر بين المنصّتين، فيُلحَق به المستوى والمنصّة.
  const { data: plans = [] }: any = useGetQuery("/subscriptions", "/subscriptions", {
    select: ({ data }: { data: { data: any[] } }) =>
      data.data.map((item: any) => ({
        label: `${item?.name} — ${
          item?.tier === "premium" ? "مميزة" : "أساسية"
        } · ${item?.platform === "ios" ? "آيفون" : "أندرويد"}`,
        value: item?.id,
      })),
  });

  const url = `/user-subscriptions/${subscriptionData?.id}`;

  const { mutateAsync: editSubscription, isLoading: isEditLoading } =
    usePostQuery({
      url,
    });

  /**
   * صفُّ التجربة (`FREE`) لا `subscription_id` له — و`UserSubscriptionResource`
   * يُخرجه **`0`** (`?? 0`) بينما `update` يشترط `exists:subscriptions,id`
   * ⇒ **422 مضمونة**. ومداه ليس حالةً طرفية: **2459 من 3162 صفّاً (٧٨٪)**
   * على الإنتاج بلا `subscription_id`.
   *
   * ⛔ ولا يُعالَج بجعل الحقل اختيارياً في الخادم — `expire_date` على صفّ
   * `FREE` **بلا أثرٍ على الوصول عمداً** (منصوصٌ في `app/Support/FreeGate.php`:
   * التجربة تنتهي بالإنجاز أو بالسقف الزمنيّ، لا بذلك العمود) ⇒ «إصلاحُه»
   * كان يبني زرّاً يكتب عموداً لا يقرؤه قرارُ وصولٍ واحد.
   */
  const isTrialRow = !Number(subscriptionData?.subscription_id);

  /**
   * [٣١ أكتوبر ٢٠٢٦] صفُّ متجرٍ (آبل/جوجل عبر RevenueCat) للقراءة فقط — مزامنةُ المتجر تكتب فوقه عند أوّل
   * حدث، فكان تعديلُه يردّ «تم الحفظ» ثم يُمحى بصمت (مقيسٌ على 2420). والخادم يردّه 422
   * `store_managed_subscription`؛ والتمديدُ بـ«إضافة اشتراك» (صفٌّ يدويّ لا تلمسه المزامنة).
   */
  const isStoreRow = Boolean(subscriptionData?.store_managed);
  const storeName = subscriptionData?.store === "android" ? "جوجل بلاي" : "آب ستور";
  const readOnly = isTrialRow || isStoreRow;

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    if (isStoreRow) {
      toast.info(`اشتراك ${storeName} يُدار من المتجر ولا يُعدَّل هنا. لتمديد وصول المستخدم استعمل «إضافة اشتراك».`);
      return;
    }

    if (isTrialRow) {
      toast.info(
        "صفُّ التجربة لا يُعدَّل — تنتهي التجربة بإتمام اليوم الأول أو بمضيّ سقفها الزمنيّ، لا بهذا التاريخ."
      );
      return;
    }

    try {
      /**
       * ⛔ **الحمولة تُبنى ولا تُعاد.** كانت `{...values}` تردّ إلى الخادم كلَّ
       * ما وصلها من `UserSubscriptionResource` — ومنه **`status`** وهو
       * **قيمةُ عرضٍ** (`SUBSCRIPED`/`CANCELED`/`FREE`) لا حالةَ قاعدة، بينما
       * `update` يشترط `Rule::in(GRANTS_ACCESS)` ⇒ **422 على كل صفّ**.
       *
       * ⚖️ والحارس الخادميّ **سليمٌ ومقصود** (BUG-73: يمنع إحياء اشتراكٍ
       * منتهٍ بتصحيح تاريخ)، والعطل في شكل الحمولة وحده. و`status` **اختياريٌّ
       * بالتصميم** («الغياب = لا تغيّر» — منصوصٌ في المتحكّم)، وهذه الشاشة
       * **لا تعرض له عنصر تحكّم أصلاً** (`SubState` عرضٌ لا إدخال) ⇒ إسقاطُه
       * هو التعبير الصحيح عن نيّة الشاشة لا التفافٌ على الحارس.
       */
      await editSubscription({
        subscription_id: Number(values.subscription_id),
        start_date: moment(new Date(values.start_date)).format("YYYY-MM-DD"),
        expire_date: moment(new Date(values.expire_date)).format("YYYY-MM-DD"),
        _method: "PUT",
      } as any);

      helpers.resetForm();

      onClose();

      await queryClient.invalidateQueries(`/user-subscriptions?user_id=${id}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "تعذّر حفظ الاشتراك — راجع الاتصال."
      );
    }
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...subscriptionData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <Form className="flex flex-col gap-10">
          <Card className="p-6">
            <div className="flex items-center gap-8">
              <Img src={userData?.src} alt="user image" />
              <div>
                <Text as="h5">{userData.name}</Text>
                <Text as="h5">id:{userData.id}</Text>
              </div>
            </div>
          </Card>

          <Card className="px-10 py-6 flex flex-col gap-8">
            {!readOnly && (
              <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2 gap-4">
                <Text as="h5">نوع الإشتراك</Text>
                <div className="w-2/3">
                  <Select name="subscription_id" options={plans ?? []} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ البداية</Text>
              <div className="w-1/4">
                {isStoreRow ? <Text as="p">{subscriptionData?.start_date}</Text> : <DateInput name="start_date" isForm />}
              </div>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ النهاية</Text>

              <div className="w-1/4">
                {isStoreRow ? <Text as="p">{subscriptionData?.expire_date}</Text> : <DateInput name="expire_date" isForm />}
              </div>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">حالة الإشتراك</Text>
              <SubState state={String(subscriptionData.status ?? "").toLowerCase() as any} />
            </div>

            {/*
              ⚠️ يُقال للمدرّب صراحةً بدل أن يضغط «حفظ» فيصمت الزرّ. وصفُّ
              التجربة ليس حالةً نادرة — **٧٨٪ من الصفوف**.
            */}
            {isTrialRow && (
              <Text
                as="p"
                size="sm"
                /* ⚠️ `Text` يخبز `whitespace-nowrap w-fit` في صنفه الأساس
                   ⇒ نصٌّ من سطرين يفيض بلا `!whitespace-normal`. */
                className="!whitespace-normal !w-full !text-yellow-400 leading-relaxed"
              >
                صفُّ تجربةٍ — تاريخاه سجلٌّ لا بوّابة، ولا يُعدَّلان من هنا.
                تنتهي التجربة بإتمام اليوم الأول أو بمضيّ سقفها الزمنيّ.
              </Text>
            )}
            {isStoreRow && (
              <Text
                as="p"
                size="sm"
                className="!whitespace-normal !w-full !text-yellow-400 leading-relaxed"
              >
                اشتراك {storeName} — يديره المتجر عبر RevenueCat، وأيّ تعديلٍ هنا يُمحى عند أوّل مزامنة.
                لتمديد وصول المستخدم استعمل «إضافة اشتراك» من صفحة اشتراكاته.
              </Text>
            )}
          </Card>

          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              onClick={submitForm}
              isLoading={isEditLoading}
              disabled={readOnly}
            >
              حفظ
            </Button>
            <Button className="w-[100px]" primary onClick={onClose}>
              إلغاء
            </Button>
            <Button
              className="w-[100px]"
              danger
              onClick={onDeleteItem}
              isLoading={isLoading}
            >
              حذف
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UserSubscriptionsSideBar;
