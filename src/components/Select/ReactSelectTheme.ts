/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  سمةُ react-select — كانت **غيرَ مقروءة**، وهذا ليس وصفاً بلاغياً
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **القيمةُ المختارة كانت `color: "#151423"`** — أي **رماديٌّ شديدُ
 *    القتامة على أرضيةٍ شفّافةٍ فوق أسودَ اللوحة**. فالمدرّب يختار «الفئة
 *    الثالثة» ثم لا يرى ما اختار: حقلٌ يبدو فارغاً وقيمتُه مضبوطة.
 *    وهو مستعملٌ في **١٩ ملفاً** — كلُّ نموذجِ خطّةٍ ووجبةٍ وتمرين.
 *
 * 🔴 **والخياراتُ غيرُ المُبرَزة كانت أسوأ**: `color: isFocused && "#151423"`
 *    ⇒ حين لا يكون الخيارُ مُبرَزاً تكون القيمةُ **`false`** لا لوناً، فيسقط
 *    على افتراضيّ react-select (`#333`) فوق قائمةٍ لونُها `#151423` —
 *    نصٌّ داكنٌ على داكن. **والمُبرَزُ نفسُه `#151423` على `#1B4965`**، أي
 *    أن الحالتين معاً غيرُ مقروءتين.
 *
 * ⚖️ **والألوانُ هنا مكتوبةٌ نصّاً لا بأصناف Tailwind** لأن react-select
 *    يبني أنماطه بـJS. فالقيمُ مأخوذةٌ من نفس سلّم الإعداد حرفياً، ومكتوبٌ
 *    فوق كلٍّ منها اسمُها كي لا تنزاح عن أمّها عند أيّ تعديلٍ قادم.
 */

const INK_950 = "#090909"; // colors.ink.950   — الأرضية
const INK_900 = "#0F0F11"; // colors.ink.900   — سطحٌ غائر (الحقل)
const INK_850 = "#141416"; // colors.ink.850   — سطحُ القائمة
const INK_800 = "#1A1A1D"; // colors.ink.800   — خيارٌ مُبرَز
const INK_750 = "#232326"; // colors.ink.750   — الحدّ
const INK_700 = "#2A2A2E"; // colors.ink.700   — حدٌّ بارز
const INK_400 = "#7A7A83"; // colors.ink.400   — نصٌّ باهت
const INK_300 = "#A1A1AA"; // colors.ink.300   — نصٌّ ثانويّ
const INK_50 = "#F6F6F7"; // colors.ink.50    — النصّ
const BRAND = "#D1FE0F"; // colors.brand.400 — لونُ الهوية

const ReactSelectTheme = () => ({
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "44px",
    height: "44px",
    backgroundColor: INK_900,
    borderColor: state.isFocused ? BRAND : INK_750,
    borderWidth: 1,
    boxShadow: state.isFocused ? "0 0 0 3px rgba(209,254,15,0.18)" : "none",
    flexWrap: "nowrap",
    borderRadius: 14,
    color: INK_50,
    transition: "border-color 160ms ease, box-shadow 160ms ease",
    cursor: "pointer",
    ":hover": {
      borderColor: state.isFocused ? BRAND : INK_700,
    },
  }),

  valueContainer: (base: any) => ({
    ...base,
    height: "42px",
    padding: "0 12px",
    flexWrap: "nowrap",
  }),

  input: (base: any) => ({
    ...base,
    color: INK_50,
    margin: 0,
    padding: 0,
  }),

  /** ← موضعُ العطل الأول: صارت بلون النصّ لا بلون الأرضية. */
  singleValue: (base: any) => ({
    ...base,
    color: INK_50,
  }),

  placeholder: (base: any) => ({
    ...base,
    color: INK_400,
  }),

  indicatorsContainer: (base: any) => ({
    ...base,
    height: "42px",
  }),

  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: INK_750,
  }),

  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? BRAND : INK_400,
    ":hover": { color: INK_300 },
  }),

  clearIndicator: (base: any) => ({
    ...base,
    color: INK_400,
    ":hover": { color: "#F04438" },
  }),

  /** ← موضعُ العطل الثاني: لونُ النصّ يُحدَّد في الحالتين لا في واحدة. */
  option: (base: any, { isFocused, isSelected, isDisabled }: any) => ({
    ...base,
    backgroundColor: isSelected
      ? BRAND
      : isFocused
      ? INK_800
      : "transparent",
    color: isSelected ? INK_950 : isDisabled ? INK_400 : INK_50,
    fontWeight: isSelected ? 600 : 400,
    borderRadius: 10,
    cursor: isDisabled ? "not-allowed" : "pointer",
    padding: "9px 12px",
    ":active": {
      backgroundColor: isSelected ? BRAND : INK_700,
      color: isSelected ? INK_950 : INK_50,
    },
  }),

  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    backgroundColor: INK_850,
    border: `1px solid ${INK_750}`,
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
    boxShadow:
      "0 8px 16px -4px rgba(0,0,0,0.5), 0 24px 56px -20px rgba(0,0,0,0.75)",
  }),

  menuList: (base: any) => ({
    ...base,
    padding: 8,
    maxHeight: 280,
  }),

  noOptionsMessage: (base: any) => ({
    ...base,
    color: INK_400,
    fontSize: 14,
  }),

  loadingMessage: (base: any) => ({
    ...base,
    color: INK_400,
    fontSize: 14,
  }),

  multiValue: (base: any) => ({
    ...base,
    backgroundColor: INK_800,
    border: `1px solid ${INK_700}`,
    borderRadius: 999,
    overflow: "hidden",
  }),

  multiValueLabel: (base: any) => ({
    ...base,
    color: INK_50,
    fontSize: 13,
    padding: "2px 8px",
  }),

  multiValueRemove: (base: any) => ({
    ...base,
    color: INK_300,
    ":hover": {
      backgroundColor: "#F04438",
      color: "#FFFFFF",
    },
  }),
});

export default ReactSelectTheme;
