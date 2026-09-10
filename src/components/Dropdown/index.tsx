import { Img } from "components";
import React from "react";

type Props = {
  children: React.ReactNode;
  ntNumber?: number;
  list: Array<{
    label: string;
    value?: string;
    onClick?: () => void;
  }>;
  showArrow?: boolean;
};

function Dropdown({ children, ntNumber, list = [], showArrow = true }: Props) {
  return (
    <div className="relative dropdown dropdown-right">
      <label
        tabIndex={0}
        className="btn cursor-pointer p-1.5 rounded-lg bg-transparent border-none text-content-muted hover:bg-ink-800 hover:text-content transition-colors"
      >
        <div className=" whitespace-nowrap flex items-center gap-2 w-fit">
          {children}

          {showArrow && (
            <Img
              className="h-[9px] my-3"
              src="/images/img_arrowdown.svg"
              alt="arrowdown"
            />
          )}

          {ntNumber && (
            <span className="grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-brand-400 text-ink-950 text-[10px] font-bold">
              {ntNumber}
            </span>
          )}
        </div>
      </label>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-2 z-[60] p-1.5 shadow-pop bg-surface border border-line rounded-card w-48"
      >
        {list.map((item, index) => (
          <li onClick={item.onClick} key={index}>
            <span className="justify-between rounded-lg px-3 py-2 text-sm text-content-muted hover:bg-ink-800 hover:text-content transition-colors">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Dropdown };
