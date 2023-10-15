import {
  Button,
  Img,
  Input,
  Select,
  Text,
  TextArea,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const initialValues = {
  title: "",
  description: "",
  details: [],
  users: [],
  image: "",
};

function AddNotification({ active }: { active: number }) {
  const [detail, setDetail] = useState<string>("");

  // get users data =================>
  const usersURL = "/users";

  const { data: users, isLoading: isUsersLoading }: UseQueryResult<any> =
    useGetQuery(usersURL, usersURL, {
      select: ({ data }: { data: { data: { users: [] } } }) =>
        data.data.users?.map((user: any) => ({
          label: user.name,
          value: user.id,
        })),
    });

  // on send notify ========================>

  const queryClient = useQueryClient();

  const url = "/notifications";

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    const formattedData = Object.entries(values);

    formattedData.forEach((value) => {
      if (!["users", "details"].includes(value[0])) {
        formData.append(value[0], value[1] as any);
      }

      if (value[0] === "users") {
        (value[1] as any).forEach((val: any, index: number) =>
          formData.append(`users[${index}]`, val)
        );
      }

      if (value[0] === "details") {
        (value[1] as any).forEach((val: any, index: number) =>
          formData.append(`details[${index}]`, val)
        );
      }
    });

    formData.append("private", active as any);

    try {
      await mutateAsync(formData as any);

      Helpers.resetForm();

      setDetail("");

      await queryClient.invalidateQueries("/notifications");

      document.getElementById("add-notification")?.click();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onDeleteDetails = (
    setFieldValue: any,
    values: any,
    deletedDetail: any
  ) => {
    const filteredArray = values.details.filter(
      (detail: any) => detail !== deletedDetail
    );

    setFieldValue("details", filteredArray);
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize
    >
      {({ values, setFieldValue, submitForm, resetForm }) => (
        <Form className="space-y-8">
          <UploadInput name="image" label="الصورة" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="title" label="العنوان" />

            <Input name="description" label="الوصف" />
          </div>
          {active === 1 && (
            <Select
              name="users"
              options={users ?? []}
              isLoading={isUsersLoading}
              isForm={false}
              isMulti
              label="المستخدمين"
              onChange={(val: any) => {
                setFieldValue(
                  "users",
                  val.map((user: any) => user.value)
                );
              }}
            />
          )}

          {/* <CheckBox name="private" label="إشعار خاص" /> */}

          <div>
            <Text as="h3">إضافة التفاصيل</Text>
            <TextArea
              name="detail-text"
              className="font-bold !w-full mt-4 border-[1px] border-primary-100"
              isForm={false}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setFieldValue("details", [...values.details, detail]);

                setDetail("");
              }}
            >
              إضافة
            </button>
          </div>

          {values.details.map((detail) => (
            <div>
              <span className="font-bold">{detail}</span>
              <button
                onClick={() => onDeleteDetails(setFieldValue, values, detail)}
              >
                <Img src="/images/trash.svg" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              className="w-[100px]"
              primary
              isLoading={isLoading}
              onClick={submitForm}
            >
              {"حفظ"}
            </Button>
            <Button
              className="w-[100px]"
              secondaryBorder
              onClick={() => {
                resetForm();
                document.getElementById("add-notification")?.click();
              }}
            >
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddNotification;
