import { SubState, Table } from "components";
import React, { useCallback, useEffect, useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";
import UserDrawerTabs from "shared/UserDrawerTabs";
import { apiErrorMessage } from "util/apiError";

function Messages() {
  const [activeUser, setActiveUser] = useState<any>(null);

  /**
   * المحادثات التي فتحها المدرّب في هذه الجلسة.
   *
   * الخادم يختم رسائل المستخدم مقروءةً لحظة `GET /users/{id}?chat=1`، لكن
   * **قائمةَ الشاشة لا تُعاد جلبتها** بعد الفتح، فتبقى الشارة القديمة معروضة
   * حتى تحديثٍ يدويّ. وإبطالُ الاستعلام كان يعيد جلب **كل المستخدمين**
   * (مسارٌ ثقيل: كل مستخدمٍ برسائله) في كل فتح محادثة — فالتصفير محلّيٌّ
   * والقيمة الصادقة تصل من الخادم في الجلبة التالية.
   */
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const url = "/users?chat=1";

  const { data: users = [], isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          // صفرٌ لا يُعرض: شارةٌ بـ«0» ضجيجٌ يُقرأ إشعاراً من طرف العين.
          const badge = opened.has(row.original.id)
            ? 0
            : Number(row.original.chat_badge ?? 0);

          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                {badge > 0 && (
                  <span className="indicator-item badge-sm h-6 rounded-full badge badge-warning">
                    {badge}
                  </span>
                )}
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
        Header: "بريد إلكتروني",
        accessor: "email",
      },

      {
        Header: "الهاتف",
        accessor: "phone",
      },

      {
        Header: "جنس",
        accessor: "gender", // accessor is the "key" in the data
      },
      {
        Header: "نوع الإشتراك",
        Cell: ({ row }: { row: Row<any> }) => {
          return <SubState state={row.original.subscription_status as any} />;
        },
      },
      {
        Header: "الدولة",
        accessor: "country",
      },
      {
        Header: "الجهاز",
        accessor: "phone_model",
      },
      {
        Header: "آخر ظهور",
        accessor: "last_viewed",
        Cell: ({ row }: { row: Row<any> }) => {
          // نصٌّ نسبيّ يبنيه الخادم (`LastSeen::human`) — لا يُشتقّ هنا كي لا
          // يفترق جوابان لسؤالٍ واحد. والتاريخ المطلق في `title` لمن أراد
          // الدقّة، و`last_login_at` تسجيلُ الدخول وهو **شيءٌ آخر**.
          const seen = row.original.last_seen_human as string | undefined;

          return (
            <span title={row.original.last_seen_at ?? ""}>
              {seen ?? row.original.last_viewed ?? "—"}
            </span>
          );
        },
      },
      {
        Header: "مزود الدخول",
        accessor: "provider",
      },
    ],
    [opened]
  );

  const axios = useAxios({});

  /** `?chat=1` هو ما يختم رسائل المستخدم مقروءةً على الخادم. */
  const openConversation = useCallback(
    async (userId: number) => {
      try {
        const { data } = await axios.get(`/users/${userId}?chat=1`);

        setActiveUser(data.data);
        setOpened((prev) => new Set(prev).add(Number(userId)));
      } catch (error: any) {
        toast.error(apiErrorMessage(error));
      }
    },
    [axios]
  );

  const rowOnClick = async (e: any) => openConversation(e.original.id);

  /**
   * قادمٌ من صفحة «تخصيص الخطة» بزرّ «محادثة المستخدم».
   *
   * كان المفتاح يُكتب هناك **ولا يقرؤه أحد** في المستودع كلّه، فيهبط المدرّب
   * على القائمة ولا تُفتح محادثة. *(وأزرارُ الدرج نفسه لم تعد تمرّ من هنا —
   * صارت تبديلَ تبويبٍ في مكانها.)*
   */
  useEffect(() => {
    const pending = localStorage.getItem("open_chat_user_id");

    if (pending) {
      localStorage.removeItem("open_chat_user_id");

      void openConversation(Number(pending)).then(() =>
        document.getElementById("my-drawer")?.click()
      );
    }
  }, [openConversation]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-full">
      <Table
        data={users?.users ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
      />

      <Drawer>
        <UserDrawerTabs activeUser={activeUser} initialTab="chat" />
      </Drawer>
    </div>
  );
}

export default Messages;
