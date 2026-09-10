import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "components";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { logOut, selectAuthData } from "redux/slices/auth";
import usePermissions from "hooks/usePermissions";
import { useConfirm } from "components/ConfirmDialog/context";
import { GROUP_LABELS, NAV_ITEMS, NavItem } from "layout/nav";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  الشريطُ الجانبيّ — أُعيد بناؤه بالكامل
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **زرُّ الخروج كان أيقونةً بلا كلمة** — سهمُ «تصغير» مقلوباً 180°
 *    (`img_minimize.svg` بـ`rotate-180`) في أسفل الشريط، بلا نصٍّ ولا
 *    `title` ولا `aria-label`. ⇒ الفعلُ الوحيدُ الذي لا رجعةَ فيه في
 *    اللوحة كان **مخفياً خلف أيقونةٍ تعني شيئاً آخر**، ومن ضغطها ظانّاً
 *    أنها تطوي الشريطَ خرج من حسابه. صار زرّاً باسمه وبتأكيدٍ قبله.
 *
 * 🔴 **والقائمةُ المنسدلة كانت مبنيّةً بارتفاعاتٍ مكوَّدة**: كلُّ بندٍ فرعيّ
 *    داخل `<div className="ms-20 border-2 ... h-6 w-10">` وأخواتُه
 *    `h-12 w-10` مع `mt-8` و`mr-5` — أي أن الخطَّ الرأسيَّ الواصل مرسومٌ
 *    بحدودِ صناديقَ فارغةٍ قياساتُها محسوبةٌ باليد على سبعة بنود. وإضافةُ
 *    بندٍ ثامن كانت تكسر الرسم. صار الخطُّ حدّاً واحداً على الحاوية،
 *    والبنودُ تتوالى بلا أرقامٍ محسوبة.
 *
 * 🔴 **وأوّلُ بندٍ فرعيّ كان مكرَّراً**: يُرسم مرّةً بمفرده ثم تتخطّاه
 *    الحلقةُ بـ`index !== 0` — نسخةٌ ثانيةٌ من نفس الشيفرة تتباعد عن أختها
 *    عند أيّ تعديل. صارت حلقةً واحدة.
 *
 * ⛔ **والقائمةُ كانت مفتوحةً دائماً حتى على القسم غير النشط**، ولا تُفتح
 *    من تلقائها على القسم الذي أنت فيه: تدخل «الوصفات» من رابطٍ مباشر
 *    فتجد شجرة التغذية مطويّة. صارت تُفتح على القسم الجاري بالبناء.
 *
 * ➕ **وطيُّ الشريط** — زرٌّ يُبقي الأيقونات وحدها، والحالةُ محفوظةٌ في
 *    `localStorage` فلا تُنسى بين الصفحات. اللوحةُ فيها جداولُ عريضة
 *    (المكوّنات · التمارين) وكان الشريطُ يبتلع خُمسَ الشاشة بلا سبيل.
 */

