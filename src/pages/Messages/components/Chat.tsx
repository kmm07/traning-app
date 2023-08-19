import { Img, Input } from "components";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";

type Props = {
  messages: Array<{
    id: string;
    message: string;
    time: string;
    isMine: boolean;
  }>;
};

function Chat({ messages }: Props) {
  return (
    <Formik
      initialValues={{
        frameEighteen: "",
      }}
      onSubmit={(values, { resetForm }) => {
        console.log("values >>>> ", values);
        resetForm();
      }}
    >
      <Form className="flex flex-col font-gilroy gap-[35px] h-[585px] p-[18px] rounded-3xl overflow-hidden w-full shadow-bs">
        <div className="h-full pt-3 px-3 relative overflow-y-scroll">
          <Msg messages={messages} />
        </div>

        <div className="flex px-6 py-5 bg-stone-900  gap-1 items-center justify-start   w-full">
          <Img className="h-[41px]" src="/images/img_send.svg" alt="send" />
          <Input
            name="frameEighteen"
            placeholder="Type your message"
            className="h-12 px-5 py-2 bg-neutral-800 rounded-lg"
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

function Msg({
  messages,
}: {
  messages: Array<{
    id: string;
    message: string;
    time: string;
    isMine: boolean;
  }>;
}) {
  const messagesEndRef = useRef(null);
  const [open, setOpen] = useState(false);
  // const scrollToBottom = () => {
  //   if (
  //     messagesEndRef.current !== null &&
  //     messagesEndRef.current !== undefined
  //   ) {
  //     (messagesEndRef.current as HTMLElement).scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }
  // };

  useEffect(() => {
    console.log("setopen >>>> ", open);
    // scrollToBottom();
    setOpen(true);
  }, [messages]);

  return (
    <div dir="ltr">
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar w-10 overflow-hidden rounded-full">
          <img src="/images/img_rectangle347.png" />
        </div>

        <div className="h-12 px-5 py-2 bg-neutral-800 rounded-lg flex items-center">
          You were the Chosen One!
        </div>
      </div>

      <div className="chat chat-end">
        <div className="h-12 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white flex items-center">
          dsaf
        </div>
      </div>

      <div className="chat chat-end">
        <div className="h-12 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white flex items-center">
          dsaf
        </div>
      </div>

      <div className="chat chat-end">
        <div className="h-12 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white flex items-center">
          dsaf
        </div>
      </div>

      {open && <div ref={messagesEndRef} />}
    </div>
  );
}

export default Chat;