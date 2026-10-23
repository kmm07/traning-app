import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logOut } from "./auth";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  سياقُ التبويب: «أعمل الآن على مدرّب س» — للمدير الأعلى
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔑 **السياقُ حالةُ عميلٍ تُحمَل مع كل طلب لا حالةُ جلسةٍ في الخادم**
 *    (ترويسة `X-Coach-Context` في `useAxios`). مديرٌ بتبويبين لمدرّبين لو
 *    خُزِّن سياقُه في الخادم لأضاف جدولاً لمدرّبٍ وهو يظنّ أنه عند آخر.
 *
 * ⚖️ **والخادمُ هو الحَكَم**: الترويسةُ لا تُحترم إلا من مديرٍ أعلى، فمدرّبٌ
 *    لا يغيّر نطاقَه بها ولو عبث بالتخزين المحلّي.
 *
 * `tabs` المفتوحةُ تُحفظ في `localStorage` فلا تضيع بتحديث الصفحة. و`active`
 * `null` = المنصّة (لا ترويسة، والمشهدُ كما كان).
 */

export interface CoachTab {
  id: number;
  name: string;
  /** لونُ التبويب — يتميّز به المدرّبُ المفتوح عن غيره في الشريط واللافتة. */
  hue: number;
}

interface State {
  tabs: CoachTab[];
  active: number | null;
}

const KEY = "pt_coach_tabs";

function load(): State {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw && Array.isArray(raw.tabs)) {
      const active = raw.tabs.some((t: CoachTab) => t.id === raw.active)
        ? raw.active
        : null;
      return { tabs: raw.tabs, active };
    }
  } catch {
    /* التخزين المحلّيّ غير متاح (تصفّح خاصّ) — يبدأ بلا تبويبات */
  }
  return { tabs: [], active: null };
}

function save(state: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* لا يُسقط شيئاً */
  }
}

/** لونٌ ثابتٌ لكل مدرّب من معرّفه: يتّسق بين الجلسات ولا يحتاج تخزيناً. */
export const hueFor = (id: number) => (id * 67) % 360;

const slice = createSlice({
  name: "coachContext",
  initialState: load(),
  reducers: {
    openTab: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const { id, name } = action.payload;
      if (!state.tabs.some((t) => t.id === id)) {
        state.tabs.push({ id, name, hue: hueFor(id) });
      }
      state.active = id;
      save(state);
    },
    activate: (state, action: PayloadAction<number | null>) => {
      state.active =
        action.payload === null || state.tabs.some((t) => t.id === action.payload)
          ? action.payload
          : state.active;
      save(state);
    },
    closeTab: (state, action: PayloadAction<number>) => {
      state.tabs = state.tabs.filter((t) => t.id !== action.payload);
      if (state.active === action.payload) state.active = null;
      save(state);
    },
    /** عند الخروج: لا يبقى سياقٌ لحسابٍ آخر يدخل بعده من الجهاز نفسه. */
    resetTabs: (state) => {
      state.tabs = [];
      state.active = null;
      save(state);
    },
  },
  // الخروجُ من أيّ موضع (زرّ · 401 · حسابٌ معطَّل) يمحو التبويبات دون أن يتذكّرها كلُّ مستدعٍ
  extraReducers: (builder) => {
    builder.addCase(logOut, (state) => {
      state.tabs = [];
      state.active = null;
      save(state);
    });
  },
});

export const { openTab, activate, closeTab, resetTabs } = slice.actions;
export default slice.reducer;

export const selectCoachTabs = (s: { coachContext: State }) => s.coachContext.tabs;
export const selectActiveCoach = (s: { coachContext: State }) => s.coachContext.active;