interface Props {
  /** في الشاشات الصغيرة يُعرض الشريطُ درجاً — فيُغلق بعد كل انتقال. */
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidePar({ onNavigate, collapsed = false, onToggleCollapse }: Props) {
  const { can } = usePermissions();
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const { pathname } = useLocation();
  const auth = useAppSelector(selectAuthData);

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => can(item.section)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth?.user?.permissions, auth?.user?.is_super]
  );

  const isItemActive = (item: NavItem) =>
    pathname === item.link || pathname.startsWith(item.link + "/");

  /** القسمُ المفتوح — يبدأ على القسم الذي يقف فيه المدرّب لا مطويّاً. */
  const [openKey, setOpenKey] = useState<string | null>(() => {
    const current = NAV_ITEMS.find(
      (i) => i.subMenu && (pathname === i.link || pathname.startsWith(i.link + "/"))
    );
    return current?.section ?? null;
  });

  useEffect(() => {
    const current = NAV_ITEMS.find(
      (i) => i.subMenu && (pathname === i.link || pathname.startsWith(i.link + "/"))
    );
    if (current) setOpenKey(current.section);
  }, [pathname]);

  /*
   * ⚖️ **بـ`useConfirm` لا `window.confirm`** — القاعدةُ مكتوبةٌ في
   *    `ConfirmDialog/context`: حوارُ المتصفّح يظهر باسم النطاق فيُقرأ
   *    رسالةَ متصفّحٍ لا رسالةَ لوحة، ولا يُعرَّب زرّاه. والخروجُ فعلٌ
   *    يُفقد المدرّبَ موضعَه في عملٍ جارٍ، فيستحقّ سؤالاً.
   */
  const confirm = useConfirm();

  const onLogout = async () => {
    const ok = await confirm({
      title: "تسجيل الخروج؟",
      message: "سيلزمك إدخالُ بريدك وكلمة مرورك للدخول مرّةً أخرى.",
      confirmLabel: "خروج",
      tone: "neutral",
    });
    if (!ok) return;

    dispatch(logOut());
    push("/");
  };

  const groups: Array<NavItem["group"]> = ["work", "catalog", "system"];

  return (
    <nav
      aria-label="أقسام اللوحة"
      className="flex h-full flex-col bg-surface-base border-e border-line"
    >
      {/* ── الشعار ────────────────────────────────────────────────────── */}
      <div
        className={`relative flex items-center gap-3 px-4 h-16 shrink-0 border-b border-line bg-brand-veil ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <img
          src="/icon-192.png"
          alt="المدرب الشخصي"
          width={36}
          height={36}
          className="h-9 w-9 rounded-xl shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-content leading-tight truncate">
              لوحة المدرب
            </p>
            <p className="text-[11px] text-content-faint leading-tight truncate">
              المدرّب الشخصي
            </p>
          </div>
        )}
      </div>

      {/* ── البنود ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-quiet py-3">
        {groups.map((group) => {
          const items = visibleItems.filter((i) => i.group === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="mb-2">
              {!collapsed && (
                /*
                  ⚖️ **ولافتةُ المجموعة صارت لافتةً وخطّاً** — كلمةٌ باهتةٌ
                     وحدها فوق قائمةٍ تُقرأ **بنداً أوّلَ خافتاً** لا عنواناً.
                     والخطُّ المتلاشي بجانبها يفصل الكتلَ بصرياً فتُمسح
                     الثلاثةَ عشرَ بنداً في نظرةٍ بدل قراءتها بنداً بنداً.
                */
                <div className="flex items-center gap-2 px-5 pt-3 pb-2">
                  <p className="text-[11px] font-semibold tracking-wide text-content-faint whitespace-nowrap">
                    {GROUP_LABELS[group]}
                  </p>
                  <span className="divider-soft flex-1" />
                </div>
              )}
              {collapsed && <div className="divider-soft my-3 mx-3" />}

              <ul className="px-2 space-y-0.5">
                {items.map((item) => {
                  const active = isItemActive(item);

                  if (!item.subMenu) {
                    return (
                      <li key={item.section}>
                        <NavLink
                          to={item.link}
                          onClick={onNavigate}
                          title={collapsed ? item.name : undefined}
                          className={[
                            "relative flex items-center gap-3 rounded-field py-2.5 transition-all duration-200 ease-smooth",
                            collapsed ? "justify-center px-0" : "px-3",
                            active
                              ? "bg-nav-active text-brand-400 font-semibold"
                              : "text-content-muted hover:bg-ink-800 hover:text-content hover:translate-x-[-2px] rtl:hover:translate-x-[2px]",
                          ].join(" ")}
                        >
                          {active && (
                            <span
                              className="absolute inset-y-2 -end-2 w-1 rounded-full bg-brand-400 shadow-glow"
                              aria-hidden="true"
                            />
                          )}
                          <Icon name={item.icon} />
                          {!collapsed && (
                            <span className="text-sm truncate">{item.name}</span>
                          )}
                        </NavLink>
                      </li>
                    );
                  }

                  const open = openKey === item.section && !collapsed;

                  return (
                    <li key={item.section}>
                      <button
                        type="button"
                        aria-expanded={open}
                        title={collapsed ? item.name : undefined}
                        onClick={() =>
                          collapsed
                            ? push(item.subMenu![0].link)
                            : setOpenKey(open ? null : item.section)
                        }
                        className={[
                          "relative w-full flex items-center gap-3 rounded-field py-2.5 transition-all duration-200 ease-smooth",
                          collapsed ? "justify-center px-0" : "px-3",
                          active
                            ? "bg-nav-active text-brand-400 font-semibold"
                            : "text-content-muted hover:bg-ink-800 hover:text-content",
                        ].join(" ")}
                      >
                        {active && (
                          <span
                            className="absolute inset-y-2 -end-2 w-1 rounded-full bg-brand-400 shadow-glow"
                            aria-hidden="true"
                          />
                        )}
                        <Icon name={item.icon} />
                        {!collapsed && (
                          <>
                            <span className="text-sm truncate flex-1 text-start">
                              {item.name}
                            </span>
                            <Icon
                              name="chevron"
                              size={16}
                              className={`transition-transform duration-200 ${
                                open ? "" : "rotate-90 rtl:-rotate-90"
                              }`}
                            />
                          </>
                        )}
                      </button>

                      {/*
                        الخطُّ الواصل حدٌّ واحدٌ على الحاوية — لا صناديقُ
                        فارغةٌ بارتفاعاتٍ محسوبةٍ لكل بند.
                      */}
                      <div
                        className={`grid transition-all duration-320 ease-smooth ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <ul className="overflow-hidden ms-6 my-0.5 ps-3 border-s border-line">
                          {item.subMenu.map((child) => (
                            <li key={child.link}>
                              <NavLink
                                to={child.link}
                                onClick={onNavigate}
                                tabIndex={open ? 0 : -1}
                                className={({ isActive }) =>
                                  [
                                    "block rounded-lg px-3 py-2 my-0.5 text-[13px] transition-all duration-200 ease-smooth truncate",
                                    isActive
                                      ? "bg-ink-800 text-brand-400 font-semibold"
                                      : "text-content-muted hover:bg-ink-800 hover:text-content hover:translate-x-[-2px] rtl:hover:translate-x-[2px]",
                                  ].join(" ")
                                }
                              >
                                {child.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── الأسفل: الحسابُ والطيُّ والخروج ───────────────────────────── */}
      <div className="shrink-0 border-t border-line p-2 space-y-1">
        {!collapsed && auth?.user?.name && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-field bg-ink-900">
            <span className="h-8 w-8 shrink-0 grid place-items-center rounded-lg bg-brand-400 text-ink-950 text-sm font-bold">
              {auth.user.name.trim().charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-content truncate">
                {auth.user.name}
              </p>
              <p className="text-[11px] text-content-faint truncate">
                {auth.user.is_super ? "مدير أعلى" : "مسؤول"}
              </p>
            </div>
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "توسيع الشريط" : "طيّ الشريط"}
            aria-label={collapsed ? "توسيع الشريط" : "طيّ الشريط"}
            className={[
              "hidden lg:flex w-full items-center gap-3 rounded-field py-2.5 text-content-muted hover:bg-ink-800 hover:text-content active:scale-[0.98] transition-all duration-200 ease-smooth",
              collapsed ? "justify-center px-0" : "px-3",
            ].join(" ")}
          >
            <Icon
              name="collapse"
              className={collapsed ? "rotate-180" : ""}
            />
            {!collapsed && <span className="text-sm">طيّ الشريط</span>}
          </button>
        )}

        <button
          type="button"
          onClick={() => void onLogout()}
          title="تسجيل الخروج"
          aria-label="تسجيل الخروج"
          className={[
            "w-full flex items-center gap-3 rounded-field py-2.5 text-danger-400 hover:bg-danger-500/10 active:scale-[0.98] transition-all duration-200 ease-smooth",
            collapsed ? "justify-center px-0" : "px-3",
          ].join(" ")}
        >
          <Icon name="logout" />
          {!collapsed && <span className="text-sm font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </nav>
  );
}

export default SidePar;
