import { Button, Card, Img, Input, Table, Text } from "components";
import TableActions from "components/Table/actions";
import { Form, Formik } from "formik";
import React from "react";
import { Row } from "react-table";

function SideBar() {
  const columns = React.useMemo(
    () => [
      {
        Header: "التمرين",
        accessor: "exercise",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex text-white items-center gap-4">
              <div className="w-8 h-">
                <img src="/images/img_rectangle347.png" />
              </div>
              {row.original.name}
            </div>
          );
        },
      },
      {
        Header: "الجلسات",
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
            onEdit={() => {
              console.log("🚀 ~ file: SideBar.tsx:89 ~ SideBar ~ row", row);
            }}
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
        restTime: 0,
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form className="flex flex-col gap-10">
        <div className="flex gap-5">
          <Img className="w-24 rounded-2xl" src="/images/Background5.4.png" />
          <div className="flex flex-col ">
            <Text size="3xl">اليوم الاول</Text>
            <Text size="3xl">علوي</Text>
          </div>
        </div>
        <Card className="flex flex-col gap-5 p-4">
          <Text size="3xl">هدف اليوم </Text>
          <Text size="3xl" lime>
            هدف اليوم التركيز على القوة والتحمل
          </Text>
        </Card>
        <Card className="px-4 pb-4">
          <div className="flex justify-between py-3">
            <Text size="3xl">المكونات</Text>
            <Text size="sm" border="primary">
              عدد التمارين {1}
            </Text>
          </div>
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
            modalTitle="اضافة تمرين"
            modalContent={<>dd</>}
          />
          <div className="my-3 flex  w-full items-center px-10">
            <span className="flex-1">
              <Text size="xl">وقت الراحة</Text>
            </span>
            <span className="flex items-center gap-5">
              <Text size="xl">ثانية</Text>
              <Input name="rest-time" className="!w-fit" />
            </span>
          </div>
          <hr className=" border-gray-500 my-3" />
          <Button>
            اضافة <Img src="/images/plus.svg" />
          </Button>
        </Card>
      </Form>
    </Formik>
  );
}

export default SideBar;
