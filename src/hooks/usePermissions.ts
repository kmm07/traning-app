import { useAppSelector } from "hooks/useRedux";
import { selectAuthData } from "redux/slices/auth";
import { selectActiveCoach } from "redux/slices/coachContext";

/**
 * صلاحياتُ الأقسام — نقطةُ القرار الواحدة عند العميل.
 *
 * ⚖️ **والقاعدة: اللوحة لا تطلب ما يرفضه الخادم** (نظيرُ «الهوم لا يعرض ما
 * يرفضه الحَكَم» في هذا المستودع). فالشريطُ الجانبيّ وشريطُ الإنذارات وشارةُ
 * الرسائل تُخفى عند غياب الصلاحية بدل أن تُغرق الكونسول بـ403.
 *
 * ⛔ وهذا **تجميلٌ لا حماية**: الحاجزُ الحقيقيّ وسيطُ `adminSection` على
 * الخادم، وهو ما يردّ 403 لمن يقصف المسار مباشرةً.
 */
export default function usePermissions() {
  const data = useAppSelector(selectAuthData);
  const activeCoach = useAppSelector(selectActiveCoach);

  const isSuper = data?.user?.is_super ?? data?.user?.is_admin ?? false;
  const permissions = data?.user?.permissions ?? [];
  const sections = data?.user?.sections ?? {};

  /**
   * ⚠️ خادمٌ أقدم لا يرسل `permissions` إطلاقاً. وعندها **لا نحجب شيئاً**:
   * الحجبُ عند غياب الحقل كان يُفرغ اللوحة لكل مدير خلال نافذة نشرٍ مزدوج.
   * والخادمُ يبقى هو الفاصل على أيّ حال.
   */
  const legacyServer = data?.user?.permissions === undefined;

  /** حسابُ مدرّب (لا مسؤول). خادمٌ أقدم لا يرسل `type` ⇒ مسؤولٌ كما كان. */
  const isCoach = data?.user?.type === "coach";
  const readOnly = isCoach && data?.user?.access_level === "read";

  /** المديرُ الأعلى داخل تبويب مدرّب — يرى ما يراه المدرّب ويكتب فيه. */
  const inCoachTab = isSuper && activeCoach !== null;

  /** يعمل داخل نطاق مدرّب (حسابه أو تبويبه) فتظهر له «ملخّص المدرب» ويُخفى ما يرفضه الخادم. */
  const coachMode = isCoach || inCoachTab;

  const can = (section?: string) =>
    isSuper || legacyServer || (!!section && permissions.includes(section));

  /**
   * هل يعرض أزرار الكتابة؟ — تجميلٌ لا حماية: الخادم يردّ 403 `read_only`.
   * (المراسلة تمرّ على قراءة فقط، فلا يُخفى بها زرُّ الإرسال.)
   */
  const canWrite = !readOnly;

  return { isSuper, permissions, sections, can, isCoach, readOnly, canWrite, inCoachTab, coachMode, activeCoach };
}
