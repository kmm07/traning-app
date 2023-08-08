import { Table } from "components";
import React from "react";
import { useLoaderData } from "react-router-dom";

function Dashboard() {
  const data = useLoaderData() as {
    table: [];
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Friend Name",
        accessor: "friend.name", // accessor is the "key" in the data
      },
      {
        Header: "Friend Age",
        accessor: "friend.age",
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };
  return (
    <div className="w-full">
      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        title="جميع المستخدمين"
        btnTitle="اضافة مستخدم"
      />
    </div>
  );
}

export const dashboardLoader = async () => {
  return {
    table: [
      {
        name: "Tanner Linsley",
        age: 26,
        friend: {
          name: "Jason Maurer",
          age: 23,
        },
      },
    ],
  };
};

export default Dashboard;
