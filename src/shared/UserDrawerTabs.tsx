import { Button } from "components";
import { useEffect, useState } from "react";
import useAxios from "hooks/useAxios";
import Chat from "pages/Messages/components/Chat";
import UsersSideBar from "pages/Users/components/UsersSideBar";
import UsersInfo from "shared/UserInfo";

export type UserDrawerTab = "chat" | "details";

/**
 * درجُ المستخدم بتبويبين — **في مكانه لا بالانتقال بين الصفحات**.
 *
 * ## ما كان (٢٤ أغسطس ٢٠٢٦)
 *
 * كان الطرفان يتصافحان بـ`localStorage` ثم `navigate`:
 *
 * * «عرض بيانات المستخدم» في درج الرسائل ⇒ يكتب `user_id_From_messages`
 *   وينتقل إلى `/users`، وهناك `useEffect` يجلب المستخدم ويفتح الدرج ⇒
 *   **مغادرةُ المحادثة وقفزةُ صفحةٍ كاملة لعرض بياناتٍ في درجٍ آخر**.
 * * و«محادثة المستخدم» في درج المستخدمين ⇒ يكتب `open_chat_user_id` وينتقل
 *   إلى `/dashboard` — **ولا قارئ لذلك المفتاح في المستودع كلّه** ⇒ يهبط
 *   المدرّب على قائمة المحادثات ولا تُفتح واحدة. مصافحةٌ ميتة.
 *
 * ## القاعدة الآن
 *
 * الدرج واحدٌ في الصفحتين، والتبويب يقرّر ما يُعرض؛ فلا انتقال ولا
 * `localStorage`. والفرق بين الصفحتين **التبويب المفتوح أوّلاً** لا أكثر.
 *
 * ⚠️ **والتبويب غير النشط لا يُركَّب** — لا يُخفى بـCSS: `Chat` يشغّل نبضة
 * حضور المدرّب (`useTrainerPresence`)، و«متصل الآن» معناها المتّفق عليه
 * **محادثةٌ مفتوحة أمامه**. فتركيبُه تحت تبويب البيانات كان يُعلن المدرّب
 * متصلاً وهو يحرّر خطة تغذية.
 */
function UserDrawerTabs({
  activeUser,
  initialTab = "details",
}: {
  activeUser: any;
  initialTab?: UserDrawerTab;
}) {
  const [tab, setTab] = useState<UserDrawerTab>(initialTab);

  const axios = useAxios({});

  // مستخدمٌ جديد ⇒ يعود الدرج إلى تبويبه الافتراضيّ. وبلاه يفتح المدرّب
  // محادثةً فيجد نموذج تحرير المستخدم السابق لأنه تركه مفتوحاً.
  useEffect(() => setTab(initialTab), [activeUser?.id, initialTab]);

  /**
   * ختمُ المقروء عند **نقطة قرارٍ واحدة**: لحظة صيرورة تبويب المحادثة نشطاً،
   * أيّاً كان بابُ الدخول.
   *
   * صفحةُ الرسائل تختمها ضمناً بـ`?chat=1` عند فتح المحادثة، **ودرجُ صفحة
   * المستخدمين يجلب `/users/{id}` بلا المعامل** ⇒ لو تُرك الختم لبابه لبقيت
   * المحادثة المفتوحة من هناك «غير مقروءة» وشارتُها قائمة في الشاشة الأخرى.
   * والنداء ذرّيٌّ بطبعه (تعيينُ `read_at` وتصفيرُ العدّاد) فتكرارُه بلا أثر.
   */
  useEffect(() => {
    if (tab !== "chat" || !activeUser?.id) return;

    void axios
      .post(`/mark-chat-as-read/${activeUser.id as string}`, {})
      .catch(() => undefined);
  }, [tab, activeUser?.id]);

  if (!activeUser) return null;

  return (
    <div className="flex flex-col gap-3 mt-[5px] w-full">
      <div className="flex gap-3">
        <Button
          size="small"
          primary={tab === "chat"}
          secondaryBorder={tab !== "chat"}
          onClick={() => setTab("chat")}
        >
          المحادثة
        </Button>
        <Button
          size="small"
          primary={tab === "details"}
          secondaryBorder={tab !== "details"}
          onClick={() => setTab("details")}
        >
          بيانات المستخدم
        </Button>
      </div>

      {tab === "chat" ? (
        <div
          className={`flex flex-col gap-2 w-full ${
            activeUser?.chat?.length === 0 ? "h-[100%]" : "h-[140%]"
          }`}
        >
          <UsersInfo
            activeUser={activeUser}
            location="message"
            onShowDetails={() => setTab("details")}
          />

          <Chat userData={activeUser} />
        </div>
      ) : (
        <UsersSideBar
          activeUser={activeUser}
          onOpenChat={() => setTab("chat")}
        />
      )}
    </div>
  );
}

export default UserDrawerTabs;
