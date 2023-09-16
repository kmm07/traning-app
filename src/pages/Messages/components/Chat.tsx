import { Button, Img, Input } from "components";
import { Form, Formik } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";

function Chat({ userData }: { userData: any }) {
  const url = `/send-message/${userData?.id}`;

  const [messages, seMessages] = useState<any>(userData?.chat);

  const { mutateAsync, isLoading } = usePostQuery({ url });

  const pusher = new Pusher("b48f98218c05a058e5a5", {
    cluster: "eu",
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

  useEffect(() => {
    const channel = pusher.subscribe("personal-trainer");
    channel.bind("chat", (data: any) => {
      seMessages((prev: any) => [...prev, data]);
      scrollToBottom();
    });
    return () => {
      channel.unbind("chat");
      channel.unsubscribe();
    };
  }, []);

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      await mutateAsync(values as any);
      resetForm();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{
        message: "",
      }}
      onSubmit={onSubmit}
    >
      <Form className="flex flex-col font-gilroy gap-[35px] h-[585px] p-[18px] rounded-3xl overflow-hidden w-full shadow-bs">
        <div className="h-full pt-3 px-3 relative overflow-y-scroll">
          <Msg messages={messages} messagesEndRef={messagesEndRef} />
        </div>

        <div className="flex px-6 py-5 bg-stone-900  gap-1 items-center justify-start w-full">
          <Button type="submit" isLoading={isLoading}>
            <Img className="h-[41px]" src="/images/img_send.svg" alt="send" />
          </Button>

          <Input
            name="message"
            placeholder="Type your message"
            className="h-12 px-5 py-2 bg-neutral-800 rounded-lg"
            isForm
          />
          <Img
            className="h-[41px]"
            src="/images/img_microphone.svg"
            alt="microphone"
          />
        </div>
      </Form>
    </Formik>
  );
}

interface MsgProps {
  messages: Array<{
    file: string;
    id: number;
    message: string;
    sender_id: number;
    sender_image: string;
    sender_name: string;
    side: "left" | "right";
    to: string;
  }>;
  messagesEndRef: any;
}

function Msg({ messages, messagesEndRef }: MsgProps) {
  return (
    <div dir="ltr">
      {messages?.map((message: MsgProps["messages"][0]) => (
        <>
          {message.to !== "admin" && (
            <div className="chat chat-start">
              <div className="chat-image avatar w-10 overflow-hidden rounded-full">
                <img
                  src={message.sender_image || "/images/img_rectangle347.png"}
                />
              </div>

              <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
                {message.file ? (
                  <a
                    href={message.file}
                    className="link text-blue-700 collapse  overflow-ellipsis w-[300px]"
                    target="_blank"
                  >
                    {message.file}{" "}
                  </a>
                ) : (
                  message.message
                )}
              </div>
            </div>
          )}
          {message.to === "admin" && (
            <div className="chat chat-end">
              <div className="h-12 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white flex items-center">
                {message.message}
              </div>
            </div>
          )}
        </>
      ))}

      <div ref={messagesEndRef} className="mt-16" />
    </div>
  );
}

export default Chat;
