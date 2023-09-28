import { Button, Modal, Table } from "components";
import TableActions from "components/Table/actions";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { Row } from "react-table";
import { toast } from "react-toastify";
import AddAdmin from "./components/addAdmin";

export default function Admin() {
  const [admins, setAdmins] = useState<any>();

  // get exercises categories ======================>
  const url = "/admins";

  const { data: admin = [], isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  // admin actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    try {
      await mutateAsync(`/admins/${id}`);

      await queryClient.invalidateQueries("/admins");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEdit = async (value: any) => {
    await setAdmins(value);
    document.getElementById("add-new-admins")?.click();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الإسم",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },

      {
        Header: "ايمال",
        accessor: "email",
      },

      {
        Header: " ",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <TableActions
              onDelete={() => onDelete(row.original.id)}
              onEdit={() => onEdit(row.original)}
            />
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      {!isLoading ? (
        admin.length !== 0 ? (
          <Table
            data={admin ?? []}
            columns={columns}
            modalTitle="اضافة مسؤل جديد"
            modalContent={
              <AddAdmin adminsData={admins} setAdminsData={setAdmins} />
            }
            id="add-new-admins"
          />
        ) : (
          <>
            <Modal id="add-new-admins">
              <AddAdmin adminsData={admins} setAdminsData={setAdmins} />
            </Modal>

            <div
              className="flex justify-center"
              onClick={() => document.getElementById("add-new-admins")?.click()}
            >
              <Button secondaryBorder>إضافة إشتراك</Button>
            </div>
          </>
        )
      ) : (
        <>loading...</>
      )}
    </div>
  );
}
