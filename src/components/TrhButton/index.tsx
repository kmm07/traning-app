import { Button } from "components";

/*
 * صفُّ أفعالِ النموذج (حفظ · إلغاء · حذف) — يُستعمل في أربعة نماذج.
 *
 * 🔴 **وزرُّ الحذف كان مكتوباً «خذف»** — خطأٌ إملائيٌّ معروضٌ على أخطر فعلٍ
 *    في الشاشة.
 *
 * 🔴 **و«إلغاء» كان `primary` مثل «حفظ» حرفياً** — زرّان بلونٍ واحدٍ وحجمٍ
 *    واحد، أحدهما يحفظ والآخر يرمي ما كُتب. والتفريقُ لونيٌّ الآن: الحفظُ
 *    بلون الهوية، والإلغاءُ محايد، والحذفُ أحمر.
 *
 * ⛔ **و`justify-between mx-10`** كان يفرّق الثلاثةَ على عرض الحاوية كلِّه
 *    ⇒ «حذف» يقع في أقصى الطرف بجوار «حفظ» بمسافةٍ تُغري بالخطأ. صارت
 *    مجموعةً متلاصقة، **والحذفُ معزولٌ في الطرف المقابل**.
 */
function TrhButton({
  onDelete,
  id = "my-drawer",
}: {
  onDelete: () => void;
  id?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
      <div className="flex items-center gap-3">
        <Button primary type="submit" size="large" rounded="full">
          حفظ
        </Button>

        <Button
          size="large"
          rounded="full"
          secondary
          onClick={() => document.getElementById(id)?.click()}
        >
          إلغاء
        </Button>
      </div>

      <Button size="large" rounded="full" danger onClick={onDelete}>
        حذف
      </Button>
    </div>
  );
}

export { TrhButton };
