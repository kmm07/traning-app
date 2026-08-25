import { Button, Card, Img, SubState, Text } from "components";
import DateInput from "components/dateInput";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
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

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
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
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ البداية</Text>
              <div className="w-1/4">
                <DateInput name="start_date" isForm />
              </div>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">تاريخ النهاية</Text>

              <div className="w-1/4">
                <DateInput name="expire_date" isForm />
              </div>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-gray-400 pb-2">
              <Text as="h5">حالة الإشتراك</Text>
              <SubState state={subscriptionData.status} />
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
          </Card>

          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              onClick={submitForm}
              isLoading={isEditLoading}
              disabled={isTrialRow}
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
