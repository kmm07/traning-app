import { Button, Input } from "components";
import { Form, Formik } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import useAxios, { ADMIN_BASE_URL } from "hooks/useAxios";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrentToken } from "redux/slices/auth";
import useTrainerPresence from "hooks/useTrainerPresence";
import { apiErrorMessage } from "util/apiError";

/**
 * [٨ سبتمبر ٢٠٢٦ · إعادة بناء الشات]
 *
 * - الرسائل تُجلب **مصفّحةً** من `GET admin/chat/{id}?page=1` (أحدث ٣٠) لا من
 *   `users/{id}?chat=1` — الذي صار يحمل **ملخّصاً** (`{id,count,latest_id,unread_count}`)
 *   بدل تاريخ المحادثة كاملاً.
 * - قناة Pusher صارت **خاصّة** (`private-trainer`) وتوقيعُها من
 *   `POST admin/broadcasting/auth` بترويسة اللوحة نفسها. والحدثُ يحمل `user_id`
 *   فيُرشَّح بالمحادثة المفتوحة — كان كلُّ حدثٍ يُلصق في أيّ محادثةٍ مفتوحة.
 * - عميلُ Pusher يُبنى **مرّةً** لعمر المكوّن (كان يُبنى في كل render).
 */
const PUSHER_KEY = "b48f98218c05a058e5a5";
const PUSHER_CLUSTER = "eu";
const CHANNEL = "private-trainer";
const EVENT = "chat";

type ChatMessage = MsgProps["messages"][0] & { user_id?: number; chat_id?: number };

