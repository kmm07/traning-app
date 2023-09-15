import React from "react";
import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import NoDataFounded from "../NoData";
import Pagination from "../Pagination";
// import Search from "svg/search.svg";
import PaginationType from "./paginationType";
import {  Input, Modal, Text } from "components";
declare global {
  interface Window {
    my_modal_1: any;
    showModal: () => void;
  }
}
export interface TableProps<ColumnsType> {
  columns: Array<(Column<object> & ColumnsType) | any>;
  data: object[];
  limit?: number;
  noDataMessage?: string;
  searchValue?: string | number | null;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pagination?: PaginationType;
  noPagination?: boolean;
  rowOnClick?: (row: any) => void;
  title?: string;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  modalOnDelete?: () => void;
  onSave?: () => void;
  search?: boolean;
  id?: string;
}

const Table = <ColumnsType,>({
  columns,
  data,
  title,
  setPage,
  modalTitle,
  noPagination = false,
  rowOnClick,
  modalContent,
  modalOnDelete,
  onSave,
  search = true,
  id,
  pagination = { current_page: 1, per_page: 1, total: 1, total_pages: 0 },
}: TableProps<ColumnsType>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter
  );
  return data.length !== 0 ? (
    <div className="flex flex-col p-5 items-end gap-4 bg-[#151423] overflow-hidden shadow-bs border-[#26243F] border rounded-[25px]">
      <div className=" flex gap-7 w-full justify-between items-center">
        <div className="flex-1 flex items-center gap-7">
          <Text size="2xl">{title}</Text>
          {search && (
            <div className="w-1/2">
              <Input
                name=""
                isForm={false}
                inputSize="large"
                className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl  border-slate-800"
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex me-auto gap-4 items-center">
          <Modal
            modalOnDelete={modalOnDelete}
            onSave={onSave}
            label={modalTitle}
            id={id}
          >
            {modalContent}
          </Modal>
        </div>
      </div>

      <table
        className="z-0 table w-full relative text-right"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className="w-full border-0 border-y-2 border-y-[#26243F]"
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup?.id ?? Math.random().toString()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className={`text-[#A3AED0] rounded-none ${
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    (column?.className as string) ?? ""
                  }`}
                  {...column.getHeaderProps()}
                  key={column.id ?? Math.random().toString()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="border-y-2 border-b-[#26243F] duration-200  hover:bg-[#26243FA6]"
                {...row.getRowProps()}
                key={row.id ?? Math.random().toString()}
                onClick={
                  rowOnClick
                    ? () => {
                        document.getElementById("my-drawer")?.click();

                        rowOnClick(row);
                      }
                    : undefined
                }
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className="py-5 text-white font-bold cursor-pointer "
                      {...cell.getCellProps()}
                      key={Math.random().toString()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!noPagination && (
        <div className="p-2 flex justify-between w-full">
          <Pagination
            currentPage={pagination?.current_page}
            limit={pagination?.per_page}
            total={Math.ceil(pagination?.total_pages)}
            onPageChange={(page) => {
              setPage?.(page);
            }}
          />
        </div>
      )}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center gap-4">
      <NoDataFounded />
    </div>
  );
};

export { Table };
