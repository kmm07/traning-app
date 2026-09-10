import { Button } from "components";

/*
 * ألسنةٌ أفقية.
 *
 * ⚠️ **بلا مستدعٍ في المستودع اليوم** (مقيس: صفر). يبقى لأنه مُصدَّر من
 *    `components/index`، ويُصلَح بدل تركه ملغوماً:
 *
 * 🔴 **كان كلُّ لسانٍ ينادي `onClick` نفسها بلا أن يقول أيُّه نُقر** ⇒
 *    مستدعٍ لا يستطيع تمييز اللسان المضغوط أصلاً.
 * 🔴 **و«اضافة» كان `<span>` يحوي صورةً ونصّاً بلا `onClick`** — زرٌّ يبدو
 *    زرّاً ولا يفعل شيئاً، ونصُّه بلا همزة.
 */
type Props = {
  tabs: Array<{
    name: string;
    isActive?: boolean;
  }>;
  onClick: (index: number) => void;
  onAdd?: () => void;
};

function Tabs({ tabs, onClick, onAdd }: Props) {
  return (
    <div className="flex gap-3 items-center flex-wrap">
      {tabs.map((tab, index) => (
        <Button
          key={tab.name}
          onClick={() => onClick(index)}
          secondaryBorder={!tab.isActive}
          primary={tab.isActive}
          rounded="full"
          size="small"
        >
          {tab.name}
        </Button>
      ))}

      {onAdd && (
        <Button onClick={onAdd} ghost size="small" rounded="full">
          <span className="text-lg leading-none">+</span>
          إضافة
        </Button>
      )}
    </div>
  );
}

export { Tabs };
