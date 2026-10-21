/*
 * [اشتراكات المدرّبين · المرحلة ١ — اللوحة] أنواعُ ردود الخادم وصياغةُ المال.
 *
 * ⚖️ **المبالغ تصل من الخادم بالعملتين معاً** (`{usd, sar}`) — والريال يُحسب
 *    هناك بالسعر الثابت في `config/coaches.php`. فلا يُضرب هنا في 3.75 ثانيةً،
 *    وإلا صار للتحويل مصدران يتباعدان يوم يتغيّر السعر.
 */

export interface Money {
  usd: number;
  sar: number;
}

export type CoachStatus = "draft" | "hidden" | "visible";

export interface Coach {
  id: number;
  name: string;
  is_house: boolean;
  revenue_share_pct: number;
  status: CoachStatus;
  offering_id: string | null;
  bio: string | null;
  image: string | null;
  subscribers?: { active: number; expired: number; total: number };
  totals?: {
    entries: number;
    missing_amount: number;
    gross: Money;
    tax: Money;
    store_fee: Money;
    net: Money;
    ai_cost: Money;
    coach_share: Money;
  };
  paid_out?: Money;
  balance?: Money;
  products?: any[];
}

export const STATUS_LABEL: Record<CoachStatus, string> = {
  draft: "مسودّة",
  hidden: "مخفيّ",
  visible: "ظاهر",
};

export const STATUS_TONE: Record<CoachStatus, "neutral" | "warning" | "success"> = {
  draft: "neutral",
  hidden: "warning",
  visible: "success",
};

const fmt = (n: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const usd = (m?: Money | null) => `$${fmt(m?.usd ?? 0)}`;
export const sar = (m?: Money | null) => `${fmt(m?.sar ?? 0)} ر.س`;
