import React, { useState } from "react";
import { Button, CheckBox, Input } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useRedux";
import { setCredentials } from "redux/slices/auth";
import customAxios from "util/axios";
import setFieldsError from "util/setFieldsError";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";
import AuthShell from "pages/_shared/AuthShell";

export interface FormValue {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * شاشةُ الدخول — أوّلُ ما يُرى من اللوحة.
 *
 * ⚖️ **ومنطقُ الدخول لم يُمَسّ بحرف**: نفسُ المسار (`/login`) ونفسُ الحمولة
 * ونفسُ حفظ `userLogin` في `localStorage` ونفسُ فروع الأخطاء (400 · 412).
 * المتبدّلُ لغةُ الشاشة وشكلُها وحدهما.
 */
const SignInPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const URL = "/login";

  const onSubmit = async (
    values: FormValue,
    helpers: FormikHelpers<FormValue>
  ) => {
    setIsLoading(true);

    try {
      const { data } = await customAxios().post(URL, values);

      await dispatch(setCredentials(data.data));

      localStorage.setItem("userLogin", JSON.stringify(data.data));

      setIsLoading(true);

      push("/dashboard");
    } catch (error: any) {
      if (error.response.status === 400) {
        console.error(apiErrorMessage(error));
      } else if (error.response.status === 412) {
        void push("/unauthenticated");
      } else {
        console.log("Login Failed");
      }
      setIsLoading(false);
      toast.error(apiErrorMessage(error));
      setFieldsError(error, helpers);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        remember: false,
      }}
      onSubmit={onSubmit}
    >
      <Form>
        <AuthShell
          title="تسجيل الدخول"
          subtitle="أدخل بريدك وكلمة مرورك للوصول إلى لوحة المدرب."
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
            />

            <Input
              required
              label="كلمة المرور"
              name="password"
              type="password"
              inputSize="large"
              placeholder="٨ محارف على الأقل"
              autoComplete="current-password"
            />

            <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CheckBox name="remember" label="أبقني مسجَّلاً" />

              <Link
                to="/forgot-password"
                className="text-sm text-content-muted hover:text-brand-400 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              primary
              size="large"
              className="w-full mt-2"
            >
              دخول
            </Button>
          </div>
        </AuthShell>
      </Form>
    </Formik>
  );
};

export default SignInPage;
