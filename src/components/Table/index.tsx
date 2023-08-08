import React from "react";
import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import NoDataFounded from "../NoData";
import Pagination from "../Pagination";
// import Search from "svg/search.svg";
import PaginationType from "./paginationType";
import { Button, Input, Text } from "components";

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
  btnOnClick?: () => void;
  btnTitle?: string;
}

const Table = <ColumnsType,>({
  columns,
  data,
  searchValue,
  title,
  setPage,
  noPagination = false,
  btnOnClick,
  btnTitle,
  rowOnClick,
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
    <div className="flex flex-col p-5 items-end gap-9 bg-[#151423] overflow-hidden shadow-bs border-[#26243F] border rounded-[25px]">
      <div className=" flex gap-7  w-full justify-start items-center">
        <Button size="large" rounded="full" primary onClick={btnOnClick}>
          {btnTitle}
        </Button>
        <div className="drawer drawer-end z-50">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button"
            >
              Open drawer
            </label>
          </div>
          <div className="drawer-side ">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <div className="drawer-style p-6 w-1/3 h-[85%] mt-auto">
              {/* Sidebar content here */}
              asd
            </div>
          </div>
        </div>

        <div className="!w-1/3">
          <Input
            name=""
            isForm={false}
            inputSize="large"
            isSearch
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Text size="3xl">{title}</Text>
      </div>

      <table className="z-0 table w-full relative " {...getTableProps()}>
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
          {/* <div className="text-[#1B4865] text-sm">
            {t('showing')} {pagination.current_page} {t('to')}{' '}
            {pagination?.per_page} {t('of')} {pagination?.total} {t('results')}
          </div> */}
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
    <div className="mt-10">
      <NoDataFounded />
    </div>
  );
};

export { Table };
