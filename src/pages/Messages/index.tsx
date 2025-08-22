import { Input, LoadingTable, SubState } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import MessagesSideBAr from "./components/SideBar";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";
import PaginationType from "components/Table/paginationType";

function Messages() {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage] = useState(25);

  const url = `/getsubscribedchat?page=${currentPage}&per_page=${perPage}&search=${encodeURIComponent(
    searchQuery.trim()
  )}`;

  const { data: usersData, isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: { data: any[]; meta: any } } }) => ({
        items: Array.isArray(data.data.data) ? data.data.data : [],
        pagination: data.data.meta ?? {},
      }),
      refetchOnWindowFocus: false,
    }
  );

  const metaToPagination = (meta: any): PaginationType => ({
    total: meta.total,
    current_page: meta.current_page,
    per_page: meta.per_page,
    total_pages: meta.last_page, // sometimes called last_page in APIs
  });

  const axios = useAxios({});

  const rowOnClick = async (row: any) => {
    try {
      const { data } = await axios.get(`/users/${row.original.id}?chat=1`);
      setActiveUser(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const usersList = usersData?.items ?? [];
  const pagination = usersData?.pagination ?? {};

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => (
          <div className="flex items-center gap-4">
            <div className="avatar indicator">
              {row.original.chat_badge ? (
                <span className="indicator-item badge-sm h-6 rounded-full badge badge-warning">
                  {row.original.chat_badge}
                </span>
              ) : null}
              <div className="w-12 h-12 rounded-full">
                <img
                  src={row.original.image || "/images/img_rectangle347.png"}
                  alt="avatar"
                />
              </div>
            </div>
            {row.original.name}
          </div>
        ),
      },
      { Header: "بريد إلكتروني", accessor: "email" },
      { Header: "الهاتف", accessor: "phone" },
      { Header: "جنس", accessor: "gender" },
      {
        Header: "نوع الإشتراك",
        Cell: ({ row }: { row: Row<any> }) => (
          <SubState state={row.original.subscription_status as any} />
        ),
      },
      { Header: "الدولة", accessor: "country" },
      { Header: "الجهاز", accessor: "phone_model" },
      { Header: "آخر ظهور", accessor: "last_viewed" },
      { Header: "مزود الدخول", accessor: "provider" },

      // 🆕 Add last message text
      {
        Header: "الرسالة الأخيرة",
        accessor: "message",
        Cell: ({ value }: { value: string }) => (
          <span className="truncate block max-w-[250px] text-gray-400">
            {value || "—"}
          </span>
        ),
      },

      // 🆕 Add last message date
      {
        Header: "تاريخ آخر رسالة",
        accessor: "last_msg_date",
        Cell: ({ value }: { value: string }) =>
          value ? new Date(value).toLocaleString("ar-SA") : "—",
      },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="w-1/3">
        <Input
          isForm={false}
          inputSize="large"
          placeholder="ابحث عن مستخدم..."
          className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl border-slate-800"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          name=""
        />
      </div>

      {/* Table */}
      <div className="w-full">
        {!isLoading ? (
          <LoadingTable
            data={usersList}
            columns={columns}
            rowOnClick={rowOnClick}
            setPage={setCurrentPage}
            pagination={metaToPagination(pagination)}
          />
        ) : (
          <div>جار التحميل...</div>
        )}
      </div>

      {/* Sidebar drawer */}
      <Drawer>
        <MessagesSideBAr userData={activeUser} />
      </Drawer>
    </div>
  );
}

export default Messages;
