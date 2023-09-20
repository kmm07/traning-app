import Chat from "./Chat";
import UsersInfo from "shared/UserInfo";

function MessagesSideBAr({ userData }: { userData: any }) {
  return (
    <div
      className={`flex flex-col gap-2 mt-[5px] w-full ${
        userData?.chat?.length === 0 ? "h-[100%]" : "h-[140%]"
      }`}
    >
      <UsersInfo activeUser={userData} location="message" />

      <Chat userData={userData} />
    </div>
  );
}

export default MessagesSideBAr;
