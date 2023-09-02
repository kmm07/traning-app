import { Img, Text } from "components";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ToolProps {
  name: string;

  isActive?: boolean;
  src: string;
  subMenu?: {
    name: string;
    link: string;
  }[];
}
const CollapseTree = ({
  name,

  isActive = false,
  subMenu = [],
  src,
}: ToolProps) => {
  const router = useNavigate();
  const { pathname } = useLocation();
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <span
        onClick={() => {
          setToggle(!toggle);
        }}
        className="flex flex-row items-center relative  justify-start w-full"
      >
        <div
          className={`flex flex-row gap-[8px] items-center relative ps-8 py-[21px] justify-start w-full ${
            isActive ? "bg-[#201E35]" : ""
          } `}
        >
          {isActive && (
            <Img
              className="h-[90px] mb-0.5 rounded-sm absolute rotate-180 -right-2.5"
              src="/images/img_signal.svg"
              alt="signal"
            />
          )}
          <Img className="h-[32px] w-[38px]" src={src} alt="mailEleven" />
          <Img
            src="/images/img_arrowdown_white_a700.svg"
            className={`duration-200 ${toggle ? "" : "-rotate-90"} `}
          />
          <Text className="text-center cursor-pointer text-white-A700 text-xl tracking-[0.14px]">
            {name}
          </Text>
        </div>
      </span>

      <div
        className={`${
          !toggle ? "h-0 duration-200 overflow-hidden" : "duration-200 pb-5"
        }`}
      >
        <div className="ms-20 border-2 ps-8 border-t-0 rounded-t-none border-e-0 rounded-e-none dark:border-white rounded-lg h-6 w-10">
          <button
            onClick={() => {
              void router(subMenu[0].link);
            }}
            className={`${
              pathname === subMenu[0]?.link ? "!bg-[#201E35]" : ""
            } w-[120px] text-right rounded-none px-2 py-1 mt-1 mr-1`}
          >
            <Text> {subMenu[0]?.name ?? subMenu[0]?.name}</Text>
          </button>
        </div>

        {subMenu.map(({ name, link }, index) => {
          return (
            index !== 0 && (
              <div className="ms-20 border-2 ps-4 border-t-0 rounded-t-none border-e-0 rounded-e-none dark:border-white rounded-lg h-12 w-10">
                <button
                  onClick={() => {
                    void router(link);
                  }}
                  className={`${
                    pathname === link ? "!bg-[#201E35]" : ""
                  } w-[120px] text-right rounded-none px-2 py-1 mt-8 mr-5`}
                >
                  <Text className="mt-8">{name}</Text>
                </button>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default CollapseTree;
