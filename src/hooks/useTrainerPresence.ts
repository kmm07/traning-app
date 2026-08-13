import { useEffect, useRef } from "react";
import { useAppSelector } from "./useRedux";
import { selectCurrentToken } from "redux/slices/auth";
import { ADMIN_BASE_URL } from "./useAxios";

/** دورية النبضة — يجب أن تبقى **أضيق** من نافذة الخادم (٩٠ ث افتراضاً). */
const HEARTBEAT_MS = 30_000;

const PRESENCE_URL = `${ADMIN_BASE_URL}/chat/presence`;

/**
 * حضور المدرّب على طريقة واتساب: «متصل الآن» ما دامت **شاشة المحادثة مفتوحة
 * والتبويب ظاهراً**، وتنطفئ فور إغلاقها — لا لمجرّد أن اللوحة مفتوحة.
 *
 * ### لماذا نبضةٌ دورية لا إشارةُ فتحٍ واحدة
 * شات اللوحة يعمل بـPusher، فبعد فتح المحادثة لا يصل الخادمَ طلبٌ واحد ما دام
 * المدرّب يقرأ. فإشارةُ الفتح وحدها كانت ستُطفئ «متصل» بعد دقيقة ونصف وهو ما
 * زال في المحادثة. والنبضة كل ٣٠ ث تُبقي الحالة صادقةً بأقلّ كلفة (طلبٌ صغير
 * لا يمسّ القاعدة).
 *
 * ### وثلاث حالات إطفاء — واحدةٌ منها لا يمكن ضمانها
 * ١. إغلاق المحادثة أو مغادرة الصفحة ⇒ `closed` صريحة في التنظيف.
 * ٢. تخفية التبويب (`visibilitychange`) ⇒ `closed` — المدرّب ليس أمامها.
 * ٣. إغلاق المتصفّح قسراً ⇒ محاولة `fetch(keepalive)`، وإلا **تنقضي نافذة
 *    الخادم** خلال ٩٠ ث. ولهذا النافذة قصيرةٌ أصلاً.
 *
 * ⚠️ و`navigator.sendBeacon` **لا يصلح هنا**: لا يحمل ترويسة `Authorization`،
 * والمسار خلف حارس اللوحة ⇒ كان سيُردّ 401 صامتاً ويبدو الإطفاء منفَّذاً.
 *
 * @param enabled محادثةٌ مفتوحة فعلاً (مستخدمٌ مختار)
 * @param drawerId معرّف صندوق الدرج — الشات يبقى **مُركَّباً** بعد إغلاق الدرج
 *                (daisyUI يخفيه بـCSS لا بالتفكيك)، فالتركيب وحده ليس دليل فتح.
 */
export default function useTrainerPresence(
  enabled: boolean,
  drawerId = "my-drawer"
) {
  const token = useAppSelector(selectCurrentToken);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    if (!enabled) return;

    const drawer = document.getElementById(drawerId) as HTMLInputElement | null;

    const send = (state: "open" | "closed") => {
      const auth = `Bearer ${tokenRef.current as string}`;

      return fetch(PRESENCE_URL, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          authorization: auth,
        },
        body: JSON.stringify({ state }),
      }).catch(() => undefined);
    };

    // «مفتوحة» = الدرج مفتوح والتبويب ظاهر. وغيابُ الصندوق يُقرأ فتحاً كي لا
    // يصمت الحضور بالكامل إن تغيّر هيكل الدرج لاحقاً.
    const isOpen = () =>
      (drawer ? drawer.checked : true) && document.visibilityState === "visible";

    let live = false;

    const sync = () => {
      const open = isOpen();

      if (open) {
        live = true;
        void send("open");
      } else if (live) {
        live = false;
        void send("closed");
      }
    };

    sync();
    const timer = window.setInterval(sync, HEARTBEAT_MS);

    drawer?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    const onLeave = () => {
      if (live) void send("closed");
    };
    window.addEventListener("pagehide", onLeave);

    return () => {
      window.clearInterval(timer);
      drawer?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pagehide", onLeave);

      if (live) void send("closed");
    };
  }, [enabled, drawerId]);
}
