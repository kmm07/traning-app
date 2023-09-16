import { Button, Card, Img, Text } from "components";
import { useDeleteQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface SideBarProps {
  weekDayData: any;
}

function WeekDaySideBar({ weekDayData }: SideBarProps) {
  const { id } = useParams();

  const onClose = () => document.getElementById("my-drawer")?.click();
  // ingredients actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/training-week-days/${weekDayData?.id}`);

      await queryClient.invalidateQueries(
        `/training-week-days?training_week_id=${id}`
      );
      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Img
            className="w-24"
            src={weekDayData.image ?? "/images/img_rectangle347.png"}
          />
          <Text size="3xl">asd</Text>
        </div>
      </div>

      <Card className="px-4 pb-4">
        <div className="flex justify-between p-4 border-b">
          <Text size="3xl">حجم الحصة</Text>
          <span className=" border rounded-full px-10 py-2 flex justify-center items-center border-[#CFFF0F]"></span>
        </div>
        <div className="flex justify-between p-4 border-b">
          <Text size="3xl">نوع الحصة</Text>
          <span className=" border rounded-full px-10 py-2 flex justify-center items-center border-[#CFFF0F]"></span>
        </div>

        <div className="flex items-center justify-evenly mt-6">
          <Button className="w-[100px]" primary>
            تعديل
          </Button>
          <Button className="w-[100px]" primary onClick={onClose}>
            إلغاء
          </Button>
          <Button
            className="w-[100px]"
            danger
            onClick={onDeleteItem}
            isLoading={isLoading}
          >
            حذف
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default WeekDaySideBar;
