import { Card, Dropdown, Img, Text } from "components";

type Props = {
  active: boolean;
  onClick: () => void;
  label: string;
  onEdit?: (value?: any) => void;
  onDelete?: (id: number) => void;
  id: number | string;
  className?: string;
};

function SettingCard({
  className,
  id,
  active,
  onClick,
  label,
  onEdit,
  onDelete,
}: Props) {
  return (
    /*
     * 🔴 **الحالةُ النشطة كانت `!bg-[#00A4FA]`** — أزرقُ فاتحٌ من القالب
     *    القديم، ونصُّها يبقى أبيضَ فوقه فيضعف التباين. صارت بلون الهوية
     *    ونصُّها أسود، وبحدٍّ يميّزها ولو عُرضت بالأبيض والأسود.
     * ⛔ **وعرضُها كان مكوَّداً `w-[180px]`** ⇒ اسمُ فئةٍ طويل يلتفّ على
     *    ثلاثة أسطر ويكسر ارتفاعَ الصفّ. صار حدّاً أدنى يتمدّد.
     */
    <Card
      hover
      className={`p-4 min-w-[160px] cursor-pointer transition-colors ${
        active
          ? "!bg-brand-400 !border-brand-400"
          : ""
      } ${className ?? ""}`}
    >
      <div
        onClick={onClick}
        className={`flex flex-col justify-between items-center relative `}
      >
        {(onEdit || onDelete) && (
          <div className="w-4 absolute -top-3 left-0">
            <Dropdown
              showArrow={false}
              list={[
                {
                  label: "تعديل",
                  onClick: onEdit,
                },
                {
                  label: "حذف",
                  onClick: () => onDelete && onDelete(id as any),
                },
              ]}
            >
              <Img src="/images/img_customize2.png" />
            </Dropdown>
          </div>
        )}

        <Text
          size="base"
          bold
          className={`mt-3 text-center !whitespace-normal !w-full leading-relaxed ${
            active ? "!text-ink-950" : ""
          }`}
        >
          {label}
        </Text>
      </div>
    </Card>
  );
}

export { SettingCard };
