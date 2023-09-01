import { Card, Img, Text } from "components";

function SideBar() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-5">
        <Img className="w-24 rounded-2xl" src="/images/Background5.4.png" />
        <div className="flex flex-col ">
          <Text size="3xl">اليوم الاول</Text>
          <Text size="3xl">علوي</Text>
        </div>
      </div>
      <Card className="flex flex-col gap-5 p-4">
        <Text size="3xl">هدف اليوم </Text>
        <Text size="3xl" lime>
          هدف اليوم التركيز على القوة والتحمل
        </Text>
      </Card>
    </div>
  );
}

export default SideBar;
