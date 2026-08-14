import { Button, Card, Img, Text } from "components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";

const SLOT_LABELS: Record<string, string> = {
  Breakfast: "فطور",
  Lunch: "غداء",
  Dinner: "عشاء",
  Snack: "سناك",
  Extra: "إضافية",
};

const SLOT_OPTIONS = ["Breakfast", "Lunch", "Snack", "Dinner", "Extra"];

/** نافذة عامة بسيطة مُدارة بالحالة (بديلة عن مودال الـcheckbox) */
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

/** لاقط وصفة من مكتبة النظام (فئة المستخدم الغذائية) مع بحث */
function MealPicker({
  userId,
  slot,
  onPick,
  picking,
}: {
  userId: string;
  slot?: string;
  onPick: (meal: any) => void;
  picking: boolean;
}) {
  const axios = useAxios({});

  const [search, setSearch] = useState("");

  const [options, setOptions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/users/${userId}/diet-meal-options?per_page=30${
            slot ? `&meal=${slot}` : ""
          }${search ? `&search=${encodeURIComponent(search)}` : ""}`
        );
        setOptions(data.data.meals ?? []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, slot]);

  return (
    <div className="space-y-3">
      <input
        className="input input-bordered w-full bg-transparent"
        placeholder="ابحث عن وصفة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-72 overflow-y-auto space-y-2">
        {loading && <Text size="xs">جارِ التحميل...</Text>}
        {!loading && options.length === 0 && (
          <Text size="xs">لا توجد وصفات مطابقة</Text>
        )}
        {options.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center justify-between border border-blue_gray-900_01 rounded-xl p-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Img src={opt.image} className="w-full h-full object-cover" />
              </div>
              <Text size="xs">{opt.name}</Text>
            </div>
            <Button
              primary
              size="xSmall"
              className="!px-4"
              disabled={picking}
              onClick={() => onPick(opt)}
            >
              اختيار
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** لاقط مكوّن من قاعدة المكوّنات مع بحث، أو إدخال مكوّن يدوي */
function IngredientForm({
  onSubmit,
  saving,
}: {
  onSubmit: (payload: any) => void;
  saving: boolean;
}) {
  const axios = useAxios({});

  const [mode, setMode] = useState<"library" | "manual">("library");

  const [search, setSearch] = useState("");

  const [options, setOptions] = useState<any[]>([]);

  const [selected, setSelected] = useState<any>(null);

  const [size, setSize] = useState<string>("");

  const [manual, setManual] = useState<any>({
    custom_name: "",
    size: "",
    calories: "",
    protein: "",
    carbohydrate: "",
    fat: "",
  });

  useEffect(() => {
    if (mode !== "library") return;
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/meal-ingredients?meal_ingredient_category_id=0&per_page=15${
            search ? `&search_query=${encodeURIComponent(search)}` : ""
          }`
        );
        setOptions(data.data ?? []);
      } catch {
        setOptions([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, mode]);

  const onSave = () => {
    if (mode === "library") {
      if (!selected || !size) {
        toast.error("اختر مكوناً وحدد الكمية");
        return;
      }
      onSubmit({ meal_ingredient_id: selected.id, size: Number(size) });
    } else {
      if (!manual.custom_name || !manual.size) {
        toast.error("أدخل اسم المكون والكمية");
        return;
      }
      onSubmit({
        custom_name: manual.custom_name,
        size: Number(manual.size),
        calories: Number(manual.calories || 0),
        protein: Number(manual.protein || 0),
        carbohydrate: Number(manual.carbohydrate || 0),
        fat: Number(manual.fat || 0),
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          size="xSmall"
          primary={mode === "library"}
          secondaryBorder={mode !== "library"}
          onClick={() => setMode("library")}
        >
          من القاعدة
        </Button>
        <Button
          size="xSmall"
          primary={mode === "manual"}
          secondaryBorder={mode !== "manual"}
          onClick={() => setMode("manual")}
        >
          مكوّن يدوي
        </Button>
      </div>

      {mode === "library" ? (
        <>
          <input
            className="input input-bordered w-full bg-transparent"
            placeholder="ابحث عن مكوّن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-52 overflow-y-auto space-y-1">
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center justify-between rounded-lg p-2 cursor-pointer border ${
                  selected?.id === opt.id
                    ? "border-deep_purple-A200"
                    : "border-blue_gray-900_01"
                }`}
                onClick={() => {
                  setSelected(opt);
                  if (!size) setSize(String(opt.size ?? ""));
                }}
              >
                <Text size="xs">{opt.name}</Text>
                <Text size="xs" className="text-gray-400">
                  {opt.calories} سعرة / {opt.size} {opt.measure}
                </Text>
              </div>
            ))}
          </div>
          {selected && (
            <div className="flex items-center gap-2">
              <Text size="xs">الكمية ({selected.measure}):</Text>
              <input
                type="number"
                className="input input-bordered input-sm w-28 bg-transparent"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <Text size="xs" className="text-gray-400">
                الماكروز تُحسب تلقائياً من الكمية
              </Text>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input input-bordered bg-transparent col-span-2"
            placeholder="اسم المكوّن"
            value={manual.custom_name}
            onChange={(e) =>
              setManual({ ...manual, custom_name: e.target.value })
            }
          />
          {[
            ["size", "الكمية (جم)"],
            ["calories", "سعرات"],
            ["protein", "بروتين"],
            ["carbohydrate", "كارب"],
            ["fat", "دهون"],
          ].map(([key, label]) => (
            <input
              key={key}
              type="number"
              className="input input-bordered bg-transparent"
              placeholder={label}
              value={manual[key]}
              onChange={(e) => setManual({ ...manual, [key]: e.target.value })}
            />
          ))}
        </div>
      )}

      <Button primary size="small" isLoading={saving} onClick={onSave}>
        إضافة المكوّن
      </Button>
    </div>
  );
}

/** بطاقة وجبة واحدة: حالة التناول + الماكروز + المكوّنات القابلة للتحرير */
function MealCard({
  meal,
  userId,
  onChanged,
}: {
  meal: any;
  userId: string;
  onChanged: () => void;
}) {
  const axios = useAxios({});

  const [expanded, setExpanded] = useState(false);

  const [busy, setBusy] = useState(false);

  const [replaceOpen, setReplaceOpen] = useState(false);

  const [ingredientOpen, setIngredientOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [editName, setEditName] = useState("");

  const [editSlot, setEditSlot] = useState("");

  const [sizeDrafts, setSizeDrafts] = useState<Record<number, string>>({});

  const run = async (fn: () => Promise<any>, done?: string) => {
    setBusy(true);
    try {
      await fn();
      if (done) toast.success(done);
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteMeal = () => {
    if (!window.confirm(`حذف وجبة «${meal.name}» من يوم المستخدم؟`)) return;
    run(
      () => axios.delete(`/users/${userId}/diet-meals/${meal.id}`),
      "تم حذف الوجبة"
    );
  };

  const onReplacePick = (opt: any) =>
    run(async () => {
      await axios.post(`/users/${userId}/diet-meals/${meal.id}/replace`, {
        diet_meal_id: opt.id,
      });
      setReplaceOpen(false);
    }, "تم استبدال الوجبة");

  const onReplaceRandom = () =>
    run(async () => {
      await axios.post(`/users/${userId}/diet-meals/${meal.id}/replace`, {});
      setReplaceOpen(false);
    }, "تم الاستبدال العشوائي");

  const onAddIngredient = (payload: any) =>
    run(async () => {
      await axios.post(
        `/users/${userId}/diet-meals/${meal.id}/ingredients`,
        payload
      );
      setIngredientOpen(false);
    }, "تم إضافة المكوّن");

  const onSaveIngredientSize = (ing: any) => {
    const draft = sizeDrafts[ing.id];
    if (draft === undefined || Number(draft) === Number(ing.size)) return;
    run(async () => {
      await axios.put(`/users/${userId}/diet-meal-ingredients/${ing.id}`, {
        size: Number(draft),
      });
      setSizeDrafts((d) => {
        const next = { ...d };
        delete next[ing.id];
        return next;
      });
    }, "تم تعديل الكمية");
  };

  const onDeleteIngredient = (ing: any) => {
    if (!window.confirm(`حذف مكوّن «${ing.name}»؟`)) return;
    run(
      () => axios.delete(`/users/${userId}/diet-meal-ingredients/${ing.id}`),
      "تم حذف المكوّن"
    );
  };

  const onSaveEdit = () =>
    run(async () => {
      await axios.put(`/users/${userId}/diet-meals/${meal.id}`, {
        ...(editName && editName !== meal.name ? { name: editName } : {}),
        ...(editSlot && editSlot !== meal.meal ? { meal: editSlot } : {}),
      });
      setEditOpen(false);
    }, "تم تعديل الوجبة");

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <Img src={meal.image} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text className="font-bold">{meal.name}</Text>
              <span className="badge badge-sm badge-outline">
                {SLOT_LABELS[meal.meal] ?? meal.meal}
              </span>
              {meal.is_custom && (
                <span className="badge badge-sm badge-info">مخصّصة</span>
              )}
              {meal.is_custom_replacement && (
                <span className="badge badge-sm badge-warning">مستبدلة</span>
              )}
            </div>
            <Text size="xs" className="text-gray-400">
              {meal.calories} سعرة · بروتين {meal.protein} · كارب {meal.carb} ·
              دهون {meal.fat}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {meal.done ? (
            <span className="badge badge-success gap-1">
              ✓ تم تناولها {meal.done_at ? `· ${meal.done_at}` : ""}
            </span>
          ) : meal.skip ? (
            <span className="badge badge-error">تم تخطيها</span>
          ) : (
            <span className="badge badge-ghost">لم تُتناول بعد</span>
          )}
          <Button
            size="xSmall"
            secondaryBorder
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "إخفاء" : "التفاصيل"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 border-t border-blue_gray-900_01 pt-3">
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="text-gray-400">
                  <th>المكوّن</th>
                  <th>الكمية</th>
                  <th>سعرات</th>
                  <th>بروتين</th>
                  <th>كارب</th>
                  <th>دهون</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {meal.ingredients?.map((ing: any) => (
                  <tr key={ing.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {ing.name}
                        {ing.is_manual && (
                          <span className="badge badge-xs badge-info">
                            يدوي
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-20 bg-transparent"
                          value={sizeDrafts[ing.id] ?? ing.size}
                          onChange={(e) =>
                            setSizeDrafts({
                              ...sizeDrafts,
                              [ing.id]: e.target.value,
                            })
                          }
                        />
                        <span className="text-xs text-gray-400">
                          {ing.measure}
                        </span>
                        {sizeDrafts[ing.id] !== undefined &&
                          Number(sizeDrafts[ing.id]) !== Number(ing.size) && (
                            <Button
                              size="xSmall"
                              primary
                              disabled={busy}
                              onClick={() => onSaveIngredientSize(ing)}
                            >
                              حفظ
                            </Button>
                          )}
                      </div>
                    </td>
                    <td>{ing.calories}</td>
                    <td>{ing.protein}</td>
                    <td>{ing.carb}</td>
                    <td>{ing.fat}</td>
                    <td>
                      <Button
                        size="xSmall"
                        danger
                        disabled={busy}
                        onClick={() => onDeleteIngredient(ing)}
                      >
                        حذف
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="small"
              primary
              onClick={() => setIngredientOpen(true)}
            >
              + مكوّن
            </Button>
            <Button
              size="small"
              secondaryBorder
              onClick={() => setReplaceOpen(true)}
            >
              استبدال الوجبة
            </Button>
            <Button
              size="small"
              secondaryBorder
              onClick={() => {
                setEditName(meal.name ?? "");
                setEditSlot(meal.meal ?? "");
                setEditOpen(true);
              }}
            >
              تعديل
            </Button>
            <Button size="small" danger disabled={busy} onClick={onDeleteMeal}>
              حذف الوجبة
            </Button>
          </div>
        </div>
      )}

      <PlanModal open={replaceOpen} onClose={() => setReplaceOpen(false)} wide>
        <Text size="xl" className="font-bold">
          استبدال «{meal.name}»
        </Text>
        <Button
          size="small"
          secondaryBorder
          isLoading={busy}
          onClick={onReplaceRandom}
        >
          استبدال عشوائي من نفس الفئة
        </Button>
        <MealPicker
          userId={userId}
          slot={meal.meal !== "Extra" ? meal.meal : undefined}
          onPick={onReplacePick}
          picking={busy}
        />
      </PlanModal>

      <PlanModal open={ingredientOpen} onClose={() => setIngredientOpen(false)}>
        <Text size="xl" className="font-bold">
          إضافة مكوّن إلى «{meal.name}»
        </Text>
        <IngredientForm onSubmit={onAddIngredient} saving={busy} />
      </PlanModal>

      <PlanModal open={editOpen} onClose={() => setEditOpen(false)}>
        <Text size="xl" className="font-bold">
          تعديل الوجبة
        </Text>
        {meal.is_custom && (
          <div className="space-y-1">
            <Text size="xs">الاسم (وجبة مخصّصة):</Text>
            <input
              className="input input-bordered w-full bg-transparent"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-1">
          <Text size="xs">السلوت:</Text>
          <select
            className="select select-bordered w-full bg-transparent"
            value={editSlot}
            onChange={(e) => setEditSlot(e.target.value)}
          >
            {SLOT_OPTIONS.map((slot) => (
              <option key={slot} value={slot} className="bg-gray-900">
                {SLOT_LABELS[slot]}
              </option>
            ))}
          </select>
        </div>
        <Button primary size="small" isLoading={busy} onClick={onSaveEdit}>
          حفظ التعديلات
        </Button>
      </PlanModal>
    </Card>
  );
}

/** تبويب التغذية: أهداف اليوم + وجبات اليوم الغذائي بحالة إنجازها + إضافة وجبة */
function DietTab({ userId }: { userId: string }) {
  const axios = useAxios({});

  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);

  const [addSlot, setAddSlot] = useState("Extra");

  const [addMode, setAddMode] = useState<"library" | "custom">("library");

  const [customName, setCustomName] = useState("");

  const [scale, setScale] = useState(true);

  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data: res } = await axios.get(`/users/${userId}/diet`);
      setData(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "تعذر تحميل التغذية");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const onAddFromLibrary = async (opt: any) => {
    setBusy(true);
    try {
      await axios.post(`/users/${userId}/diet-meals`, {
        meal: addSlot,
        diet_meal_id: opt.id,
        scale: scale ? 1 : 0,
      });
      toast.success("تمت إضافة الوجبة");
      setAddOpen(false);
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setBusy(false);
    }
  };

  const onAddCustom = async () => {
    if (!customName) {
      toast.error("أدخل اسم الوجبة");
      return;
    }
    setBusy(true);
    try {
      await axios.post(`/users/${userId}/diet-meals`, {
        meal: addSlot,
        name: customName,
      });
      toast.success("تمت إضافة الوجبة المخصّصة — أضف مكوّناتها الآن");
      setAddOpen(false);
      setCustomName("");
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "حدث خطأ ما");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div>جارِ التحميل...</div>;

  const doneCount = data?.meals?.filter((m: any) => m.done)?.length ?? 0;

  const eatenCalories =
    data?.meals
      ?.filter((m: any) => m.done)
      ?.reduce((sum: number, m: any) => sum + Number(m.calories || 0), 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ["السعرات", `${Math.round(eatenCalories)} / ${data?.targets?.calories}`],
          ["البروتين", data?.targets?.protein],
          ["الكارب", data?.targets?.carb],
          ["الدهون", data?.targets?.fat],
          ["وجبات اليوم", `${doneCount} / ${data?.meals?.length ?? 0} مكتملة`],
        ].map(([label, value]) => (
          <Card key={label as string} className="p-3 text-center">
            <Text size="xs" className="text-gray-400">
              {label}
            </Text>
            <Text className="font-bold">{value}</Text>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Text size="xl" className="font-bold">
          وجبات اليوم الغذائي ({data?.date})
        </Text>
        <Button primary size="small" onClick={() => setAddOpen(true)}>
          + إضافة وجبة
        </Button>
      </div>

      <div className="space-y-3">
        {data?.meals?.map((meal: any) => (
          <MealCard
            key={meal.id}
            meal={meal}
            userId={userId}
            onChanged={load}
          />
        ))}
        {data?.meals?.length === 0 && <Text>لا توجد وجبات لهذا اليوم</Text>}
      </div>

      <PlanModal open={addOpen} onClose={() => setAddOpen(false)} wide>
        <Text size="xl" className="font-bold">
          إضافة وجبة للمستخدم
        </Text>

        <div className="flex items-center gap-3 flex-wrap">
          <Text size="xs">السلوت:</Text>
          <select
            className="select select-bordered select-sm bg-transparent"
            value={addSlot}
            onChange={(e) => setAddSlot(e.target.value)}
          >
            {SLOT_OPTIONS.map((slot) => (
              <option key={slot} value={slot} className="bg-gray-900">
                {SLOT_LABELS[slot]}
              </option>
            ))}
          </select>

          <Button
            size="xSmall"
            primary={addMode === "library"}
            secondaryBorder={addMode !== "library"}
            onClick={() => setAddMode("library")}
          >
            من الوصفات
          </Button>
          <Button
            size="xSmall"
            primary={addMode === "custom"}
            secondaryBorder={addMode !== "custom"}
            onClick={() => setAddMode("custom")}
          >
            وجبة مخصّصة
          </Button>
        </div>

        {addMode === "library" ? (
          <>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={scale}
                onChange={() => setScale(!scale)}
              />
              <Text size="xs">
                موازنة الكميات على سعرات المستخدم (كما يفعل التطبيق)
              </Text>
            </label>
            <MealPicker
              userId={userId}
              slot={addSlot !== "Extra" ? addSlot : undefined}
              onPick={onAddFromLibrary}
              picking={busy}
            />
          </>
        ) : (
          <div className="space-y-3">
            <input
              className="input input-bordered w-full bg-transparent"
              placeholder="اسم الوجبة"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Text size="xs" className="text-gray-400">
              بعد الإنشاء أضف المكوّنات من بطاقة الوجبة
            </Text>
            <Button primary size="small" isLoading={busy} onClick={onAddCustom}>
              إنشاء الوجبة
            </Button>
          </div>
        )}
      </PlanModal>
    </div>
  );
}

export default DietTab;
