import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import NoDataFounded from "../NoData";
import PaginationType from "./paginationType";
import { Button, Input, Modal, Text } from "components";
import ReactPaginate from "react-paginate";

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
  opnSideBarOpen?: () => void;
  title?: string;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  modalOnDelete?: () => void;
  onSave?: () => void;
  search?: boolean;
  id?: string;
  opnSideBar?: string;
  withoutCloseDrawer?: boolean;
  headerActions?: React.ReactNode;
}

const Table = <ColumnsType,>({
  columns,
  data,
  title,
  modalTitle,
  rowOnClick,
  opnSideBarOpen,
  setPage,
  pagination,
  modalContent,
  modalOnDelete,
  onSave,
  opnSideBar,
  search = true,
  id,
  withoutCloseDrawer = false,
  headerActions,
}: TableProps<ColumnsType>) => {
  const itemsPerPage = 25;
  const [itemOffset, setItemOffset] = useState(0);

  /**
   * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٤-١]
   *
   * حقلان لا واحد: `searchInput` ما يكتبه المدرّب، و`searchValue` ما يُرشَّح
   * به بعد سكونٍ ٣٠٠ms. ⛔ **وكان واحداً** ⇒ كلُّ ضغطةِ حرفٍ تُعيد مسحَ
   * **كلِّ صفٍّ في كلِّ عمود** (`Object.keys(row).some`) ثم تُعيد رسمَ
   * الجدول كلِّه.
   */
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchInput.trim());
      // ⛔ **والإزاحة تُصفَّر مع البحث** — وكانت تبقى: من بحث وهو في الصفحة
      // الخامسة كان يُقطَّع له من الموضع ١٠٠ في نتيجةٍ فيها ثلاثة صفوف
      // ⇒ **جدولٌ فارغ على بحثٍ ناجح**.
      setItemOffset(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /** الترشيح على الحمولة كلِّها — ويُعاد حسابُه عند تبدّلها أو تبدّل البحث فقط. */
  const filteredData = useMemo(() => {
    if (!searchValue) return data;

    const needle = searchValue.toLowerCase();

    return data.filter((row: any) =>
      Object.keys(row).some((key) =>
        String(row[key]).toLowerCase().includes(needle)
      )
    );
  }, [data, searchValue]);

  /**
   * ⛔ **ولا تُقطَّع الحمولة في الوضع الخادميّ** — `data` هناك **صفحةٌ
   * جاهزة**، وتقطيعُها بـ`itemsPerPage` المكوَّد كان يُسقط الصفوف بصمت لو
   * صار `per_page` أكبر من ٢٥. لغمٌ نائم: القيمتان متساويتان اليوم بالصدفة.
   */
  const currentItems = useMemo(
    () =>
      pagination != null
        ? filteredData
        : filteredData.slice(itemOffset, itemOffset + itemsPerPage),
    [filteredData, itemOffset, pagination]
  );

  /**
   * ⛔ **وكان يُحسب على `data.length` لا على المُرشَّح** ⇒ يبحث المدرّب فتبقى
   * أمامه أرقامُ صفحاتِ القائمة الكاملة، فيضغط «٣» على نتيجةٍ من صفحةٍ واحدة
   * ويرى فراغاً.
   */
  const pageCount =
    pagination?.total_pages ?? Math.ceil(filteredData.length / itemsPerPage);

  const handlePageClick = (event: any) => {
    if (pagination == null) {
      // القسمة على `filteredData.length` لا `data.length` — وبحراسةٍ من
      // القسمة على صفر حين لا تُطابق النتيجةُ شيئاً.
      const total = filteredData.length || 1;

      setItemOffset((event.selected * itemsPerPage) % total);
    } else {
      setPage!(event.selected + 1);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: currentItems,
      },
      useFilters,
      useGlobalFilter
    );

  return data.length !== 0 ? (
    <div className="flex flex-col p-5 items-end gap-4 bg-[#151423] overflow-hidden shadow-bs border-[#26243F] border rounded-[25px]">
      <div className=" flex gap-7 w-full justify-between items-center">
        <div className="flex-1 flex items-center gap-7">
          <Text size="2xl">{title}</Text>
          {/*
            ⛔ **ولا يُعرض بحثٌ محلّيٌّ فوق ترقيمٍ خادميّ.** `data` هناك
            **صفحةٌ واحدة (٢٥ صفّاً)**، والحقل يرشّحها وحدها بينما يقرؤه
            المدرّب بحثاً في القائمة كلِّها ⇒ **يبحث في ٢٥ من ١٧٬٩٢٣ ويظنّ
            أنه بحث في الكلّ، فيستنتج أن المكوّن غير موجود ويُنشئ مكرَّراً**.
            وليست فرضيّة: هي بعينها العلّة التي عولجت في `add-ingredients`
            (٩ أغسطس) بباحثٍ خادميّ، وهذا الشرط يمنع عودتها بالبناء.
            ⚖️ والشاشةُ الخادميّة تضع حقلَها **فوق** الجدول لا داخله — كي
            يبقى ظاهراً حين تردّ النتيجة صفراً، وإلا حُبس المدرّب في بحثٍ
            لا يستطيع مسحه.
          */}
          {search && pagination == null && (
            <div className="w-1/2">
              <Input
                name=""
                isForm={false}
                inputSize="large"
                value={searchInput}
                className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl  border-slate-800"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          )}
        </div>

        {opnSideBar && (
          <div className="flex me-auto gap-4 items-center">
            <Button
              htmlFor="my-drawer"
              onClick={opnSideBarOpen}
              rounded={"full"}
              primary
            >
              {opnSideBar}
            </Button>
          </div>
        )}
        {(modalTitle || headerActions) && (
          <div className="flex me-auto gap-4 items-center">
            {headerActions}
            {modalTitle && (
              <Modal
                modalOnDelete={modalOnDelete}
                onSave={onSave}
                label={modalTitle}
                id={id}
              >
                {modalContent}
              </Modal>
            )}
          </div>
        )}
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
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className={`text-[#A3AED0] rounded-none ${
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    (column?.className as string) ?? ""
                  }`}
                  {...column.getHeaderProps()}
                  key={column.id}
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
                key={row.id}
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
                      /*
                        ⛔ كان `key={Math.random().toString()}` — **بلا سقوطٍ
                        ولا شرط**. ومفتاحٌ جديدٌ في كل رسمٍ يمنع React من
                        مطابقة الخلية بسابقتها ⇒ **تُهدَم كلُّ `<td>` وتُبنى
                        من جديد** في كل رسمة (٢٥ صفّاً × أعمدتها)، ومعها يضيع
                        تركيزُ أيّ حقلٍ داخلها وحالةُ أيّ مكوّنٍ فيها.
                        و`cell.column.id` فريدٌ داخل الصفّ ومستقرٌّ عبر الرسمات.
                        📌 والثلاثةُ الأخرى كانت `?? Math.random()` — سقوطاً لا
                        يقع أصلاً (react-table يضمن `id`)، فالضررُ كان هنا وحده.
                      */
                      key={cell.column.id}
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
          /*
            ⛔ **والصفحة المُبرَزة تتبع الإزاحة في الوضع المحلّيّ أيضاً.**
            كانت `forcePage` للوضع الخادميّ وحده، و`ReactPaginate` يحتفظ
            باختياره داخلياً ⇒ بعد أن صار البحث **يصفّر الإزاحة**، كان
            المدرّب يرى بيانات الصفحة الأولى و**الرقم ٥ مُبرَزاً** —
            تناقضٌ يصنعه الإصلاح نفسه لو تُرك.
          */
          forcePage={
            pagination != null
              ? pagination.current_page - 1
              : Math.floor(itemOffset / itemsPerPage)
          }
        />
      </div>
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center gap-4">
      <NoDataFounded />
    </div>
  );
};

export { Table };
