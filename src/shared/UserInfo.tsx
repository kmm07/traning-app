import { Button, Card, Img, Input, SubState, Text } from "components";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Info({ activeUser }: { activeUser: any }) {
  return (
    <div className="flex h-full gap-[13px] w-full">
      <Img
        className="h-[107px] md:h-auto mt-[7px] object-cover rounded-[12px]"
        src="/images/img_rectangle347.png"
        alt="rectangle347"
      />
      <div className="flex flex-col gap-[5px] items-start justify-start">
        <Text className="text-sm tracking-[-0.28px]">{activeUser?.name}</Text>
        <Text className="text-xs tracking-[-0.24px]">{activeUser?.email}</Text>
        <Text className="text-sm tracking-[-0.28px]">{activeUser?.phone}</Text>
        <Text className="text-xl tracking-[-0.40px]">{activeUser?.gender}</Text>
      </div>
    </div>
  );
}

function UsersInfo({
  activeUser,
  showUserInfo = true,
  location = "users",
}: {
  showUserInfo?: boolean;
  activeUser: any;
  location?: string;
}) {
  const navigate = useNavigate();

  const onShowUserSubscriptions = () =>
    navigate(`/users/${activeUser?.id}/subscriptions`);

  return (
    <div className="flex flex-col gap-2 mt-[5px] w-full">
      <div className="grid grid-cols-3 gap-[9px] justify-between w-full">
        <Info activeUser={activeUser} />

        <Card className="p-4 space-y-4">
          <div className="flex flex-row gap-2 items-start justify-between m-2  md:w-full">
            <Img
              className="h-[31px] md:h-auto object-cover"
              src="/images/img_coin1.png"
              alt="coinOne"
            />
            <Text size="2xl" className="mt-1  tracking-[0.14px]">
              النقاط
            </Text>
          </div>
          {location === "users" ? (
            <Input
              name="points"
              className="w-[100px] text-center font-bold !text-[30px]"
            />
          ) : (
            <Text size="2xl" className="mt-1  tracking-[0.14px]">
              {activeUser?.points}
            </Text>
          )}
        </Card>
        <Card
          className="p-4 space-y-4 cursor-pointer"
          onClick={onShowUserSubscriptions}
        >
          <div className="m-2  md:w-full border-b-2 pb-2">
            <SubState
              state={activeUser?.subscription_status ?? "free"}
              className="h-8"
              textClassName="text-lg"
            />
          </div>
          <div dir="ltr" className=" flex text-center divide-x-2">
            <div className="flex-1 p-2">
              <Text size="xl">جديد</Text>
            </div>
            <div className="flex-1 flex px-2  flex-col">
              <Text>تاريخ الاشتراك</Text>
              <Text>
                {moment(activeUser?.subscription_date).format("YYYY-MM-DD")}
              </Text>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex gap-4">
        <div className="space-y-2">
          <Card>
            <div
              dir="ltr"
              className="p-4 gap-2 divide-x-2 divide-violet-500 flex"
            >
              <div className="px-2">
                <Text size="xs">تاريخ اخر ظهور : </Text>
                <Text size="sm">
                  {activeUser?.last_attendance !== "No Attendance"
                    ? moment(new Date(activeUser?.last_attendance)).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : "لا يوجد حضور"}
                </Text>
              </div>
              <div className="px-2">
                <Text size="xs">تاريخ اول ظهور : </Text>
                <Text size="sm">
                  {activeUser?.first_attendance !== "No Attendance"
                    ? moment(new Date(activeUser?.first_attendance)).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : "لا يوجد حضور"}
                </Text>
              </div>
            </div>
          </Card>
          <Card>
            <button className="h-full w-full p-1 text-white ">
              استعادة كلمة المرور
            </button>
          </Card>
        </div>
        <Card className="px-5 py-4 flex justify-between items-center">
          <Text size="2xl" className="!whitespace-normal text-right w-2/3">
            ارسال اشعارات للمستخدم
          </Text>
          <button>
            <Img
              className="h-6 md:h-auto mb-[17px] md:ml-[0] object-cover"
              src="/images/img_group_white_a700.png"
              alt="group_Two"
            />
          </button>
        </Card>
      </div>
      {showUserInfo && (
        <Card className="!w-fit">
          <Button
            className="font-bold  py-4  !w-fit text-xl "
            onClick={() => navigate("/desktophdsix")}
          >
            عرض بيانات المستخدم
          </Button>
        </Card>
      )}
    </div>
  );
}

export default UsersInfo;
