import { Button, Card, Img, Text } from "components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";

function PlanModal({
  open,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="modal modal-open z-50" dir="rtl">
      <div
        className={`modal-box bg-gray-900_01 border border-blue_gray-900_01 space-y-4 ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        {children}
        <div className="flex justify-start">
          <Button danger size="small" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}

/** محرر حصص التمرين: صفوف (عدّات/وزن/راحة) قابلة للإضافة والحذف */
function SessionsEditor({
  sessions,
  setSessions,
}: {
  sessions: any[];
  setSessions: (s: any[]) => void;
}) {
  const update = (index: number, key: string, value: string) => {
    const next = sessions.map((s, i) =>
      i === index ? { ...s, [key]: value } : s
    );
    setSessions(next);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
        <span>الجلسة</span>
        <span>العدّات</span>
        <span>الوزن (كجم)</span>
        <span>الراحة (ث)</span>
      </div>
      {sessions.map((s, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 items-center">
          <div className="flex items-center gap-1">
            <Text size="xs">#{i + 1}</Text>
            <Button
              size="xSmall"
              danger
              onClick={() => setSessions(sessions.filter((_, x) => x !== i))}
            >
              ×
            </Button>
          </div>
          <input
            type="number"
            className="input input-bordered input-sm bg-transparent"
            value={s.counter}
            onChange={(e) => update(i, "counter", e.target.value)}
          />
          <input
            type="number"
            className="input input-bordered input-sm bg-transparent"
            value={s.weight}
            onChange={(e) => update(i, "weight", e.target.value)}
          />
          <input
            type="number"
            className="input input-bordered input-sm bg-transparent"
            value={s.rest_sec}
            onChange={(e) => update(i, "rest_sec", e.target.value)}
          />
        </div>
      ))}
      <Button
        size="xSmall"
        secondaryBorder
        onClick={() =>
          setSessions([
            ...sessions,
            { counter: 12, weight: 0, rest_sec: 60, notes: "" },
          ])
        }
      >
        + جلسة
      </Button>
    </div>
  );
}

/** نافذة إضافة تمرين: فئة → تمرين → راحة + حصص */
function AddExerciseModal({
  open,
  onClose,
  userId,
  stepId,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  stepId: number;
  onAdded: () => void;
}) {
  const axios = useAxios({});

  const [categories, setCategories] = useState<any[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");

  const [exercises, setExercises] = useState<any[]>([]);

  const [exerciseId, setExerciseId] = useState<string>("");

  const [restSec, setRestSec] = useState<string>("60");

  const [sessions, setSessions] = useState<any[]>([
    { counter: 12, weight: 0, rest_sec: 60, notes: "" },
    { counter: 12, weight: 0, rest_sec: 60, notes: "" },
    { counter: 12, weight: 0, rest_sec: 60, notes: "" },
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const getCategories = async () => {
      try {
        const { data } = await axios.get("/exercise-categories");
        setCategories(data.data ?? []);
      } catch {
        setCategories([]);
      }
    };
    getCategories();
  }, [open]);

  useEffect(() => {
    if (!categoryId) return;
    const getExercises = async () => {
      try {
        const { data } = await axios.get(
          `/exercises?exercise_category_id=${categoryId}`
        );
        setExercises(data.data ?? []);
      } catch {
        setExercises([]);
      }
    };
    getExercises();
  }, [categoryId]);

  const onSave = async () => {
    if (!exerciseId) {
      toast.error("اختر تمريناً");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`/users/${userId}/training-steps/${stepId}/exercises`, {
        exercise_id: Number(exerciseId),
        rest_sec: Number(restSec || 60),
        sessions: sessions.map((s) => ({
          counter: Number(s.counter || 0),
          weight: Number(s.weight || 0),
          rest_sec: Number(s.rest_sec || 60),
          notes: s.notes ?? "",
        })),
      });
      toast.success("تم إضافة التمرين");
      onAdded();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PlanModal open={open} onClose={onClose} wide>
      <Text size="xl" className="font-bold">
        إضافة تمرين لهذا اليوم (لهذا المستخدم فقط)
      </Text>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Text size="xs">فئة التمرين:</Text>
          <select
            className="select select-bordered w-full bg-transparent"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setExerciseId("");
            }}
          >
            <option value="" className="bg-gray-900">
              اختر فئة
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-gray-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Text size="xs">التمرين:</Text>
          <select
            className="select select-bordered w-full bg-transparent"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
          >
            <option value="" className="bg-gray-900">
              اختر تمريناً
            </option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id} className="bg-gray-900">
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Text size="xs">وقت الراحة بين التمارين (ثانية):</Text>
        <input
          type="number"
          className="input input-bordered input-sm w-32 bg-transparent"
          value={restSec}
          onChange={(e) => setRestSec(e.target.value)}
        />
      </div>

      <SessionsEditor sessions={sessions} setSessions={setSessions} />

      <Button primary size="small" isLoading={saving} onClick={onSave}>
        إضافة التمرين
      </Button>
    </PlanModal>
  );
}

/** صف تمرين داخل يوم: الحالة + الحصص + تعديل/حذف */
function ExerciseRow({
  exercise,
  userId,
  onChanged,
  isSubstitute = false,
}: {
  exercise: any;
  userId: string;
  onChanged: () => void;
  isSubstitute?: boolean;
}) {
  const axios = useAxios({});

  const [editOpen, setEditOpen] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);

  const [busy, setBusy] = useState(false);

  const sessionsSummary = (exercise.sessions ?? [])
    .map((s: any) => `${s.counter}${Number(s.weight) ? `×${s.weight}كجم` : ""}`)
    .join(" ، ");

  const onOpenEdit = () => {
    setSessions(
      (exercise.sessions ?? []).map((s: any) => ({
        counter: s.counter ?? 0,
        weight: s.weight ?? 0,
        rest_sec: s.rest_sec ?? 60,
        notes: s.notes ?? "",
      }))
    );
    setEditOpen(true);
  };

  const onSaveSessions = async () => {
    if (sessions.length === 0) {
      toast.error("أضف جلسة واحدة على الأقل");
      return;
    }
    setBusy(true);
    try {
      await axios.put(`/users/${userId}/training-exercises/${exercise.id}`, {
        sessions: sessions.map((s) => ({
          counter: Number(s.counter || 0),
          weight: Number(s.weight || 0),
          rest_sec: Number(s.rest_sec || 60),
          notes: s.notes ?? "",
        })),
      });
      toast.success("تم تعديل الحصص");
      setEditOpen(false);
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(`حذف تمرين «${exercise.name}» من يوم المستخدم؟`))
      return;
    setBusy(true);
    try {
      await axios.delete(`/users/${userId}/training-exercises/${exercise.id}`);
      toast.success("تم حذف التمرين");
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border border-blue_gray-900_01 p-2 ${
        isSubstitute ? "mr-8 opacity-90" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden">
          <Img
            src={exercise.muscle_image}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text size="xs" className="font-bold">
              {exercise.name}
            </Text>
            {isSubstitute && (
              <span className="badge badge-xs badge-outline">بديل</span>
            )}
            {exercise.user_added && (
              <span className="badge badge-xs badge-info">مضاف</span>
            )}
          </div>
          <Text size="xs" className="text-gray-400">
            {sessionsSummary || "بلا حصص"} · راحة {exercise.rest_sec ?? 0}ث
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {exercise.done ? (
          <span className="badge badge-success badge-sm">✓ منجز</span>
        ) : (
          <span className="badge badge-ghost badge-sm">غير منجز</span>
        )}
        <Button size="xSmall" secondaryBorder onClick={onOpenEdit}>
          تعديل
        </Button>
        <Button size="xSmall" danger disabled={busy} onClick={onDelete}>
          حذف
        </Button>
      </div>

      <PlanModal open={editOpen} onClose={() => setEditOpen(false)}>
        <Text size="xl" className="font-bold">
          تعديل حصص «{exercise.name}»
        </Text>
        <SessionsEditor sessions={sessions} setSessions={setSessions} />
        <Button primary size="small" isLoading={busy} onClick={onSaveSessions}>
          حفظ الحصص
        </Button>
      </PlanModal>
    </div>
  );
}

/** بطاقة خطوة (يوم تدريب أو راحة) مع تمارينها وحالة إنجازها */
function StepCard({
  step,
  userId,
  onChanged,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  step: any;
  userId: string;
  onChanged: () => void;
  onMove: (stepId: number, direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [expanded, setExpanded] = useState(step.is_current);

  const [addOpen, setAddOpen] = useState(false);

  const isRest = step.type === "rest";

  return (
    <Card
      className={`p-4 space-y-3 ${
        step.is_current ? "!border-deep_purple-A200 border-2" : ""
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer flex-wrap gap-2"
        onClick={() => !isRest && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {step.image && (
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <Img src={step.image} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Text className="font-bold">
                {step.step_num}. {step.name}
              </Text>
              {step.is_current && (
                <span className="badge badge-sm badge-primary">
                  الخطوة الحالية
                </span>
              )}
            </div>
            {!isRest && (
              <Text size="xs" className="text-gray-400">
                {step.exercises?.length ?? 0} تمارين
                {step.time_spent_in_minutes
                  ? ` · ${step.time_spent_in_minutes} دقيقة`
                  : ""}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!step.done && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn btn-xs btn-outline"
                title="تقديم اليوم"
                disabled={!canMoveUp}
                onClick={() => onMove(step.id, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-xs btn-outline"
                title="تأخير اليوم"
                disabled={!canMoveDown}
                onClick={() => onMove(step.id, 1)}
              >
                ↓
              </button>
            </div>
          )}
          {step.done ? (
            <span className="badge badge-success">
              ✓ مكتمل {step.done_date ? `· ${step.done_date}` : ""}
            </span>
          ) : (
            <span className="badge badge-ghost">غير مكتمل</span>
          )}
          {!isRest && (
            <Button
              size="xSmall"
              secondaryBorder
              onClick={(e?: any) => {
                e?.stopPropagation?.();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "إخفاء" : "التمارين"}
            </Button>
          )}
        </div>
      </div>

      {isRest && (step.free_sessions?.length ?? 0) > 0 && (
        <div className="border-t border-blue_gray-900_01 pt-2 space-y-1">
          <Text size="xs" className="text-gray-400">
            جلسات حرّة مسجّلة:
          </Text>
          {step.free_sessions.map((fs: any) => (
            <Text key={fs.id} size="xs">
              · {fs.time_spent_in_minutes} دقيقة —{" "}
              {fs.exercises
                ?.map((e: any) => `${e.name} (${e.sets}×${e.reps})`)
                .join(" ، ")}
            </Text>
          ))}
        </div>
      )}

      {!isRest && expanded && (
        <div className="space-y-2 border-t border-blue_gray-900_01 pt-3">
          {step.exercises?.map((exercise: any) => (
            <div key={exercise.id} className="space-y-2">
              <ExerciseRow
                exercise={exercise}
                userId={userId}
                onChanged={onChanged}
              />
              {exercise.substitutes?.map((sub: any) => (
                <ExerciseRow
                  key={sub.id}
                  exercise={sub}
                  userId={userId}
                  onChanged={onChanged}
                  isSubstitute
                />
              ))}
            </div>
          ))}

          <Button size="small" primary onClick={() => setAddOpen(true)}>
            + إضافة تمرين
          </Button>
        </div>
      )}

      <AddExerciseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        userId={userId}
        stepId={step.id}
        onAdded={onChanged}
      />
    </Card>
  );
}

/** تبويب الجدول التدريبي: الفئة + تقدم الأسبوع + الخطوات بحالة إنجازها */
function TrainingTab({ userId }: { userId: string }) {
  const axios = useAxios({});

  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string>("");

  const [reordering, setReordering] = useState(false);

  const load = async () => {
    try {
      const { data: res } = await axios.get(`/users/${userId}/training`);
      setData(res.data);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "تعذر تحميل الجدول التدريبي");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  if (loading) return <div>جارِ التحميل...</div>;

  if (error) return <Text className="text-red-500">{error}</Text>;

  const week = data?.week;

  // ترتيب الأيام: تبديل الخطوة مع جارتها ضمن غير المنجزة فقط (المنجزة مثبّتة)
  const pendingIds: number[] =
    week?.steps?.filter((s: any) => !s.done).map((s: any) => s.id) ?? [];

  const moveStep = async (stepId: number, direction: -1 | 1) => {
    const index = pendingIds.indexOf(stepId);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= pendingIds.length || reordering)
      return;

    const ids = [...pendingIds];
    [ids[index], ids[target]] = [ids[target], ids[index]];

    setReordering(true);
    try {
      await axios.post(
        `/users/${userId}/training-weeks/${week.week_id}/reorder-steps`,
        { step_ids: ids }
      );
      toast.success("تم تحديث ترتيب الأيام");
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Text size="xl" className="font-bold">
              {data?.category?.name}{" "}
              <span className="badge badge-outline">
                {data?.category?.home ? "منزل" : "نادي"}
              </span>
            </Text>
            <Text size="xs" className="text-gray-400">
              الأسبوع {week?.week_num} من {data?.category?.total_weeks} ·
              أُنجز {week?.done_training} من {week?.total_training} أيام تدريب
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {data?.weeks_history?.map((w: any) => (
              <span
                key={w.id}
                title={w.name}
                className={`badge ${
                  w.is_current
                    ? "badge-primary"
                    : w.done
                    ? "badge-success"
                    : "badge-ghost"
                }`}
              >
                أسبوع {w.week_num}
              </span>
            ))}
          </div>
        </div>
        <progress
          className="progress progress-success w-full"
          value={week?.progress_percent ?? 0}
          max={100}
        />
      </Card>

      <div className="space-y-3">
        {week?.steps?.map((step: any) => (
          <StepCard
            key={step.id}
            step={step}
            userId={userId}
            onChanged={load}
            onMove={moveStep}
            canMoveUp={!reordering && pendingIds.indexOf(step.id) > 0}
            canMoveDown={
              !reordering &&
              pendingIds.indexOf(step.id) !== -1 &&
              pendingIds.indexOf(step.id) < pendingIds.length - 1
            }
          />
        ))}
      </div>
    </div>
  );
}

export default TrainingTab;
