import { Text } from "components";

type Props = {
  state: "subscriped" | "not_subscriped" | "issue" | "cancelled";
  className?: string;
  textClassName?: string;
};

function SubState({ state, className, textClassName }: Props) {
  const stateObj = {
    subscriped: {
      src: "/images/img_checkmark.svg",
      name: "مشترك جديد",
    },

    not_subscriped: {
      src: "/images/img_error.svg",
      name: "غير مشترك",
    },
    cancelled: {
      src: "/images/img_error.svg",
      name: "ملغي",
    },
    issue: {
      src: "/images/img_error.svg",
      name: "خطأ",
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
