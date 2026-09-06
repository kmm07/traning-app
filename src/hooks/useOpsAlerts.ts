import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "./useRedux";
import { selectCurrentToken } from "redux/slices/auth";
import { ADMIN_BASE_URL } from "./useAxios";

/** دوريةُ الاستطلاع. المرصدُ نفسه يعمل كل ٥ دقائق، فدقيقةٌ كافيةٌ وزائدة. */
const POLL_MS = 60_000;

const LIST_URL = `${ADMIN_BASE_URL}/ops/alerts`;
const ACK_URL = `${ADMIN_BASE_URL}/ops/alerts/acknowledge`;

export interface OpsAlert {
  id: number;
  kind: string;
  severity: "warning" | "critical";
  /** نصٌّ عربيٌّ **جاهزٌ للعرض** يأتي من الخادم — لا تُترجَم الرموز هنا. */
  title: string;
  detail: string;
  occurred_at: string | null;
  occurred_human: string;
}

interface State {
  count: number;
  severity: "warning" | "critical" | null;
  alerts: OpsAlert[];
}

const EMPTY: State = { count: 0, severity: null, alerts: [] };

/**
 * تنبيهاتُ السعة — «هل اختنق أحدُ العمّال؟»
 *
 * ⚖️ **والنصّ لا يُبنى هنا.** الخادم يكتب `title`/`detail` بالعربية، واللوحةُ
 * تعرضهما كما هما — فلا يفترق نصُّ البريد عن نصّ الشريط، ولا يظهر رمزٌ
 * لاتينيّ حين يُضاف نوعُ تنبيهٍ جديد لا تعرفه اللوحة.
 *
 * ⛔ **والفشل صامت بقصد**: انقطاعُ الشبكة أو انتهاءُ الجلسة يترك الشريط مخفياً
 * ولا يرسم شريطاً أحمر كاذباً — «تعذّر السؤال» ليس «وقع اختناق».
 */
export default function useOpsAlerts() {
  const token = useAppSelector(selectCurrentToken);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const [state, setState] = useState<State>(EMPTY);

  const fetchAlerts = useCallback(async () => {
    if (tokenRef.current === null || tokenRef.current === undefined) return;

    try {
      const res = await fetch(LIST_URL, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${tokenRef.current as string}`,
        },
      });

      if (!res.ok) return; // 401/5xx ⇒ لا نرسم شيئاً

      const body = await res.json();
      const data = body?.data ?? {};

      setState({
        count: Number(data.unread_count ?? 0),
        severity: data.severity ?? null,
        alerts: Array.isArray(data.alerts) ? data.alerts : [],
      });
    } catch {
      /* صامت — انظر التعليق أعلاه */
    }
  }, []);

  const acknowledge = useCallback(async () => {
    // تصفيرٌ محلّيٌّ فوراً: الخادم يختم، والاستطلاع التالي بعد دقيقة —
    // وإبقاءُ الشريط ثانيةً بعد الضغطة يُقرأ عطلاً في الزرّ.
    setState(EMPTY);

    try {
      await fetch(ACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${tokenRef.current as string}`,
        },
        body: "{}",
      });
    } catch {
      /* صامت */
    }

    void fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    void fetchAlerts();
    const timer = window.setInterval(() => void fetchAlerts(), POLL_MS);

    // العودةُ إلى التبويب تسأل فوراً بدل انتظار الدورة.
    const onVisible = () => {
      if (document.visibilityState === "visible") void fetchAlerts();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchAlerts, token]);

  return { ...state, acknowledge };
}
