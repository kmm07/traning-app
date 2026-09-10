import {
  Button,
  Card,
  Img,
  Input,
  Modal,
  SettingCard,
  Table,
  Text,
} from "components";
import React, { useState, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { UseQueryResult, useQueryClient } from "react-query";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import AddIngredientCategories from "./components/AddIngredientCategories";
import EditIngredient from "./components/editIngredient";
import FoodItemSideBar from "./components/FoodItemSideBar";
import { useConfirm } from "components/ConfirmDialog/context";

function Ingredients() {
  const confirm = useConfirm();
  const [categoryId, setCategoryId] = useState(1);

  /**
   * 🔴 **عدسةُ المصدر — وبلاها لا سبيل إلى صفٍّ واحد من قاعدة الأطعمة.**
   * القائمةُ تُذيَّل بالمستورد **بعد** كتالوج المدرّب كلِّه، وفئةُ «جميع
   * المكوّنات» وحدها ١٨٬٣٣١ صفّاً ⇒ أوّلُ صفٍّ مستورد يقع في الصفحة ٧٣٤.
   * ومقيسٌ على سجلّ الخادم أن **كلَّ** زيارةٍ حقيقية كانت `page=1` ⇒ صفوفُ
   * قاعدة الأطعمة **غيرُ قابلةٍ للبلوغ عملياً** إلا بمصادفةِ بحثٍ يقلّ فيه
   * الكتالوج عن خمسةٍ وعشرين. وتحريرُها منشورٌ منذ ١ سبتمبر ولا يُبلغ.
   *
   * ⚖️ **وصفر تعديلٍ في الخادم**: `meal_ingredient_category_id=0` يعني عنده
   * «المستوردَ وحده» سلفاً (٨٬١٨٦ صنفاً · ٣٢٨ صفحة) — العدسةُ تستعمل ما هو
   * مبنيٌّ ولا تفتح باباً جديداً.
   */
  const [source, setSource] = useState<"catalog" | "food_db">("catalog");

  const [ingredientData, setIngredientData] = useState<any>(null);

  const [valuesItem, setValuesItem] = useState(null);

  // get cards data =================>
  const categoriesURL = "/meal-ingredient-categories";

  const { data: cardData, isLoading: isCardsLoading }: UseQueryResult<any> =
    useGetQuery(categoriesURL, categoriesURL, {
      select: ({ data }: { data: { data: [] } }) => data.data,
      refetchOnWindowFocus: false,
    });

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    if (
      !(await confirm({
        title: "حذف فئة المكوّنات؟",
        message: "مكوّناتُها تتبعها ولا تعود تظهر في البحث ولا في الوصفات.",
      }))
    ) {
      return;
    }

    try {
      await mutateAsync(`meal-ingredient-categories/${id}`);

      await queryClient.invalidateQueries("/meal-ingredient-categories");
    } catch {
      // الرسالة من `onError`.
    }
  };

  const onEdit = (value: any) => {
    setValuesItem(value);
    document.getElementById("add-new-nutrition")?.click();
  };

  const [currentPage, setCurrentPage] = useState(1);

  /**
   * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٤-٢]
   *
   * ⛔ **البحث خادميٌّ لا محلّيّ.** كان `Table` يعرض حقلَ بحثٍ يرشّح **الصفحة
   * المحمَّلة وحدها (٢٥ صفّاً)** والكتالوج **١٧٬٩٢٣ مكوّناً** ⇒ يبحث المدرّب
   * عن «طحينة» فلا يجدها **فيُنشئ مكرَّراً** — والمكوّن موجودٌ في صفحةٍ أخرى.
   * ⚖️ **وليس بناءً جديداً**: الخادم يدعم `search_query` أصلاً
   * ([`MealIngredientController::index`]) وهي عينُ الرقعة المنشورة في
   * `add-ingredients` منذ ٩ أغسطس — يُنقَل نمطُها لا يُخترع ثانٍ.
   *
   * 📌 **والحقل فوق الجدول لا داخله** — كي يبقى ظاهراً حين تردّ النتيجةُ
   * صفراً؛ ولو كان داخل `Table` لاختفى مع الجدول (`data.length === 0`)
   * فحُبس المدرّب في بحثٍ لا يستطيع مسحه.
   *
   * ⚠️ **والبحث داخل الفئة المختارة** لا في الكتالوج كلِّه — لأن الخادم
   * يطبّق قيد الفئة قبل `LIKE` (مقيسٌ على الكود)، وهي دلالةُ هذه الشاشة.
   */
  const [search, setSearch] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ⛔ وتبديلُ الفئة يُصفّر البحث والصفحة معاً — وإلا بقي بحثٌ من فئةٍ سابقة
  //    مطبَّقاً على فئةٍ جديدة فتبدو فارغة.
  useEffect(() => {
    setSearch("");
    setQuery("");
    setCurrentPage(1);
  }, [categoryId]);

  /**
   * [٣١ أغسطس ٢٠٢٦ · فصلُ الأدوار بين كتالوجَي الأطعمة]
   *
   * 🔴 **عدسةُ الرؤية — شرطُ اكتمالِ البند لا زيادةٌ عليه.** صار الخادم يخفي
   * **١٢٬٢٩٤ صفّاً** عن بحث المستخدم، وفيها **٨٬٥٧٩ منتجاً له باركودٌ وصورةٌ
   * واسمٌ عربيٌّ نظيف وتنقصه القيمُ الغذائية وحدها** — والخطةُ المعلَنة أن
   * تُملأ تدريجياً.
   *
   * ⛔ **وبلا هذه العدسة لا سبيل إليها إطلاقاً**: صفوفُ الكتالوج **كلُّها في
   * الفئة `1`** (مقيسٌ على الإنتاج: ١٨٬٣٣١ من ١٨٬٣٣١) فلا تصفيةَ فئةٍ توصل
   * إلى المخفيّ. **وملءُ ما لا يُرى ممتنع.**
   *
   * 📌 **وتبقى عبر تبديل الفئة** — لأنها وضعُ عملٍ («أملأ القيم») لا مرشِّحُ
   * بحثٍ يتبع الفئة؛ والصفحةُ وحدها تُصفَّر.
   */
  const [visibility, setVisibility] = useState<"visible" | "hidden" | "all">(
    "visible"
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [visibility]);

  // ⛔ وتبديلُ المصدر يُصفّر البحثَ والصفحة — بحثٌ من كتالوجٍ آخر مطبَّقاً
  //    على مصدرٍ آخر يُقرأ «فارغاً» لا «لا نتيجة لهذا البحث».
  useEffect(() => {
    setSearch("");
    setQuery("");
    setCurrentPage(1);
  }, [source]);

  // `0` = «المستوردَ وحده» بحكم الخادم؛ وفئاتُ اللوحة تصنيفُ كتالوجها هي
  //  ولا عضوية للمستورد فيها.
  const listCategoryId = source === "food_db" ? 0 : categoryId;

  const url = `/meal-ingredients?meal_ingredient_category_id=${listCategoryId}&per_page=25&page=${currentPage}&visibility=${visibility}&include_food_db=1${
    query ? `&search_query=${encodeURIComponent(query)}` : ""
  }`;

  const {
    data: ingredientsData,
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[]; pagination: any } }) => ({
      items: data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        calories: item.calories,
        fat: item.fat,
        protein: item.protein,
        sugar: item.sugar,
        trans_fat: item.trans_fat,
        carbohydrate: item.carbohydrate,
        size: item.size,
        measure: item.measure,
        image: item.image,
        // خادمٌ قديم لا يرسله ⇒ يُقرأ «ظاهراً» فلا تظهر شارةٌ كاذبة
        is_visible: item.is_visible !== false,
        // مصدرُ الصفّ: كتالوجُ المدرّب (يُحرَّر) أو قاعدةُ الأطعمة (للعرض)
        source: item.source ?? "catalog",
        item_type_label: item.item_type_label ?? null,
        brand: item.brand ?? null,
        // ⚠️ **حقولُ درج التحرير** — كانت تُسقَط هنا فيفتح الدرجُ على صفٍّ
        // بلا `food_item_id` ⇒ يقصف `/food-items/undefined`. والتصفيةُ
        // الصامتة أخطرُ من الحقل الغائب: النموذجُ يبدو صحيحاً ويحفظ في لا شيء.
        food_item_id: item.food_item_id ?? null,
        serving_basis: item.serving_basis ?? null,
        basis_label: item.basis_label ?? null,
        confidence: item.confidence ?? null,
        code: item.code ?? null,
      })),
      pagination: data.pagination, // استخراج معلومات التصفح
      // عدّادٌ يفصل المصدرين — يرسله الخادم كي لا تعدّ اللوحة الصفحة وحدها
      counts: (data as any).counts ?? null,
    }),
    refetchOnWindowFocus: false,
  });
  
  const ingredientsList = ingredientsData?.items ?? [];
  const pagination = ingredientsData?.pagination ?? {};
  const counts = ingredientsData?.counts ?? null;

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.name}
              {/* ⛔ **الشارةُ في «الكل» وحدها** — في عدسةٍ مفردة يكون كلُّ
                  صفٍّ من نوعها فتصير الشارةُ ضجيجاً يُقرأ من طرف العين.
                  وغيابُها هناك لا يُلبس: العدسةُ نفسها تقول ما تعرض. */}
              {row.original.source === "food_db" && source !== "food_db" && (
                <span
                  className="text-xs px-2 py-[2px] rounded-full border border-sky-400 text-sky-400 whitespace-nowrap"
                  title="من قاعدة الأطعمة المستوردة — يُحرَّر في مصدره، وتصحيحُه يسري على البحث والباركود والوصفات معاً"
                >
                  قاعدة الأطعمة
                </span>
              )}
              {row.original.source !== "food_db" &&
                visibility === "all" &&
                !row.original.is_visible && (
                <span
                  className="text-xs px-2 py-[2px] rounded-full border border-amber-400 text-amber-400 whitespace-nowrap"
                  title="مخفيٌّ عن بحث المستخدم — تنقصه القيم الغذائية"
                >
                  مخفيّ
                </span>
              )}
            </div>
          );
        },
      },
      {
        Header: " السعرات",
        accessor: "calories",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.calories).toFixed(2)}</span>
        ),
      },
      {
        Header: "البروتين",
        accessor: "protein",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.protein).toFixed(2)}</span>
        ),
      },
      {
        Header: "الكاروبهيدرات",
        accessor: "carbohydrate",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.carbohydrate).toFixed(2)}</span>
        ),
      },
      {
        Header: "الدهون",
        accessor: "fat",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.fat).toFixed(2)}</span>
        ),
      },
      {
        Header: "الدهون المتحولة",
        accessor: "trans_fat",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.trans_fat).toFixed(2)}</span>
        ),
      },
      {
        Header: "السكريات",
        accessor: "sugar",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.sugar).toFixed(2)}</span>
        ),
      },
      {
        Header: "الحجم",
        accessor: "size",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{Number(row.original.size).toFixed(2)}</span>
        ),
      },
      {
        Header: "المعيار",
        accessor: "measure",
        Cell: ({ row }: { row: Row<any> }) => (
          <span>{row.original.measure}</span>
        ),
      },
    ],
    // ⚠️ `visibility` في التبعيات — الشارةُ تقرؤها، وبقاءُ `[]` يجمّد
    //    الإغلاقةَ على أوّل قيمة فلا تظهر الشارةُ عند التبديل إلى «الكل».
    [visibility, source]
  );

  const rowOnClick = (item: any) => {
    setIngredientData(item.original);
  };

  useEffect(() => {
    setCategoryId(cardData?.[0]?.id);
  }, [cardData]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {!isCardsLoading ? (
          cardData?.map((item: any) => {
            return (
              <SettingCard
                onDelete={onDelete}
                onEdit={() => onEdit(item)}
                id={item.id}
                key={item.id}
                label={item.name}
                active={categoryId === item.id}
                onClick={() => {
                  // ⛔ وإلا بدت البطاقةُ معطّلة: العدسةُ المستوردة تتجاهل الفئة
                  setSource("catalog");
                  setCategoryId(item.id);
                }}
                className={`h-[120px] ${
                  item.private === 1 ? "!border-[#CFFF0F]" : "!border-[#fff]"
                }`}
              />
            );
          })
        ) : (
          <>loading...</>
        )}

        <Card className={`p-4 w-[180px] cursor-pointer`}>
          <label
            htmlFor="add-new-nutrition"
            className={`flex flex-col justify-between items-center relative `}
          >
            <Img
              className="w-16 absolute top-0 left-0"
              src="/images/plus.svg"
            />
            <Text size="3xl" className="mt-4">
              اضافة
            </Text>
          </label>
        </Card>
      </div>
      <div className="!mt-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {(
            [
              ["catalog", "كتالوجك"],
              ["food_db", "قاعدة الأطعمة"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              size="small"
              primary={source === key}
              secondaryBorder={source !== key}
              onClick={() => setSource(key)}
            >
              {label}
            </Button>
          ))}

          {source === "catalog" && <span className="w-px h-6 bg-line" />}

          {/* ⛔ عدسةُ الرؤية لكتالوج المدرّب وحده — المستوردُ مقصورٌ على
              `is_visible = 1` في الخادم، فخياراتُها فيه أزرارٌ بلا أثر. */}
          {source === "catalog" &&
            (
              [
                ["visible", "المعروضة"],
                ["hidden", "بانتظار القيم"],
                ["all", "الكل"],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                size="small"
                primary={visibility === key}
                secondaryBorder={visibility !== key}
                onClick={() => setVisibility(key)}
              >
                {label}
              </Button>
            ))}

          {/* ⚖️ **العددُ مفصولٌ بالمصدر لا مجموعاً** — الشاشةُ صارت تعرض
              كتالوجين، ورقمٌ واحد يجعل المدرّب يظنّ أن ٨٬١٨٦ منتجاً صفوفٌ
              يملكها ويحرّرها، وهي للعرض والإضافة وحدهما. */}
          {!isListLoading && counts && (
            <Text className="text-sm opacity-70">
              {source === "food_db" ? (
                <>{Number(counts.food_db ?? 0).toLocaleString("en-US")} صنفاً في قاعدة الأطعمة</>
              ) : (
                <>
                  {Number(counts.catalog ?? 0).toLocaleString("en-US")} من كتالوجك
                  {(counts.food_db ?? 0) > 0 && (
                    <> · {Number(counts.food_db).toLocaleString("en-US")} من قاعدة الأطعمة</>
                  )}
                </>
              )}
            </Text>
          )}
        </div>

        {/* ⚖️ سطرٌ يشرح العدسةَ بدل أن يخمّن المدرّبُ لماذا نقص الجدول فجأة */}
        {source === "food_db" && (
          <div className="mb-4 text-sm text-sky-400/90">
            قاعدةُ الأطعمة المستوردة — اضغط أيَّ صنفٍ لتصحيح اسمه وقيمه
            الغذائية. والتصحيحُ يسري على البحث والباركود والوصفات معاً.
          </div>
        )}

        {source === "catalog" && visibility !== "visible" && (
          <div className="mb-4 text-sm text-amber-400/90">
            {visibility === "hidden"
              ? "هذه مكوّنات ومنتجات مخفيّة عن بحث المستخدم — تنقصها القيم الغذائية. املأ قيمها لتظهر."
              : "العرضُ يشمل المخفيّ — والصفّ المخفيّ موسومٌ بشارة."}
          </div>
        )}

        <div className="mb-4">
          <Input
            name=""
            isForm={false}
            inputSize="large"
            placeholder={
              source === "food_db"
                ? "ابحث في قاعدة الأطعمة (اسم أو علامة تجارية)..."
                : "ابحث في مكوّنات هذه الفئة..."
            }
            value={search}
            className="Rectangle h-9 bg-gray-900 shadow-bs rounded-3xl border-slate-800"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!isListLoading ? (
          <Table
            data={ingredientsList ?? []}
            columns={columns}
            rowOnClick={rowOnClick}
            /* ⛔ التعليقُ القديم هنا كان يقول إن صفَّ قاعدة الأطعمة «لا
               يُحرَّر» — **وقد نُقض في ١ سبتمبر**: صار له درجُه ومسارُه
               (`PUT admin/food-items/{id}`)، والصفُّ يحمل `food_item_id`
               الرقميّ فلا يقصف معرّفُه النصّيّ شيئاً.
               ⛔ **والإضافةُ لكتالوج المدرّب وحدها** — لا يُضاف صنفٌ إلى
               مصدرٍ مستورَد. */
            opnSideBar={source === "catalog" ? "إضافة مكون" : undefined}
            opnSideBarOpen={() => setIngredientData(null)}
            setPage={setCurrentPage}
            pagination={pagination}
          />
        ) : (
          <>loading...</>
        )}
      </div>

      {ingredientsList?.length === 0 && (
        <>
          <Modal id="add-new-ing">
            <EditIngredient values={null} categories={cardData} empty />
          </Modal>

          <div className="flex justify-center">
            <Button
              secondaryBorder
              onClick={() => document.getElementById("my-drawer")?.click()}
            >
              إضافة وصفة
            </Button>
          </div>
        </>
      )}

      <Modal id="add-new-nutrition">
        <AddIngredientCategories values={valuesItem} />
      </Modal>

      {/* 🔴 **درجان لا واحد** — الصفّان لا يتقاسمان حقولاً بل جدولين:
          كتالوجُ المدرّب يحمل سكراً ودهوناً متحوّلة وحصّةً مرجعية وصورةً
          وفئةً وحذفاً، **ولا شيء منها في المصدر المستورد**. ونموذجٌ واحد
          نصفُ خاناته معطَّل يُقرأ عطلاً لا خياراً. */}
      <Drawer>
        {ingredientData?.source === "food_db" ? (
          <FoodItemSideBar data={ingredientData} listKey={url} />
        ) : (
          <SideBar ingredientData={ingredientData} categoryId={categoryId} />
        )}
      </Drawer>
    </div>
  );
}

export default Ingredients;
