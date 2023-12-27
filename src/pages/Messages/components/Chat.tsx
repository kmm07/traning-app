import { Button, Img, Input, Text } from "components";
import { Form, Formik } from "formik";
import { usePostQuery } from "hooks/useQueryHooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import { useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";

function Chat({ userData }: { userData: any }) {
  const url = `/send-message/${userData?.id}`;

  const [messages, seMessages] = useState<any>([]);

  // const [pusher,setPusher] = useState<any>(null);

  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  
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
    seMessages(userData?.chat);
    let timout: any = null;

    if (userData?.chat?.length > 0) {
      timout = setTimeout(() => {
        scrollToBottom();
      }, 100);
    }

    return () => {
      clearTimeout(timout);
    };
  }, [userData?.chat, userData?.id]);

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

  const queryClient = useQueryClient();

  const axios = useAxios({});

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      await mutateAsync(values as any);

      await queryClient.invalidateQueries(`/users/${userData?.id}`);

      resetForm();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const fileRef = useRef<any>(null);

  // on mark as read ================>

  const onInputFocus = async () => {
    try {
      await axios.post(`/mark-chat-as-read/${userData?.id}`, {});
    } catch (error: any) {
      toast.error(error.response.data.message);
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
        <Form className="flex flex-col font-gilroy gap-[35px] p-[18px] rounded-3xl overflow-hidden w-full shadow-bs">
          <div className="pt-3 px-3 relative overflow-y-scroll !h-[585px]">
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
              onFocus={onInputFocus}
            />
            <Button onClick={() => fileRef.current.click()}>
              <Img
                className="h-[41px]"
                src="/images/img_microphone.svg"
                alt="microphone"
              />
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
  return (
    <div dir="ltr">
      {messages?.length > 0 ? (
        messages?.map((message: MsgProps["messages"][0]) => (
          <>
            {message.to !== "admin" && (
              <div className="chat chat-start flex flex-col">
                <div className="chat-image avatar w-10 overflow-hidden rounded-full">
                  <img
                    src={message.sender_image || "/images/img_rectangle347.png"}
                  />
                </div>

                <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
                  {message.file !== "" ? (
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
                <Text className="!text-[10px]">{message.created_at}</Text>
              </div>
            )}
            {message.to === "admin" && (
              <div className="chat chat-end flex flex-col">
                <div className="h-12 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white flex items-center">
                  {message.file !== "" ? (
                    <>
                      <a
                        href={message.file}
                        className="link text-white collapse  overflow-ellipsis w-[300px]"
                        target="_blank"
                      >
                        {message.file}
                      </a>
                    </>
                  ) : (
                    <Text as="h2">{message.message}</Text>
                  )}
                </div>
                <Text className="!text-[10px]">{message.created_at}</Text>
              </div>
            )}
          </>
        ))
      ) : (
        <Text as="h1" className="!text-center !text-[30px] w-full">
          لا يوجد رسائل بعد
        </Text>
      )}

      <div ref={messagesEndRef} className="mt-16" />
    </div>
  );
}

export default Chat;
