import { Img } from "components";
import React from "react";

type Props = {
  children: React.ReactNode;
  ntNumber?: number;
  list: Array<{
    label: string;
    value: string;
  }>;
};

function Dropdown({ children, ntNumber, list = [] }: Props) {
  return (
    <div className="relative dropdown dropdown-right">
      <label tabIndex={0} className="btn  p-1 bg-transparent border-none">
        <div className=" whitespace-nowrap flex items-center gap-2 w-fit">
          {children}{" "}
          <Img
            className="h-[9px] my-3"
            src="/images/img_arrowdown.svg"
            alt="arrowdown"
          />
          {ntNumber && (
            <span className=" bg-primary h-5 w-5 border-0 text-white  indicator-item">
              {ntNumber}
            </span>
          )}
        </div>
      </label>

      <ul
        tabIndex={0}
        className="menu   menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52"
      >
        {list.map((item, index) => (
          <li key={index}>
            <a className="justify-between">{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Dropdown };
