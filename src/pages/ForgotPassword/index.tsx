import React, { useState } from "react";
import { Button, Input } from "components";
import AuthShell from "pages/_shared/AuthShell";
import { Form, Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import customAxios from "util/axios";
import setFieldsError from "util/setFieldsError";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

/**
 * استعادة كلمة مرور المدير — الصفحة التي كان رابطها ميتاً.
 *
 * كانت صفحة الدخول تحمل <Link to="/forgot-password"> منذ الأزل، و`/forgot-password`
 * **بلا مسارٍ في الراوتر وبلا مسارٍ في الخادم** — تَعِد بشيء لا وجود له.
 *
 * خطوتان في صفحةٍ واحدة لا صفحتين: الرمز عمرُه ٣٠ دقيقة، والانتقال بين
 * مسارين يفقد البريد المُدخَل فيُعاد إرسال رمزٍ ثانٍ يُبطل الأول.
 */
interface FormValue {
  email: string;
  verification_code: string;
  password: string;
  password_confirmation: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const push = useNavigate();

  const onSubmit = async (
    values: FormValue,
    helpers: FormikHelpers<FormValue>
  ) => {
    setIsLoading(true);

    try {
      if (!codeSent) {
        await customAxios().post("/forget-password-step1", {
          email: values.email,
        });
        setCodeSent(true);
        toast.success("أرسلنا رمز التحقق إلى بريدك");
      } else {
        await customAxios().post("/forget-password-step2", {
          email: values.email,
          verification_code: values.verification_code,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        toast.success("تم تغيير كلمة السر");
        push("/");
      }
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
      setFieldsError(error, helpers);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        verification_code: "",
        password: "",
        password_confirmation: "",
      }}
      onSubmit={onSubmit}
    >
      <Form>
        <AuthShell
          title="استعادة كلمة المرور"
          subtitle={
            codeSent
              ? "أدخل الرمز الذي أرسلناه إلى بريدك، ثم كلمة المرور الجديدة."
              : "أدخل بريد حسابك وسنرسل إليه رمز استعادة صالحاً ٣٠ دقيقة."
          }
          footer={
            <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <Link
                to="/"
                className="text-sm text-content-muted hover:text-brand-400 transition-colors"
              >
                العودة لتسجيل الدخول
              </Link>

              {codeSent && (
                <button
                  type="button"
                  onClick={() => setCodeSent(false)}
                  className="text-sm text-content-muted hover:text-brand-400 transition-colors"
                >
                  البريد خاطئ؟
                </button>
              )}
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <Input
              required
              label="البريد الإلكتروني"
              name="email"
              type="email"
              inputSize="large"
              placeholder="you@example.com"
              autoComplete="email"
              dir="ltr"
              className="!text-start"
              disabled={codeSent}
            />

            {codeSent && (
              <>
                <Input
                  required
                  label="رمز الاستعادة"
                  name="verification_code"
                  inputSize="large"
                  placeholder="٦ أرقام"
                  dir="ltr"
                  className="!text-start tracking-[0.4em]"
                />

                <Input
                  required
                  label="كلمة المرور الجديدة"
                  name="password"
                  type="password"
                  inputSize="large"
                  placeholder="٨ محارف على الأقل"
                  autoComplete="new-password"
                />

                <Input
                  required
                  label="تأكيد كلمة المرور"
                  name="password_confirmation"
                  type="password"
                  inputSize="large"
                  placeholder="أعد كتابتها"
                  autoComplete="new-password"
                />
              </>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              primary
              size="large"
              className="w-full mt-2"
            >
              {codeSent ? "تعيين كلمة المرور" : "إرسال رمز الاستعادة"}
            </Button>
          </div>
        </AuthShell>
      </Form>
    </Formik>
  );
};

export default ForgotPasswordPage;
