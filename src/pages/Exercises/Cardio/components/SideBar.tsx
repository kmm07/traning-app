import { Card, Img, Table, Text, TrhButton, UploadInput } from "components";
import TableActions from "components/Table/actions";
import { Form, Formik } from "formik";
import React from "react";
import { Row } from "react-table";

function SideBar() {
  const columns = React.useMemo(
    () => [
      {
        Header: "مستوى الشدة",
        accessor: "exercise",
      },
      {
        Header: "  ",
        Cell: ({ row }: { row: Row<any> }) => (
          <Text border="white" size="xs">
            {row.original.sessions}
          </Text>
        ),
      },
      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => (
          <TableActions
            onDelete={() => {
              console.log("🚀 ~ file: SideBar.tsx:93 ~ SideBar ~ row", row);
            }}
          />
        ),
      },
    ],
    []
  );
  return (
    <Formik
      initialValues={{
        image: "",
        note: "",
      }}
      onSubmit={() => {}}
    >
      <Form className="flex flex-col gap-10">
        <div className="flex gap-5 justify-between w-full">
          <div className="flex gap-5 ">
            <Img className="w-24 rounded-2xl" src="/images/Background5.4.png" />
            <div className="flex flex-col ">
              <Text size="3xl">دراجة </Text>
            </div>
          </div>
        </div>

        <Card className="flex  gap-5 p-4">
          <Text size="3xl">الصورة </Text>
          <hr />
          <UploadInput name="image" />
        </Card>
        <Table
          noPagination
          search={false}
          data={[
            {
              exercise: "التمرين",
              sessions: 3,
            },
          ]}
          columns={columns}
          modalTitle="اضافة "
          modalContent={<>dd</>}
        />
        <TrhButton onDelete={() => {}} />
      </Form>
    </Formik>
  );
}

export default SideBar;
