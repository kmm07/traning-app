import { Text } from "components";

type Props = {
  state: "new" | "renewal" | "issue" | "cancelled";
  className?: string;
  textClassName?: string;
};

function SubState({ state, className, textClassName }: Props) {
  const stateObj = {
    new: {
      src: "/images/img_checkmark.svg",
      name: "مشترك جديد",
    },
    renewal: {
      src: "/images/img_clock5.svg",
      name: "تجديد الإشتراك",
    },
    issue: {
      src: "/images/img_error.png",
      name: "خطأ",
    },
    cancelled: {
      src: "/images/img_error.svg",
      name: "ملغي",
    },
  };
  return (
    <div className="flex gap-2 items-center justify-between">
      <img
        className={`h-5 ${className}`}
        src={stateObj[state]?.src}
        alt={stateObj[state]?.name}
      />
      <Text className={textClassName}>{stateObj[state]?.name}</Text>
    </div>
  );
}

export { SubState };
