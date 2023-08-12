import { Text } from "components";
import React from "react";

type Props = {
  percentage: number;
  className?: string;
  body?: React.ReactNode;
  label?: string;
};

const RadialProgress = ({ percentage, className, body, label }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-fit gap-2">
      <Text>{label}</Text>
      <div
        className={`radial-progress  ${className}`}
        style={
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          { "--value": percentage }
        }
      >
        {body}
      </div>
    </div>
  );
};

export { RadialProgress };
