import UsersInfo from "shared/UserInfo";
import NutritionInfo from "./NutritionInfo";
import HeathInfo from "./HeathInfo";
import TrainingInfo from "./TrainingInfo";

function UsersSideBar({ activeUser }: { activeUser: any }) {
  return (
    <>
      <UsersInfo showUserInfo={false} activeUser={activeUser} />

      <HeathInfo activeUser={activeUser} />

      <NutritionInfo activeUser={activeUser} />

      <TrainingInfo activeUser={activeUser} />
    </>
  );
}

export default UsersSideBar;
