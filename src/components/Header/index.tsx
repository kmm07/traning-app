import React from "react";
import { Icon, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import usePermissions from "hooks/usePermissions";
import { useAppSelector } from "hooks/useRedux";
import { selectAuthData } from "redux/slices/auth";
import { Link } from "react-router-dom";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  عنقودُ الرأس — الجرسُ وبطاقةُ الحساب
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **واسمُ المدير كان مكتوباً نصّاً في الشيفرة: «خالد المالكي».**
 *    وهو خطأٌ صار **حيّاً** منذ نشر صلاحيات الأقسام (٧ سبتمبر ٢٠٢٦): اللوحةُ
 *    صارت متعدّدةَ المديرين، فكلُّ مسؤولٍ يدخل بحسابه يرى **اسمَ صاحب
 *    اللوحة في رأس شاشته**. وحمولةُ الدخول تحمل `user.name` سلفاً
 *    (`redux/slices/auth`) فلم يكن ينقص إلا قراءتُها.
 *
 * 🔴 **وصورةُ الحساب كانت ملفّاً ثابتاً** (`img_image.png`) لا صلةَ له
 *    بالداخل — تُعرض لكل مسؤول. صارت الحرفَ الأول من اسمه على أرضية
 *    الهوية: تصحّ لكلِّ اسمٍ ولا تحتاج ملفاً.
 *
 * ⛔ **وقائمةُ الإشعارات كانت `w-52` ثابتة** ونصوصُها بلا حدٍّ للأسطر
 *    ⇒ رسالةٌ طويلةٌ تمدّها خارج الشاشة. وصارت مقيَّدةَ العرض بسطرين لكلٍّ.
 *
 * ⚖️ **ومنطقُ الشارة لم يُمَسّ بحرف** — `total` من الخادم مع سقوطٍ على طول
 *    القائمة، وحسابُ المخفيّ، وشرطُ `enabled` على صلاحية «الرسائل».
 *    وحجّتُها كلُّها محفوظةٌ أدناه كما كُتبت.
 */

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<any>;

const Header: React.FC<HeaderProps> = (props) => {
  const { can } = usePermissions();
  const auth = useAppSelector(selectAuthData);

  // get chat notifications ================>

  const url = "/chat-notification";

  /**
   * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٢-٢ · شقُّ اللوحة]
   *
   * ⛔ **الشارة كانت تعرض `notifications.length`** — أي **طولَ القائمة
   * المُرسَلة** لا عددَ غير المقروء. وهو صادقٌ ما دام الخادم يرسل **كلَّ**
   * رسالةٍ غير مقروءة بلا حدّ، **ويكذب لحظة يُقصّ**.
   *
   * ⚖️ **والسقوطُ على الطول متعمَّد لا احتياط** — يجعل هذا الشطر صالحاً
   * **قبل** نشر الخادم وبعده: إن غاب `total` (خادمٌ قديم) فالسلوك هو
   * السابق حرفياً.
   */
  const { data: chatNotice }: UseQueryResult<any> = useGetQuery(url, url, {
    // [٧ سبتمبر ٢٠٢٦] `chat-notification` صار محروساً بقسم «الرسائل». ومن
    // لا يملكه يستقبل **403 على كل تنقّل** لأن الترويسة في التخطيط. فيُعطَّل
    // النداء ولا تُخفى الترويسة.
    enabled: can("messages"),
    select: ({ data }: { data: { data: any[]; total?: number } }) => ({
      items: data.data ?? [],
      total: data.total ?? (data.data ?? []).length,
    }),
  });

  const notifications: any[] = chatNotice?.items ?? [];
  const unreadTotal: number = chatNotice?.total ?? 0;

  /** كم بقي خارج القائمة المقصوصة — يُقال صراحةً ولا يُترك للتخمين. */
  const hiddenCount = Math.max(0, unreadTotal - notifications.length);

  const name = auth?.user?.name?.trim() ?? "";
  const initial = name ? name.charAt(0) : "؟";

  return (
    <div className={`flex items-center gap-2 ${props.className ?? ""}`}>
      {/* ── الجرس ───────────────────────────────────────────────────── */}
      {can("messages") && (
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            aria-label={`الرسائل غير المقروءة: ${unreadTotal}`}
            className="btn relative h-10 w-10 grid place-items-center rounded-field text-content-muted hover:bg-ink-800 hover:text-content cursor-pointer transition-colors"
          >
            <Icon name="bell" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand-400 text-ink-950 text-[10px] font-bold">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content z-[60] mt-2 w-80 max-w-[calc(100vw-2rem)] p-2 rounded-card bg-surface border border-line shadow-pop"
          >
            <li className="px-3 py-2 text-xs font-semibold text-content-faint pointer-events-none">
              الرسائل غير المقروءة
            </li>

            {notifications?.length > 0 ? (
              notifications.slice(0, 6).map((item: any, index: any) => (
                <li key={index}>
                  <Link
                    to="/dashboard"
                    className="block rounded-lg px-3 py-2 hover:bg-ink-800 transition-colors"
                  >
                    <span className="block text-[13px] text-content line-clamp-2 leading-relaxed">
                      {item?.message}
                    </span>
                    <span className="block text-[11px] text-content-faint mt-0.5">
                      {item?.created_at}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="pointer-events-none">
                <Text
                  as="p"
                  className="!w-full !whitespace-normal text-center py-4 !text-content-muted !text-[13px]"
                >
                  لا رسائل غير مقروءة
                </Text>
              </li>
            )}

            {/* القائمة مقصوصة والعدّاد كامل ⇒ يُقال الفرق. */}
            {hiddenCount > 0 && (
              <li className="pointer-events-none border-t border-line mt-1 pt-1">
                <span className="block px-3 py-2 text-[11px] text-content-faint">
                  {`و${hiddenCount} رسالة أخرى — افتح المحادثات`}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ── الحساب ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 ps-2 sm:ps-0 border-s sm:border-s-0 border-line">
        <span className="h-9 w-9 shrink-0 grid place-items-center rounded-field bg-brand-400 text-ink-950 text-sm font-bold">
          {initial}
        </span>
        <div className="min-w-0 sm:hidden">
          <p className="text-[13px] font-semibold text-content leading-tight truncate max-w-[140px]">
            {name || "—"}
          </p>
          <p className="text-[11px] text-content-faint leading-tight">
            {auth?.user?.is_super ? "مدير أعلى" : "مسؤول"}
          </p>
        </div>
      </div>
    </div>
  );
};

Header.defaultProps = {};

export default Header;
