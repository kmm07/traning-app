import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import NoDataFounded from "../NoData";
import PaginationType from "../Table/paginationType";
import ReactPaginate from "react-paginate";

declare global {
  interface Window {
    my_modal_1: any;
    showModal: () => void;
  }
}
export interface LoadingTableProps<ColumnsType> {
  columns: Array<(Column<object> & ColumnsType) | any>;
  data: object[];
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pagination: PaginationType;
  rowOnClick?: (row: any) => void;
  withoutCloseDrawer?: boolean;
}

const LoadingTable = <ColumnsType,>({
  columns,
  data,
  rowOnClick,
  setPage,
  pagination,
  withoutCloseDrawer = false,
}: LoadingTableProps<ColumnsType>) => {

  const pageCount = pagination.total_pages;

  const handlePageClick = (event: any) => {
      setPage!(event.selected + 1);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: data,
      },
      useFilters,
      useGlobalFilter
    );

  return data.length !== 0 ? (
    <div>
      <table
        className="z-0 table w-full relative text-right"
        {...getTableProps()}>
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
                        !withoutCloseDrawer &&
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

      <div className="p-2 flex justify-between w-full">
        <ReactPaginate
          className="flex justify-center items-center gap-3"
          activeClassName="bg-[#00A4FA] text-white rounded-full w-8 h-8 flex justify-center items-center"
          disabledClassName="hidden"
          breakLabel="..."
          nextLabel="التالي >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< سابق"
          renderOnZeroPageCount={null}
          forcePage={ pagination.current_page - 1 }
        />
      </div>
      </div>
  ) : (
    <div className="mt-20 flex flex-col items-center gap-4">
      <NoDataFounded />
    </div>
  );
};

export { LoadingTable };
