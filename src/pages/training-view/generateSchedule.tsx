import { Button, Text } from "components";
import { useState } from "react";
import useAxios from "hooks/useAxios";
import { toast } from "react-toastify";

interface GeneratedCategory {
  category_id: number;
  lvl: "junior" | "mid" | "senior";
  days_num: number;
  gender: string;
}

interface Props {
  defaultGender: string;
  defaultLevel: "junior" | "mid" | "senior";
  defaultDays: number;
  onGenerated: (data: GeneratedCategory) => void;
  onClose: () => void;
}

const LEVELS = [
  { label: "مبتدئ", value: "beginner" },
  { label: "متوسط", value: "intermediate" },
  { label: "متقدم", value: "advanced" },
];

// عمود lvl في قاعدة البيانات => مستوى الواجهة المرسل للمولّد
const DB_TO_LEVEL: Record<string, string> = {
  junior: "beginner",
  mid: "intermediate",
  senior: "advanced",
};

export default function GenerateScheduleForm({
  defaultGender,
  defaultLevel,
  defaultDays,
  onGenerated,
  onClose,
}: Props) {
  const axios = useAxios({ contentType: "application/json" });

  const [gender, setGender] = useState<string>(defaultGender || "male");
  const [level, setLevel] = useState<string>(DB_TO_LEVEL[defaultLevel] ?? "beginner");
  const [days, setDays] = useState<number>(defaultDays || 3);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (replace = false) => {
    setLoading(true);
    try {
      const res = await axios.post("/training-schedules/generate", {
        gender,
        level,
        days_per_week: days,
        replace,
      });

      toast.success(res.data?.message ?? "تم إنشاء الجدول بنجاح");
      onGenerated(res.data.data as GeneratedCategory);
      onClose();
    } catch (error: any) {
      const status = error?.response?.status;
      const body = error?.response?.data;

      // 409 => يوجد جدول مطابق، أكّد الاستبدال قبل إعادة المحاولة
      if (status === 409 && body?.needs_confirmation && !replace) {
        const ok = window.confirm(
          "يوجد جدول تدريب مطابق بالفعل لنفس الجنس والمستوى وعدد الأيام.\n" +
            "هل تريد استبداله؟ سيتم حذف الأسابيع والأيام والتمارين الحالية واستبدالها."
        );
        if (ok) {
          setLoading(false);
          await submit(true);
          return;
        }
      } else {
        toast.error(body?.message ?? "حدث خطأ أثناء إنشاء الجدول");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      <Text as="h1" className="!text-[28px]">
        إنشاء جدول تدريب
      </Text>
      <p className="text-sm opacity-70">
        يتم إنشاء أسبوعين فقط — الأسبوع الأول نسخة A والأسبوع الثاني نسخة B — ويبقى
        الجدول قابلاً للتعديل اليدوي بعد الإنشاء.
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-lg">الجنس</label>
        <select
          className="select select-bordered text-black"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">رجال</option>
          <option value="female">نساء</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg">المستوى</label>
        <select
          className="select select-bordered text-black"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg">عدد أيام التدريب في الأسبوع</label>
        <select
          className="select select-bordered text-black"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          {[2, 3, 4, 5, 6].map((d) => (
            <option key={d} value={d}>
              {d} أيام
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-4 mt-4">
        <Button primary isLoading={loading} onClick={() => submit(false)}>
          إنشاء
        </Button>
        <Button secondaryBorder onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
