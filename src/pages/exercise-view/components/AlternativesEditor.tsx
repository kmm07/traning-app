import { Button, Card, Select, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import useAxios from "hooks/useAxios";
import { useEffect, useMemo, useState } from "react";
import { UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";
import { useConfirm } from "components/ConfirmDialog/context";
import ExerciseMedia from "./ExerciseMedia";
import { exerciseOptionLabel, toExerciseOption } from "./ExerciseOptionLabel";

interface Props {
  exercise: any;
  /** فئةُ التمرين المفتوح — يُقرأ منها مكانُه (جيم/منزل) فلا يُقترح بديلٌ من غيره. */
  categoryData: any;
}

/**
 * بدائلُ التمرين — إضافةٌ وحذفٌ وترتيبٌ، **وكلُّ فعلٍ يُحفظ فوراً**: القائمةُ
 * كلُّها تُرسَل إلى `PUT exercises/{id}/alternatives` فتصير هي الحالة، والردُّ
 * يعيدها بصورها فتُرسَم منه لا من التخمين.
 *
 * والعرضُ بالمكوّن نفسه الذي تُعرض به التمارين الأساسية (`ExerciseMedia`) —
 * صورةُ العضلة ولقطةُ الفيديو، وتتكبّر وتشتغل عند المرور.
 */
function AlternativesEditor({ exercise, categoryData }: Props) {
  const confirm = useConfirm();
  const axios = useAxios({});
  const queryClient = useQueryClient();

  const [alts, setAlts] = useState<any[]>(exercise?.alternatives ?? []);
  const [saving, setSaving] = useState(false);
  const [pickCategory, setPickCategory] = useState<any>(null);
  const [pickExercise, setPickExercise] = useState<any>(null);

  // درجٌ واحد يُعاد استعماله لكل صفّ ⇒ الحالةُ تُعاد عند تبدّل التمرين.
  useEffect(() => {
    setAlts(exercise?.alternatives ?? []);
    setPickExercise(null);
  }, [exercise?.id, exercise?.alternatives]);

  // الفئاتُ من مكان التمرين نفسه — والخادمُ يرفض غيرَه على أيّ حال.
  const { data: categories = [] }: UseQueryResult<any> = useGetQuery(
    "/exercise-categories",
    "/exercise-categories",
    {
      select: ({ data }: any) =>
        data.data
          .filter((c: any) => c.home === categoryData?.home)
          .map((c: any) => ({ label: c.name, value: c.id })),
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!pickCategory && categoryData?.id) {
      setPickCategory({ label: categoryData.name, value: categoryData.id });
    }
  }, [categoryData, pickCategory]);

  const exercisesURL = `/exercises?exercise_category_id=${pickCategory?.value}`;
  const { data: candidates = [], isLoading: isCandidatesLoading }: UseQueryResult<any> =
    useGetQuery(exercisesURL, exercisesURL, {
      select: ({ data }: any) => data.data,
      enabled: ![undefined, null, ""].includes(pickCategory?.value),
      refetchOnWindowFocus: false,
    });

  const options = useMemo(() => {
    const taken = new Set([exercise?.id, ...alts.map((a) => a.id)]);
    return candidates
      .filter((c: any) => !taken.has(c.id))
      .map((c: any) => ({ ...toExerciseOption(c), raw: c }));
  }, [candidates, alts, exercise?.id]);

  const save = async (next: any[]) => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        `/exercises/${exercise.id}/alternatives`,
        { alternative_ids: next.map((a) => a.id) }
      );
      setAlts(data.data ?? []);
      toast.success("تم حفظ البدائل");
      // القائمةُ في الجدول تعرض البدائل أيضاً.
      queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${categoryData?.id}`
      );
      return true;
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= alts.length) return;
    const next = [...alts];
    [next[i], next[j]] = [next[j], next[i]];
    void save(next);
  };

  const remove = async (alt: any) => {
    if (
      !(await confirm({
        title: "حذف البديل؟",
        message: `«${alt.name}» لن يبقى بديلاً لـ«${exercise?.name ?? ""}».`,
      }))
    ) {
      return;
    }
    void save(alts.filter((a) => a.id !== alt.id));
  };

  const add = async () => {
    if (!pickExercise) return;
    const ok = await save([...alts, { id: pickExercise.value }]);
    if (ok) setPickExercise(null);
  };

  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <Card className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <Text size="3xl">التمارين البديلة</Text>
        <Text className="!text-sm opacity-60">{alts.length} / 10</Text>
      </div>
      <hr />

      {alts.length === 0 ? (
        <Text className="opacity-70">لا بدائل لهذا التمرين.</Text>
      ) : (
        <ol className="flex flex-col gap-3">
          {alts.map((alt, i) => (
            <li
              key={alt.id}
              className="flex items-center gap-4 rounded-xl bg-black/20 px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
                {i + 1}
              </span>
              <ExerciseMedia exercise={alt} video={alt.video} />
              <div className="flex flex-1 flex-col">
                <span className="text-white">{alt.name}</span>
                <span className="text-xs opacity-60">
                  #{alt.id}
                  {alt.category_name ? ` · ${alt.category_name}` : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  title="أعلى"
                  className={iconBtn}
                  disabled={saving || i === 0}
                  onClick={() => move(i, -1)}
                >
                  ▲
                </button>
                <button
                  type="button"
                  title="أسفل"
                  className={iconBtn}
                  disabled={saving || i === alts.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ▼
                </button>
                <button
                  type="button"
                  title="حذف"
                  className={`${iconBtn} !bg-red-500/70 hover:!bg-red-500`}
                  disabled={saving}
                  onClick={() => remove(alt)}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 p-4">
        <Text className="!text-base">إضافة بديل</Text>
        <div className="grid grid-cols-2 gap-4">
          <Select
            name="alt_category"
            label="الفئة"
            isForm={false}
            options={categories}
            value={pickCategory}
            onChange={(e: any) => {
              setPickCategory(e);
              setPickExercise(null);
            }}
          />
          <Select
            name="alt_exercise"
            label="التمرين"
            isForm={false}
            isLoading={isCandidatesLoading}
            options={options}
            formatOptionLabel={exerciseOptionLabel}
            value={pickExercise}
            onChange={(e: any) => setPickExercise(e)}
          />
        </div>
        <div>
          <Button
            primary
            className="!w-fit px-6"
            isLoading={saving}
            onClick={add}
            disabled={!pickExercise || alts.length >= 10}
          >
            إضافة
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AlternativesEditor;
