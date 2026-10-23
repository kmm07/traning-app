import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "components";
import axiosLib from "axios";
import { ADMIN_BASE_URL } from "hooks/useAxios";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import usePermissions from "hooks/usePermissions";
import { selectCurrentToken } from "redux/slices/auth";
import {
  activate,
  closeTab,
  hueFor,
  openTab,
  selectActiveCoach,
  selectCoachTabs,
} from "redux/slices/coachContext";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  تبويباتُ المدرّبين — «أعمل الآن على: س»  (للمدير الأعلى)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * تبويبٌ لكل مدرّب تفتحه فتصير اللوحةُ كلُّها **كما يراها هو**: مشتركوه وخططُه ووصفاتُه، وكلُّ ما
 * تضيفه يُنسب إليه. و«المنصّة» هي التبويب الأول — المشهدُ كما كان.
 *
 * 🔑 **السياقُ يُحمَل مع كل طلب** (`X-Coach-Context` في `useAxios`) لا يُخزَّن في الخادم، فتبويبان
 *    لمدرّبين مختلفين لا يختلطان.
 *
 * ⚠️ **وقائمةُ المدرّبين تُجلب بلا ترويسة السياق**: `GET coaches` ليس من مسارات وضع المدرّب، فبالترويسة
 *    يردّ 403 — أي أن فتح تبويبٍ ثانٍ من داخل تبويبٍ كان سيفشل.
 *
 * ⛔ وهذا تجميلٌ لا حماية: الخادمُ لا يحترم الترويسة إلا من مديرٍ أعلى.
 */
export default function CoachTabs() {
  const { isSuper } = usePermissions();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAppSelector(selectCurrentToken);
  const tabs = useAppSelector(selectCoachTabs);
  const active = useAppSelector(selectActiveCoach);
  const [picking, setPicking] = useState(false);

  const { data: coaches = [] } = useQuery(
    ["coach-tabs-list"],
    async () => {
      const res = await axiosLib.get(`${ADMIN_BASE_URL}/coaches`, {
        headers: { authorization: `Bearer ${token as string}`, accept: "application/json", "X-Coach-Context": "" },
      });
      return (res.data?.data ?? []) as Array<{ id: number; name: string; is_house: boolean; pending_request?: unknown }>;
    },
    { enabled: isSuper && picking, staleTime: 30_000 }
  );

  if (!isSuper) return null;

  /** تبديلُ السياق يجعل كلَّ ما في الذاكرة بائتاً: بيانات مدرّب لا تُعرض تحت اسم آخر. */
  const switchTo = async (id: number | null) => {
    dispatch(activate(id));
    await queryClient.invalidateQueries();
    navigate(id === null ? "/coaches" : "/coach-home");
  };

  const open = async (c: { id: number; name: string }) => {
    dispatch(openTab({ id: c.id, name: c.name }));
    setPicking(false);
    await queryClient.invalidateQueries();
    navigate("/coach-home");
  };

  const close = async (id: number) => {
    const wasActive = active === id;
    dispatch(closeTab(id));
    if (wasActive) {
      await queryClient.invalidateQueries();
      navigate("/coaches");
    }
  };

  const current = tabs.find((t) => t.id === active);
  const color = (hue: number) => `hsl(${hue} 70% 55%)`;

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-1 px-3 pt-2 bg-surface-base border-b border-line">
      <div
        className="flex items-center gap-1 min-w-0 overflow-x-auto"
        role="tablist"
        aria-label="تبويبات المدرّبين"
      >
        <button
          role="tab"
          aria-selected={active === null}
          onClick={() => switchTo(null)}
          className={`px-4 py-2 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-colors ${
            active === null
              ? "bg-ink-800 text-content border border-b-0 border-line"
              : "text-content-muted hover:text-content"
          }`}
        >
          المنصّة
        </button>

        {tabs.map((t) => (
          <div
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={`flex items-center gap-2 ps-3 pe-1 py-2 rounded-t-xl text-sm whitespace-nowrap border border-b-0 ${
              active === t.id ? "bg-ink-800 text-content font-semibold" : "text-content-muted border-transparent hover:text-content"
            }`}
            style={active === t.id ? { borderColor: color(t.hue) } : undefined}
          >
            <button onClick={() => switchTo(t.id)} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color(t.hue) }} />
              {t.name}
            </button>
            <button
              onClick={() => close(t.id)}
              aria-label={`إغلاق تبويب ${t.name}`}
              className="w-6 h-6 grid place-items-center rounded-md hover:bg-ink-700 text-content-faint"
            >
              ×
            </button>
          </div>
        ))}

      </div>
        {/* خارج حاوية التمرير: overflow يقصّ القائمة المنسدلة */}
        <div className="relative ms-1 shrink-0">
          <button
            onClick={() => setPicking((v) => !v)}
            className="px-3 py-2 text-sm text-brand-400 whitespace-nowrap"
            aria-haspopup="listbox"
            aria-expanded={picking}
          >
            + مدرّب
          </button>
          {picking && (
            <div
              className="absolute top-full start-0 z-40 mt-1 w-56 max-h-72 overflow-y-auto rounded-xl bg-ink-800 border border-line shadow-pop py-1"
              role="listbox"
            >
              {coaches.filter((c) => !c.is_house).length === 0 ? (
                <p className="px-3 py-2 text-xs text-content-muted">لا مدرّبين بعد</p>
              ) : (
                coaches
                  .filter((c) => !c.is_house)
                  .map((c) => (
                    <button
                      key={c.id}
                      role="option"
                      onClick={() => open(c)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-start hover:bg-ink-700"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color(hueFor(c.id)) }} />
                      <span className="flex-1 truncate">{c.name}</span>
                      {c.pending_request ? <span className="text-[10px] text-warning-400">طلب صرف</span> : null}
                    </button>
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      {current && (
        <div
          className="flex items-center gap-3 px-4 py-2 text-sm"
          style={{ background: `hsl(${current.hue} 60% 16%)`, borderBottom: `2px solid ${color(current.hue)}` }}
          role="status"
        >
          <Icon name="shield" />
          <p className="flex-1 min-w-0 text-content">
            أنت داخل حساب <b>{current.name}</b> — مشتركوه وخططُه ووصفاتُه، وكل ما تضيفه يُنسب إليه.
          </p>
          <button
            onClick={() => switchTo(null)}
            className="px-3 py-1 rounded-lg bg-ink-800/70 text-content-muted hover:text-content text-xs whitespace-nowrap"
          >
            رجوع للمنصّة
          </button>
        </div>
      )}
    </div>
  );
}
