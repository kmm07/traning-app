import { Card, Img, Text } from "components";
import { RowTable } from "components/RowTable";

interface SideBarProps {
  ingredients: any;
}

function SideBar({ ingredients = [] }: SideBarProps) {
  console.log(
    "🚀 ~ file: SideBar.tsx:11 ~ SideBar ~ ingredients:",
    ingredients
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Img className="w-24" src="/images/img_rectangle347.png" />
          <Text size="3xl">دجاج</Text>
        </div>
      </div>
      <RowTable
        data={{
          columns: ["1", "2", "3", "4", "5", "6", "7"],
          header: [
            "السعرات",
            "البروتين",
            "الكاربوهيدرات",
            "الدهون",
            "الدهون المتحولة",
            "السكريات",
            "الحجم",
          ],
        }}
        title="القيمة الغذائية"
      />
      <Card className="px-4 pb-4">
        <div className="flex justify-between p-4 border-b">
          <Text size="3xl">حجم الحصة</Text>
          <span className=" border rounded-full px-10 py-2 flex justify-center items-center border-[#CFFF0F]">
            20
          </span>
        </div>
      </Card>
    </div>
  );
}

export default SideBar;
