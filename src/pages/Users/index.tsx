import { Card, Input, SubState, Table, Text } from "components";
import React, { useState, useMemo, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import UserDrawerTabs from "shared/UserDrawerTabs";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import useAxios from "hooks/useAxios";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

interface UserType {
  country: string;
  email: string;
  gender: string;
  have_subscription: boolean;
  id: number;
  last_viewed: string;
  name: string;
  phone: string;
  phone_model: string;
  provider: string;
  subscription: string;
  subscription_status: string;
}

function Users() {
  const [activeUser, setActiveUser] = useState<any>(null);

  const [activeState, setActiveState] = useState<string>("all");

  // ═══════════════════════════════════════════════════════════════════
  // [٢٥ أغسطس ٢٠٢٦ · خطة ٤-٣] الترقيمُ والبحثُ والترشيحُ صارت **خادمية**.
  //
  // كانت الشاشة تجلب **كلَّ** مستخدمٍ (٩٠٧ KB خاماً · ٢٢٠٣ صفّاً) وترشّح
  // وتبحث محلياً. والقياس على الخادم: ذروةُ **62.5 MB** من `memory_limit`
  // البالغ 128M ⇒ **خطأٌ قاتل عند ≈٩٠٠٠ مستخدم**.
  //
  // ⚠️ **والترشيحُ المحلّيّ كان يصير كذباً لحظة الترقيم** — يرشّح المدرّب
  // صفحةً ويظنّه ترشيحَ الكلّ. ولذلك انتقل الثلاثة **دفعةً واحدة**: الترقيمُ
  // والبحثُ والترشيح. (وهو عينُ ما وقع في شاشة المكوّنات: بحثٌ محلّيّ يغطّي
  // ٢٥ من ١٧٬٤٢٨.)
  //
  // 📌 **والبطاقاتُ تبقى على المجموع** — يرسلها الخادم محسوبةً على كل
  // المستخدمين لا على الصفحة، فالنقرُ عليها ترشيحٌ لا إعادةُ عدّ.
  // ═══════════════════════════════════════════════════════════════════
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  // debounce — وإلا نداءٌ لكل حرف. (نفس ٣٥٠ ms في شاشة المكوّنات.)
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [search]);

  // تبديلُ الشريحة يعيد إلى الصفحة الأولى — وإلا بقي المدرّب على صفحةٍ
  // رقمُها أكبر من صفحات الشريحة الجديدة فرأى جدولاً فارغاً.
  useEffect(() => setCurrentPage(1), [activeState]);

  const url = `/users?per_page=25&page=${currentPage}${
    activeState !== "all" ? `&state=${activeState}` : ""
  }${query ? `&search_query=${encodeURIComponent(query)}` : ""}`;

  const { data: users }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any } }) => data.data,
    keepPreviousData: true,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
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
        Cell: ({ row }: { row: Row<UserType> }) => {
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
    []
  );

  // on view user data ============================>
  const axios = useAxios({});

  const rowOnClick = async (e: any) => {
    try {
      const { data } = await axios.get(`/users/${e.original.id as any}`);
      console.log("data >>>> ", data);
      setActiveUser(data.data);
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  const cardsTranslator = (name: string) => {
    switch (name) {
      case "all":
        return "جميع المستخدمين";
      case "subscriped":
        return "المشتركين";
      case "canceled":
        return "اشتراكات ملغية";
      case "free":
        return "اشتراكات مجانية";
      case "not_subscriped":
        return "غير مشتركين";
    }
  };

  // filter by category =====================>
  const onChangeCategory = (category: string) => setActiveState(category);

  const pagination = users?.pagination;

  // ⚖️ **الترشيحُ المحلّيّ لم يُنزع بل صار احتياطياً — وهو تأمينُ ترتيبِ نشر.**
  //
  // وصولُ `pagination` هو **دليلُ أن الخادم يفهم `state=`**: عقدُ الترقيم
  // والترشيح نُشرا معاً. فإن غاب المفتاح فالخادمُ قديم ⇒ يعود الترشيح محلياً
  // ويعرض `Table` كلَّ الصفوف بترقيمه الداخليّ — **أي أن اللوحة تعمل على
  // الخادمين**، فلا يصير ترتيبُ النشر شرطَ سلامة.
  //
  // ⛔ وهو **ليس ترشيحاً مزدوجاً**: متى وصل `pagination` كان الخادم قد رشّح،
  // فتُقرأ الصفوف كما هي. وإعادةُ ترشيحها هنا كانت ستُخفي صفوفاً صحيحة.
  const rows = useMemo(() => {
    const list = users?.users ?? [];

    if (pagination != null || activeState === "all") {
      return list;
    }

    return list.filter((u: any) => u?.subscription_status === activeState);
  }, [users, pagination, activeState]);

  // open sidebar if is coming from messages ===============>
  useEffect(() => {
    const userFromMessage = localStorage.getItem("user_id_From_messages");

    if (![null, undefined].includes(userFromMessage as any)) {
      const getUserData = async () => {
        try {
          const { data } = await axios.get(`/users/${userFromMessage as any}`);

          await setActiveUser(data.data);

          document.getElementById("my-drawer")?.click();
        } catch (error: any) {
          toast.error(apiErrorMessage(error));
        }
      };
      getUserData();
    }

    return () => localStorage.removeItem("user_id_From_messages");
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {Object.entries(users?.cards ?? {})?.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              className={`p-4 cursor-pointer ${
                activeState === item[0] ? "bg-light_blue-500" : ""
              }`}
              onClick={() => onChangeCategory(item[0])}
            >
              <div className="flex flex-col  justify-between">
                <Text size="3xl" className=" font-bold capitalize">
                  {item[1]}
                </Text>
                <Text size="3xl" className="text-white text-sm font-bold">
                  {cardsTranslator(item[0])}
                </Text>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ⚖️ **شرطُ العرض هو عينُ شرط `Table` مقلوباً** — يعرض بحثَه المحلّيّ
          متى كان `pagination == null`. فيبقى **حقلٌ واحدٌ عاملٌ دائماً**:
          الخادميُّ متى فهم الخادمُ `search_query`، والمحلّيُّ إن كان قديماً.
          ولولا الشرط لظهر حقلان أحدهما لا يفعل شيئاً في النافذة الانتقالية. */}
      {pagination != null && (
      <Input
        name=""
        isForm={false}
        inputSize="large"
        placeholder="ابحث بالاسم أو البريد أو الهاتف..."
        value={search}
        className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl border-slate-800"
        onChange={(e) => setSearch(e.target.value)}
      />
      )}

      <Table
        data={rows as any}
        columns={columns}
        rowOnClick={rowOnClick}
        title="جميع المستخدمين"
        pagination={pagination}
        setPage={setCurrentPage}
      />

      <Drawer>
        <UserDrawerTabs activeUser={activeUser} initialTab="details" />
      </Drawer>
    </div>
  );
}

export default Users;