function Chat({ userData }: { userData: any }) {
  const url = `/send-message/${userData?.id}`;

  // حضور المدرّب على طريقة واتساب: نبضةٌ ما دامت هذه المحادثة مفتوحة أمامه،
  // وإطفاءٌ فور إغلاقها. يقرؤها التطبيق في `/api/chat` تحت `trainer.available`.
  useTrainerPresence(!!userData?.id);

  const [messages, seMessages] = useState<ChatMessage[]>([]);
  const token = useAppSelector(selectCurrentToken);

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (
      messagesEndRef.current !== null &&
      messagesEndRef.current !== undefined
    ) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // إلحاقٌ بلا تكرار: الرسالة المرسَلة تعود من ردّ الإرسال **ومن Pusher** معاً.
  const appendUnique = (incoming: ChatMessage) =>
    seMessages((prev) =>
      prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
    );

  const axios = useAxios({});

  // التحميل الأوليّ: أحدث صفحةٍ من الخادم، معكوسةً تصاعدياً.
  useEffect(() => {
    let cancelled = false;
    seMessages([]);
    if (!userData?.id) return;

    axios
      .get(`/chat/${userData.id}?page=1`)
      .then((res) => {
        if (cancelled) return;
        const rows: ChatMessage[] = res?.data?.data?.data ?? [];
        seMessages([...rows].reverse());
        setTimeout(scrollToBottom, 100);
      })
      .catch((error: any) => toast.error(apiErrorMessage(error)));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // قناةٌ خاصّة واحدة لكل المدرّبين، والترشيح بصاحب المحادثة المفتوحة.
  useEffect(() => {
    if (!token || !userData?.id) return;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: `${ADMIN_BASE_URL}/broadcasting/auth`,
        transport: "ajax",
        headers: { authorization: `Bearer ${token}` },
      },
    });

    const channel = pusher.subscribe(CHANNEL);
    channel.bind(EVENT, (data: ChatMessage) => {
      if (Number(data?.user_id) !== Number(userData.id)) return;
      appendUnique(data);
      scrollToBottom();
    });

    return () => {
      channel.unbind(EVENT);
      pusher.unsubscribe(CHANNEL);
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userData?.id]);

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      const res: any = await mutateAsync(values as any);

      // الردّ يحمل الرسالة المحفوظة — تُلحَق فوراً ولا يُعاد جلبُ المستخدم
      const sent: ChatMessage | undefined = res?.data?.data ?? res?.data;
      if (sent?.id) {
        appendUnique(sent);
        scrollToBottom();
      }

      resetForm();
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  const fileRef = useRef<any>(null);

  // on mark as read ================>

  const onInputFocus = async () => {
    try {
      await axios.post(`/mark-chat-as-read/${userData?.id}`, {});
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Formik
      initialValues={{
        message: "",
        file: "",
      }}
      onSubmit={onSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="flex flex-col gap-4 p-4 rounded-card overflow-hidden w-full bg-surface border border-line shadow-card">
          {/*
          ⛔ **`font-gilroy` عائلةٌ غير معرَّفة** في الإعداد ⇒ صنفٌ صامت.
          ⛔ **و`!h-[585px]` ارتفاعٌ مكوَّدٌ لقائمة الرسائل** — لا يتبع
             الشاشة: على شاشةٍ قصيرة يخرج المؤلِّفُ تحت الطيّة، وعلى شاشةٍ
             طويلة يبقى نصفُ المساحة فارغاً. صار يتبع ارتفاعَ النافذة.
          ⛔ **و`bg-stone-900`/`bg-neutral-800`** من لوحة Tailwind
             الافتراضية لا من حياديّ اللوحة ⇒ رماديٌّ دافئٌ ناشزٌ بين
             أسطحٍ محايدة.
          */}
          <div className="pt-2 px-2 relative overflow-y-auto h-[min(60vh,585px)]">
            <Msg messages={messages} messagesEndRef={messagesEndRef} />
          </div>

          <div className="flex px-3 py-3 bg-ink-900 border border-line rounded-card gap-2 items-center w-full">
            <div className="flex-1 min-w-0">
              <Input
                name="message"
                placeholder="اكتب رسالتك…"
                className="!bg-ink-800"
                isForm
                onFocus={onInputFocus}
              />
            </div>

            {/*
              🔴 **الأيقونةُ كانت ميكروفوناً والفعلُ فتحُ منتقي ملفات.**
                 المدرّب يضغط ظانّاً أنه يسجّل صوتاً فيُفتح له متصفّحُ
                 الملفّات — إشارةٌ تقول غيرَ ما تفعل. صارت مشبكَ إرفاق.
            */}
            <Button
              onClick={() => fileRef.current.click()}
              size="icon"
              ghost
              title="إرفاق ملف"
              aria-label="إرفاق ملف"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 11.5 12.4 19a4.5 4.5 0 0 1-6.4-6.4l7.8-7.8a3 3 0 1 1 4.2 4.2l-7.7 7.8a1.5 1.5 0 0 1-2.2-2.1l7-7.1" />
              </svg>
            </Button>

            <Button
              type="submit"
              isLoading={isLoading}
              primary
              size="icon"
              title="إرسال"
              aria-label="إرسال"
            >
              {!isLoading && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="rtl:-scale-x-100"
                >
                  <path d="M4 12h13" />
                  <path d="M4 12 20 5l-3 7 3 7z" />
                </svg>
              )}
            </Button>

            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={(e: any) => {
                setFieldValue("file", e.target.files[0]);
                setFieldValue("message", e.target.files[0]?.name);
              }}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}

interface MsgProps {
  messages: Array<{
    file_path: string;
    file: string;
    id: number;
    message: string;
    sender_id: number;
    sender_image: string;
    sender_name: string;
    created_at: string;
    side: "left" | "right";
    to: string;
  }>;
  messagesEndRef: any;
}

function Msg({ messages, messagesEndRef }: MsgProps) {
  /*
   * ═══════════════════════════════════════════════════════════════════════
   *  فقاعاتُ المحادثة — ثلاثةُ أعطالٍ ظاهرة كانت فيها
   * ═══════════════════════════════════════════════════════════════════════
   *
   * 🔴 **`h-12` على كل فقاعة** — ارتفاعٌ ثابتٌ ٤٨px لأيّ رسالة ⇒ **كلُّ
   *    رسالةٍ تتجاوز سطراً واحداً تفيض من فقاعتها** فيقرأ المدرّب أوّلَ
   *    سطرٍ ويُقصّ الباقي. وهي شاشةُ المحادثة مع المشتركين — أطولُ ما
   *    يُقرأ في اللوحة. صار الارتفاعُ يتبع النصّ ويلتفّ.
   *
   * 🔴 **`dir="ltr"` على الحاوية كلِّها** — محادثةٌ عربيةٌ تُرسم من اليسار
   *    إلى اليمين: علاماتُ الترقيم تنقلب إلى الطرف الخطأ، والسطرُ المختلط
   *    (عربيٌّ فيه رقمٌ أو رابط) يتبعثر. صارت `rtl`.
   *
   * 🔴 **ورابطُ الملفّ كان `className="link text-blue-700 collapse"`** —
   *    و`collapse` صنفُ Tailwind معناه `visibility: collapse` (وفي daisyUI
   *    مكوّنُ طيٍّ كامل): في الحالتين **ليس ما قصده الكاتب**. ومعه
   *    `text-blue-700` — أزرقُ داكنٌ على فقاعةٍ داكنة، تباينُه دون الحدّ.
   *    ومعه `w-[300px]` مكوَّد يفيض على الشاشات الضيّقة.
   *
   * ⛔ **وفقاعةُ المدرّب كانت تدرّجاً بنفسجياً** (`from-purple-600`) — آخرُ
   *    بقايا القالب القديم في شاشةٍ يفتحها المدرّب طول اليوم.
   *
   * 📌 **والمفتاح كان مفقوداً**: الحلقةُ تُرجع `<>` بلا `key` ⇒ React يعيد
   *    بناءَ القائمة كلِّها عند كل رسالةٍ جديدة بدل إلحاق واحدة.
   */
  return (
    <div dir="rtl" className="flex flex-col gap-4 px-1">
      {messages?.length > 0 ? (
        messages?.map((message: MsgProps["messages"][0]) => {
          const mine = message.to === "admin";

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2.5 ${
                mine ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {!mine && (
                <div className="avatar w-8 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={message.sender_image || "/images/img_rectangle347.png"}
                    alt=""
                  />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 max-w-[min(78%,520px)] ${
                  mine ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={[
                    "px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
                    mine
                      ? "bg-brand-400 text-ink-950 rounded-2xl rounded-bs-md font-medium"
                      : "bg-ink-800 text-content border border-line rounded-2xl rounded-be-md",
                  ].join(" ")}
                >
                  {message.file !== "" ? (
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noreferrer"
                      className={`underline underline-offset-4 break-all ${
                        mine ? "text-ink-950" : "text-brand-400"
                      }`}
                    >
                      {message.file}
                    </a>
                  ) : (
                    message.message
                  )}
                </div>

                <span className="text-[10px] text-content-faint px-1">
                  {message.created_at}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-content-muted">لا رسائل في هذه المحادثة بعد</p>
        </div>
      )}

      <div ref={messagesEndRef} className="mt-10" />
    </div>
  );
}

export default Chat;
