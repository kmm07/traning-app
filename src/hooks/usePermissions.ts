import { useAppSelector } from "hooks/useRedux";
import { selectAuthData } from "redux/slices/auth";

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

  const isSuper = data?.user?.is_super ?? data?.user?.is_admin ?? false;
  const permissions = data?.user?.permissions ?? [];
  const sections = data?.user?.sections ?? {};

  /**
   * ⚠️ خادمٌ أقدم لا يرسل `permissions` إطلاقاً. وعندها **لا نحجب شيئاً**:
   * الحجبُ عند غياب الحقل كان يُفرغ اللوحة لكل مدير خلال نافذة نشرٍ مزدوج.
   * والخادمُ يبقى هو الفاصل على أيّ حال.
   */
  const legacyServer = data?.user?.permissions === undefined;

  const can = (section?: string) =>
    isSuper || legacyServer || (!!section && permissions.includes(section));

  return { isSuper, permissions, sections, can };
}
