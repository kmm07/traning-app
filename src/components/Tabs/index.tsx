import { Button, Img } from "components";

type Props = {
  tabs: Array<{
    name: string;

    isActive?: boolean;
  }>;
  onClick: () => void;
};

function Tabs({ tabs, onClick }: Props) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => {
        return (
          <Button
            onClick={onClick}
            secondaryBorder={!tab.isActive}
            primary={tab.isActive}
          >
            {tab.name}
          </Button>
        );
      })}
      <span className="text-indigo-500">
        <Img src="/images/plus.svg" />
        اضافة
      </span>
    </div>
  );
}

export { Tabs };
