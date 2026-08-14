import { Button, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";

const PER_PAGE = 15;

export interface InUsePayload {
  usage_count: number;
  recipes: Array<{ id: number; name: string }>;
}

interface Props {
  /** اسم المكوّن المطلوب حذفه — يُعرض في السؤال */
  name: string;
  /** معرّفه، كي لا يُقترح بديلاً عن نفسه */
  id: number;
  payload: InUsePayload;
  isLoading: boolean;
  onCancel: () => void;
  onReplace: (replacementId: number) => void;
  onForce: () => void;
}

/**
 * حوارُ قرارٍ لا رسالةَ خطأ.
 *
 * 🔴 الخادم صار يردّ **422 `ingredient_in_use`** على حذف مكوّنٍ تستعمله وصفات
 * (كان يقبل الحذف ويترك في كل وصفةٍ صفَّ ربطٍ معلَّقاً: المولّد يُسقطه فيأكل
 * المستخدم وصفةً ناقصة، واللوحة كانت تعرضها كاملة). فالمطلوب هنا **ليس إظهار
 * الرسالة** — بل إعطاء المدرّب المخرجين اللذين يقبلهما الخادم:
 * `replace_with_id` أو `force`.
 *
 * ⚠️ **والمقدار لا يتغيّر عند الاستبدال**: تُبدَّل هويةُ المكوّن في الوصفة
 * ويبقى مقداره كما هو ⇒ سعراتُ الوصفة تتبع ماكروز البديل. مكتوبٌ في الواجهة
 * صراحةً لأنه قرارُ تغذيةٍ يخصّ المدرّب لا تفصيلُ تنفيذ.
 */
export default function DeleteIngredientDecision({
  name,
  id,
  payload,
  isLoading,
  onCancel,
  onReplace,
  onForce,
}: Props) {
  const [mode, setMode] = useState<"ask" | "replace" | "force">("ask");

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<{ id: number; name: string } | null>(
    null
  );

  // بحثٌ خادميّ لا محلّيّ — الكتالوج فوق ١٧ ألف مكوّن (سابقة `add-ingredients`).
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const url = `/meal-ingredients?meal_ingredient_category_id=0&per_page=${PER_PAGE}&page=1${
    query ? `&search_query=${encodeURIComponent(query)}` : ""
  }`;

  const { data: results }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[] } }) => data.data ?? [],
    refetchOnWindowFocus: false,
    enabled: mode === "replace" && query.length > 0,
  });

  const options = (results ?? []).filter((item: any) => item.id !== id);

  return (
    <div className="border-2 border-red-500 rounded-lg p-5 space-y-4 bg-black/20">
      <Text size="3xl" className="!text-red-400">
        لا يمكن حذف «{name}» مباشرةً
      </Text>

      <Text as="h5">
        هذا المكوّن مستعمل في <b>{payload.usage_count}</b> وصفة. حذفه بلا بديل
        يجعل تلك الوصفات تُبنى ناقصةً للمستخدمين.
      </Text>

      <div className="max-h-[160px] overflow-y-auto border rounded p-3 space-y-1">
        {payload.recipes.map((recipe) => (
          <Text as="h5" key={recipe.id} className="!text-right">
            • {recipe.name}
          </Text>
        ))}
        {payload.usage_count > payload.recipes.length && (
          <Text as="h5" className="opacity-60">
            … و{payload.usage_count - payload.recipes.length} وصفةً أخرى
          </Text>
        )}
      </div>

      {mode === "ask" && (
        <div className="flex flex-wrap items-center gap-3">
          <Button primary onClick={() => setMode("replace")}>
            استبدله بمكوّن آخر
          </Button>
          <Button danger onClick={() => setMode("force")}>
            احذفه على أي حال
          </Button>
          <Button secondaryBorder onClick={onCancel}>
            إلغاء
          </Button>
        </div>
      )}

      {mode === "replace" && (
        <div className="space-y-3">
          <Text as="h5">ابحث عن البديل:</Text>

          {/* حقلٌ حرّ خارج Formik — هذه الشاشة ليست نموذجاً */}
          <input
            className="w-full border rounded-full px-6 py-2 bg-transparent"
            placeholder="اكتب اسم المكوّن…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPicked(null);
            }}
          />

          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {options.map((item: any) => (
              <div
                key={item.id}
                onClick={() => setPicked({ id: item.id, name: item.name })}
                className={`cursor-pointer rounded px-3 py-2 flex justify-between ${
                  picked?.id === item.id ? "bg-primary/30" : "hover:bg-white/5"
                }`}
              >
                <span>{item.name}</span>
                <span className="opacity-60">
                  {Number(item.calories).toFixed(0)} سعرة / {item.size}
                  {item.measure}
                </span>
              </div>
            ))}
            {query.length > 0 && options.length === 0 && (
              <Text as="h5" className="opacity-60">
                لا نتائج
              </Text>
            )}
          </div>

          {picked && (
            <Text as="h5" className="!text-yellow-400">
              ⚠️ سيُستبدل «{name}» بـ«{picked.name}» في {payload.usage_count}{" "}
              وصفة. <b>المقدار لا يتغيّر</b> — والسعرات ستتبع ماكروز البديل.
            </Text>
          )}

          <div className="flex items-center gap-3">
            <Button
              primary
              isLoading={isLoading}
              onClick={() => picked && onReplace(picked.id)}
              className={!picked ? "opacity-40 pointer-events-none" : ""}
            >
              استبدل واحذف
            </Button>
            <Button secondaryBorder onClick={() => setMode("ask")}>
              رجوع
            </Button>
          </div>
        </div>
      )}

      {mode === "force" && (
        <div className="space-y-3">
          <Text as="h5" className="!text-red-400">
            سيُحذف المكوّن وتبقى الوصفات الـ{payload.usage_count} تشير إليه، فلن
            يظهر فيها للمستخدم ولن تُحتسب سعراته. هل أنت متأكّد؟
          </Text>
          <div className="flex items-center gap-3">
            <Button danger isLoading={isLoading} onClick={onForce}>
              نعم، احذفه
            </Button>
            <Button secondaryBorder onClick={() => setMode("ask")}>
              رجوع
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
