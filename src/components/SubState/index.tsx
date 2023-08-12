import { Text } from "components";

type Props = {
  state: "subscriber" | "free" | "cancel" | "trail";
};

function SubState({ state }: Props) {
  const stateObj = {
    subscriber: {
      src: "images/img_checkmark.svg",
      name: "مشترك (سنة)",
    },
    free: {
      src: "images/img_clock5.png",
      name: "مجاني",
    },
    cancel: {
      src: "images/img_arrowright.svg",
      name: "ملغي",
    },
    trail: {
      src: "images/img_error.svg",
      name: "تجريبي",
    },
  };
  return (
    <div className="flex gap-2 items-center">
      <img
        className="h-5"
        src={stateObj[state].src}
        alt={stateObj[state].name}
      />
      <Text>{stateObj[state].name}</Text>
    </div>
  );
}

export { SubState };
