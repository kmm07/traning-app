import { Button, Card, Img, Text } from "components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";
import DietTab from "./DietTab";
import TrainingTab from "./TrainingTab";

/**
 * صفحة تخصيص خطة مستخدم واحد: تبويب التغذية (وجبات يومه + تحرير كامل)
 * وتبويب الجدول التدريبي (الأسبوع الحالي + تحرير التمارين) مع حالة الإنجاز.
 */
function UserPlan() {
  const { id } = useParams();

  const navigate = useNavigate();

  const axios = useAxios({});

  const [tab, setTab] = useState<"diet" | "training">("diet");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/users/${id}`);
        setUser(data.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "تعذر تحميل المستخدم");
      }
    };
    getUser();
  }, [id]);

  // فتح شات المستخدم: نفس مصافحة localStorage المتّبعة بين الرسائل والمستخدمين
  const onOpenChat = () => {
    localStorage.setItem("open_chat_user_id", String(id));
    navigate("/dashboard");
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-4 flex items-center justify-between !flex-row">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <Img
              src={user?.image || "/images/img_rectangle347.png"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Text size="2xl" className="font-bold">
              {user?.name ?? "..."}
            </Text>
            <Text size="xs" className="text-gray-400">
              {user?.email}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button secondaryBorder size="small" onClick={onOpenChat}>
            محادثة المستخدم
          </Button>
          <Button
            primaryBorder
            size="small"
            onClick={() => {
              localStorage.setItem("user_id_From_messages", String(id));
              navigate("/users");
            }}
          >
            بيانات المستخدم
          </Button>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          primary={tab === "diet"}
          secondaryBorder={tab !== "diet"}
          onClick={() => setTab("diet")}
        >
          التغذية
        </Button>
        <Button
          primary={tab === "training"}
          secondaryBorder={tab !== "training"}
          onClick={() => setTab("training")}
        >
          الجدول التدريبي
        </Button>
      </div>

      {tab === "diet" ? (
        <DietTab userId={id as string} />
      ) : (
        <TrainingTab userId={id as string} />
      )}
    </div>
  );
}

export default UserPlan;
