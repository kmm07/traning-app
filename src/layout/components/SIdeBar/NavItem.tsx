import { Img, Text } from "components";
import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  name: string;
  src: string;
  isActive: boolean;
  link: string;
};

function NavItem({ name, src, isActive, link }: Props) {
  return (
    <NavLink
      to={link}
      className={`flex flex-row gap-[23px] items-center relative pl-8 py-[21px] justify-start w-full ${
        isActive ? "bg-[#201E35]" : ""
      } `}
    >
      {isActive && (
        <Img
          className="h-[90px] mb-0.5 rounded-sm absolute -left-2"
          src="images/img_signal.svg"
          alt="signal"
        />
      )}
      <Img className="h-[32px] w-[38px]" src={src} alt="mailEleven" />
      <Text
        className="text-center text-white-A700 text-xl tracking-[0.14px]"
        size="xl"
      >
        {name}
      </Text>
    </NavLink>
  );
}

export default NavItem;
