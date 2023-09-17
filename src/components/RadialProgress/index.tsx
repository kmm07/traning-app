import { Input } from "components";
import React from "react";

type Props = {
  percentage: number | number;
  className?: string;
  body?: React.ReactNode;
  label?: string | number;
  name?: string | number;
};

const RadialProgress = ({ percentage, className, body, name }: Props) => {

  return (
    <div className="flex flex-col justify-center items-center w-fit gap-2">
      <Input
        name={name ?? ("blank" as any)}
        className="text-center font-bold !text-[20px] w-[98px]"
      />
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
