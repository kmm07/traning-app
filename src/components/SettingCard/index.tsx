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
    <Card
      className={`p-4 w-[180px] cursor-pointer ${
        active && "!bg-[#00A4FA]"
      } ${className}`}
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

        <Text size="3xl" className="mt-4 text-center !whitespace-normal">
          {label}
        </Text>
      </div>
    </Card>
  );
}

export { SettingCard };
