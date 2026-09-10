import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import NoDataFounded from "../NoData";
import PaginationType from "./paginationType";
import { Button, IconTile, Input, Modal, Text } from "components";
import type { IconName } from "components";
import { useLocation } from "react-router-dom";
import { iconForPath } from "layout/nav";
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
  /** أيقونةُ الرأس — تُشتقّ من المسار حين لا تُمرَّر. */
  icon?: IconName;
  /** سطرُ شرحٍ تحت العنوان — «١٧٬٩٢٣ مكوّناً» مثلاً. */
  hint?: string;
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
  icon,
  hint,
}: TableProps<ColumnsType>) => {
  /*
   * ➕ **ورأسُ الجدول صار رأسَ قسمٍ لا نصّاً غليظاً** [١٠ سبتمبر].
   *    البلاطةُ الملوّنة تُلتقط بطرف العين فتعرف أين أنت قبل قراءة الكلمة،
   *    **وهي أيقونةُ الشريط الجانبيّ نفسُها** مشتقّةً من المسار — فلا
   *    يُتعلَّم رمزان لقسمٍ واحد ولا تُعدَّل عشرون صفحة.
   */
  const { pathname } = useLocation();
  const headIcon = icon ?? iconForPath(pathname);
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

  /*
   * 🔴 **وكان الجدولُ كلُّه يختفي حين تكون الحمولة فارغة** — الغلافُ ورأسُه
   *    وزرُّ الإضافة وحقلُ البحث معه. ونتيجتاه عمليّتان:
   *    ١) **بحثٌ لا نتيجةَ له يُخفي حقلَ البحث نفسه** ⇒ المدرّب لا يستطيع
   *       مسحَ ما كتب، فيبدو أن الصفحة عُطبت.
   *    ٢) **قائمةٌ فارغة تُخفي زرَّ «إضافة»** ⇒ لا سبيل إلى إضافة أوّل صفٍّ
   *       في جدولٍ جديد إطلاقاً.
   *    الرأسُ يبقى الآن دائماً، ورسالةُ «لا بيانات» تحلّ محلَّ الصفوف وحدها.
   */
  const isEmpty = data.length === 0;

  return (
    <div className="flex flex-col p-5 items-end gap-4 bg-surface shadow-card border-line border rounded-card">
      <div className="flex gap-5 w-full justify-between items-center flex-wrap">
        <div className="flex-1 min-w-[220px] flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {headIcon && <IconTile name={headIcon} tone="brand" />}
            <div className="min-w-0">
              <Text size="2xl" bold className="!whitespace-normal !leading-tight">
                {title}
              </Text>
              {hint && (
                <p className="text-[13px] text-content-muted leading-snug">
                  {hint}
                </p>
              )}
            </div>
          </div>
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
            <div className="w-full max-w-sm min-w-[180px]">
              <Input
                name=""
                isForm={false}
                inputSize="medium"
                isSearch
                placeholder="ابحث…"
                value={searchInput}
                rounded="full"
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

      {/*
        ⛔ **وكان الغلافُ `overflow-hidden`** بينما نصوصُ الخلايا
           `whitespace-nowrap` ⇒ العمودُ الطويل **يُقصّ بلا أثر**: لا نقاطَ
           ولا شريطَ تمرير، فيقرأ المدرّب نصفَ اسمٍ ويظنّه كاملاً. صار
           تمريراً أفقياً، وهو العلاجُ الذي يُبقي المحتوى مقروءاً بلا قلبِ
           سلوكِ الالتفاف في ٢٤١ موضعَ نصّ.
      */}
      <div className="w-full overflow-x-auto scroll-quiet -mx-1 px-1">
      <table
        className="table-rows-soft z-0 table w-full relative text-right border-separate border-spacing-0"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className="w-full"
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className={`bg-transparent text-content-faint text-[11px] font-semibold tracking-wide rounded-none border-b border-line py-3 first:ps-3 last:pe-3 ${
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
                className="transition-colors duration-200 hover:bg-surface-raised group"
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
                      className="py-3.5 text-content text-sm font-medium border-b border-line/70 first:ps-3 last:pe-3 cursor-pointer"
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
      </div>

      {/* رسالةُ الفراغ تحلّ محلَّ الصفوف — والرأسُ فوقها باقٍ بأدواته. */}
      {isEmpty && (
        <div className="w-full py-16">
          <NoDataFounded />
        </div>
      )}

      {!isEmpty && rows.length === 0 && (
        <div className="w-full py-12 text-center">
          <p className="text-content-muted text-sm">
            لا نتيجة تطابق «{searchValue}»
          </p>
        </div>
      )}

      {/*
        ⛔ **وكان شريطُ الترقيم يُرسَم دائماً** — حتى على ثلاثة صفوفٍ في صفحةٍ
           واحدة. `renderOnZeroPageCount={null}` يمنع الأصفار وحدها، فيبقى
           شريطٌ فارغٌ بحشوته تحت كل جدولٍ صغير. ولا يُرسَم الآن إلا حين
           يكون ثمّة **ما يُتنقّل إليه**.
      */}
      <div className={`p-2 flex justify-between w-full ${pageCount > 1 ? "" : "hidden"}`}>
        <ReactPaginate
          className="flex justify-center items-center gap-2 text-sm text-content-muted"
          pageLinkClassName="px-3 py-1.5 rounded-lg hover:bg-ink-800 hover:text-content transition-colors inline-block"
          previousLinkClassName="px-3 py-1.5 rounded-lg hover:bg-ink-800 hover:text-content transition-colors inline-block"
          nextLinkClassName="px-3 py-1.5 rounded-lg hover:bg-ink-800 hover:text-content transition-colors inline-block"
          activeLinkClassName="!bg-brand-400 !text-ink-950 font-bold hover:!bg-brand-300"
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
  );
};

export { Table };
