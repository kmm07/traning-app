import { Button } from "components";
import { useEffect, useMemo } from "react";
export interface PaginationProps {
  currentPage: number;
  total: number;
  onPageChange: (page: number) => void;
  limit?: number;
}

interface getPagesCutProps {
  pagesCount: number;
  pagesCutCount: number;
  currentPage: number;
}

const Pagination = ({
  currentPage = 1,
  onPageChange,
  limit = 10,
  total,
}: PaginationProps) => {
  let pagesCount = Math.ceil(total / 1);

  if (total === -1) {
    pagesCount = 0;
  }

  const getPagesCut = useMemo(
    () =>
      ({ pagesCount, pagesCutCount, currentPage }: getPagesCutProps) => {
        const ceiling = Math.ceil(pagesCutCount / 2);
        const floor = Math.floor(pagesCutCount / 2);

        if (pagesCount < pagesCutCount) {
          return { start: 1, end: pagesCount + 1 };
        } else if (currentPage >= 1 && currentPage <= ceiling) {
          return { start: 1, end: pagesCutCount + 1 };
        } else if (currentPage + floor >= pagesCount) {
          return { start: pagesCount - pagesCutCount + 1, end: pagesCount + 1 };
        } else {
          return {
            start: currentPage - ceiling + 1,
            end: currentPage + floor + 1,
          };
        }
      },
    []
  );

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const range = useMemo(
    () => (start: number, end: number) => {
      return [...(Array(end - start).keys() as any)].map(
        (el: number) => el + start
      );
    },
    []
  );

  const pagesCut = getPagesCut({ pagesCount, pagesCutCount: 3, currentPage });

  const pages = range(pagesCut?.start, pagesCut?.end);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pagesCount;

  return (
    <div className="flex gap-2 h-[30px] items-center max-w-full border border-[#D1D5DB] rounded-lg">
      {!isFirstPage && (
        <Button
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          className="shadow-none"
          size="xSmall"
        >
          RightArrow
          {/* //   className={`transform stroke-black  ${
          //     lang === 'ar' ? '-rotate-90' : 'rotate-90'
          //   }`}
          // /> */}
        </Button>
      )}

      <ul className="flex gap-1 items-center">
        {pages.map((page: number) => (
          <PaginationItems
            page={page}
            key={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}
      </ul>

      {!isLastPage && (
        <Button
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          className="shadow-none"
          size="xSmall"
        >
          RightArrow
          {/* className={`transform stroke-black ${
              "ar" === "ar" ? "rotate-90" : "-rotate-90"
            }`}
          /> */}
        </Button>
      )}
    </div>
  );
};

interface PaginationItemsProps {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function PaginationItems({
  page,
  currentPage,
  onPageChange,
}: PaginationItemsProps) {
  return (
    <li
      onClick={() => {
        onPageChange(page);
      }}
      className={`text-black px-2 rounded cursor-pointer ${
        currentPage === page ? "bg-[#FFFBF3] border-2 border-secondary-100" : ""
      }`}
    >
      <span>{page}</span>
    </li>
  );
}

export default Pagination;
