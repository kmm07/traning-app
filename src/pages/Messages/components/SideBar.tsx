import Chat from "./Chat";
import UsersInfo from "shared/UserInfo";

interface Props {}

function MessagesSideBAr({ userData }: { userData: any }) {
  return (
    <div className="flex flex-col gap-2 mt-[5px] w-full h-full">
      <UsersInfo activeUser={userData} />

      <Chat messages={userData?.chat ?? []} />
    </div>
  );
}

export default MessagesSideBAr;
