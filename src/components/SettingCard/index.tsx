import { Card, Dropdown, Img, Text } from "components";
import React from "react";

type Props = {
  active: boolean;
  onClick: () => void;
  label: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  id: number;
};

function SettingCard({ id, active, onClick, label, onEdit, onDelete }: Props) {
  return (
    <Card
      className={`p-4 w-[180px] cursor-pointer ${active && "bg-[#00A4FA]"}`}
    >
      <div
        onClick={onClick}
        className={`flex flex-col justify-between items-center relative `}
      >
        <div className="w-4 absolute -top-3 left-0">
          <Dropdown
            showArrow={false}
            list={[
              {
                label: "تعديل",
                onClick: () => onEdit(id),
              },
              {
                label: "حذف",
                onClick: () => onDelete(id),
              },
            ]}
          >
            <Img src="/images/img_customize2.png" />
          </Dropdown>
        </div>

        <Text size="3xl" className="mt-4">
          {label}
        </Text>
      </div>
    </Card>
  );
}

export { SettingCard };
