import { Button, Card, Img, Text } from "components";
import { useNavigate } from "react-router-dom";

function Info() {
  return (
    <div className="flex h-full gap-[13px] w-full">
      <Img
        className="h-[107px] md:h-auto mt-[7px] object-cover rounded-[12px]"
        src="/images/img_rectangle347.png"
        alt="rectangle347"
      />
      <div className="flex flex-col gap-[5px] items-start justify-start">
        <Text className="text-xl tracking-[-0.40px]">kmm</Text>
        <Text className="text-xs tracking-[-0.24px]">@maddison_c21</Text>
        <Text className="text-sm tracking-[-0.28px]">0502232</Text>
        <Text className="text-sm tracking-[-0.28px]">انثى</Text>
      </div>
    </div>
  );
}

function UsersInfo({ showUserInfo = true }: { showUserInfo?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 mt-[5px] w-full">
      <div className="grid grid-cols-3 gap-[9px] justify-between w-full">
        <Info />

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
          <div className="font-roboto text-center p-2 border-2 rounded-md border-blue_gray-400 border-solid">
            <Text size="2xl">250</Text>
          </div>
        </Card>
        <Card className="p-4 space-y-4">
          <div className="flex flex-row gap-2 items-start justify-between m-2  md:w-full border-b-2 pb-2">
            <Img
              className="h-[31px] md:h-auto object-cover"
              src="/images/img_checkmark.svg"
              alt="coinOne"
            />
            <Text bold size="2xl">
              مشترك
            </Text>
          </div>
          <div dir="ltr" className=" flex text-center divide-x-2 ">
            <div className="flex-1 p-2">
              <Text size="xl">جديد</Text>
            </div>
            <div className="flex-1 flex px-2  flex-col">
              <Text>تاريخ الاشتراك</Text>
              <Text>2023/5/15</Text>
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
                <Text size="xs">تاريخ اخر ظهور </Text>
                <Text size="sm">2023/4/15</Text>
              </div>
              <div className="px-2">
                <Text size="xs">تاريخ اول ظهور </Text>
                <Text size="sm">2023/4/15</Text>
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
