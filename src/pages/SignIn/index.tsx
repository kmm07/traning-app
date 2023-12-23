import React, { useState } from "react";
import { Button, CheckBox, Img, Input, Text } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useRedux";
import { setCredentials } from "redux/slices/auth";
import customAxios from "util/axios";
import setFieldsError from "util/setFieldsError";
import { toast } from "react-toastify";

export interface FormValue {
  email: string;
  password: string;
  remember: boolean;
}

const SignInPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const push = useNavigate();
  // const URL = "/login";
  const onSubmit = async (
    values: FormValue,
    helpers: FormikHelpers<FormValue>
  ) => {
    setIsLoading(true);

    try {
      const { data } = await customAxios().post("/login", values);

      await dispatch(setCredentials(data.data));

      localStorage.setItem("userLogin", JSON.stringify(data.data));

      setIsLoading(true);

      push("/dashboard");
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log(error.response.data.message);
      } else if (error.response.status === 412) {
        void push("/unauthenticated");
      } else {
        console.log("Login Failed");
      }
      setIsLoading(false);
      toast.error(error.response.data.message);
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
      <Form
        dir="ltr"
        className="bg-gray-900_09 h-screen flex sm:flex-col md:flex-col flex-row   sm:gap-10 md:gap-10 items-center justify-between w-full"
      >
        <div className="flex flex-col justify-center h-full w-1/2">
          <div className="w-1/2 mx-auto flex flex-col gap-14">
            <div className="flex flex-col gap-[10px] items-start justify-start md:ml-[0] ml-[7px]">
              <Text size="4xl" bold>
                Sign In
              </Text>
              <Text primary>Enter your email and password to sign in!</Text>
            </div>
            <div className="flex flex-col items-start justify-start w-full">
              <div className="flex flex-col gap-2.5 items-start justify-start mt-[21px] w-full">
                <Input
                  required
                  label="email"
                  name="email"
                  inputSize="large"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-2.5 items-start justify-start mt-[21px] w-full">
                <Input
                  required
                  label="Password"
                  name="password"
                  type="password"
                  inputSize="large"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className="flex flex-row items-center justify-between mt-[33px] w-[96%] md:w-full">
                <CheckBox name="remember" label="Keep me logged in" />

                <div className="flex flex-col items-center justify-start">
                  <Text className="text-sm text-white tracking-[-0.28px]">
                    <Link to="/forgot-password">Forget password?</Link>
                  </Text>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start mt-[31px] w-full">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  primary
                  className="cursor-pointer font-bold h-[54px] py-[17px]    tracking-[-0.28px] w-[410px]"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full relative w-1/2">
          <div className="h-full m-auto w-full">
            <Img
              className="h-full m-auto object-cover rounded-bl-[200px] w-full"
              src="/images/Background5.4.png"
              alt="backgroundFiftyFour"
            />
            <div className="absolute w-1/2 border-2 border-solid border-white-A700_33 bottom-[29%] flex flex-col inset-x-[0] items-center justify-end mx-auto p-8 sm:px-5 rounded-lg">
              <Text size="4xl">تطبيق المرب الشخصي</Text>
            </div>
          </div>
          <Img
            className="absolute h-[393px] inset-x-[0] mx-auto object-cover top-[16%] w-[66%]"
            src="/images/img_imageedit2816.png"
            alt="imageedit2816"
          />
        </div>
      </Form>
    </Formik>
  );
};

export default SignInPage;
