import { Table } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import React from "react";
import { UseQueryResult } from "react-query";

type Props = object;

// eslint-disable-next-line no-empty-pattern
export default function ContactsPage({}: Props) {
  // get users list ======================>
  const url = "/contacts";

  const { data: contacts = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: any }) => {
          return (
            <div className="flex items-center gap-4">{row.original.name}</div>
          );
        },
      },
      {
        Header: "بريد إلكتروني",
        accessor: "email",
      },

      {
        Header: "الهاتف",
        accessor: "phone",
      },

      {
        Header: "الرسالة",
        accessor: "message",
      },
    ],
    []
  );

  return (
    <div>
      <Table data={contacts ?? []} columns={columns} />
    </div>
  );
}
