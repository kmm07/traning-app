import { Text } from "components";

type Props = {
  state: "subscriber" | "free" | "cancel" | "trail";
  className?: string;
  textClassName?: string;
};

function SubState({ state, className, textClassName }: Props) {
  const stateObj = {
    subscriber: {
      src: "/images/img_checkmark.svg",
      name: "مشترك (سنة)",
    },
    free: {
      src: "/images/img_clock5.png",
      name: "مجاني",
    },
    cancel: {
      src: "/images/img_arrowright.svg",
      name: "ملغي",
    },
    not_subscriped: {
      src: "/images/img_arrowright.svg",
      name: "غير مشترك",
    },
    trail: {
      src: "/images/img_error.svg",
      name: "تجريبي",
    },
  };
  return (
    <div className="flex gap-2 items-center justify-between">
      <img
        className={`h-5 ${className}`}
        src={stateObj[state].src}
        alt={stateObj[state].name}
      />
      <Text className={textClassName}>{stateObj[state].name}</Text>
    </div>
  );
}

export { SubState };
