import Chat from "./Chat";
import UsersInfo from "shared/UserInfo";

function MessagesSideBAr() {
  return (
    <div className="flex flex-col gap-2 mt-[5px] w-full h-full">
      <UsersInfo />

      <Chat messages={[]} />
    </div>
  );
}

export default MessagesSideBAr;
