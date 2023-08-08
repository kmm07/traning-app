import React from "react";

import { Img, Input, Text } from "components";

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<any>;

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <>
      <header className={props.className}>
        <div className="flex flex-col items-center justify-start w-[62%] md:w-full">
          <Input
            isSearch
            isForm={false}
            inputSize="large"
            name="groupFifteen"
            placeholder="Search"
            className="font-roboto font-semibold p-0 placeholder:text-indigo-300 sm:pr-5 text-indigo-300 text-left text-sm tracking-[0.14px] w-full"
          />
        </div>
        <Img
          className="h-10 md:h-auto ml-36 md:ml-[0] md:mt-0 my-[5px] object-cover w-10"
          src="images/img_group.png"
          alt="group"
        />
        <div className="flex flex-col items-center justify-start md:ml-[0] ml-[54px] md:mt-0 my-[7px] w-1/5 md:w-full">
          <div className="flex flex-row items-end justify-between pl-0.5 pt-0.5 w-full">
            <Img
              className="h-[30px] md:h-auto mb-1 ml-1.5 object-cover w-[30px]"
              src="images/img_image.png"
              alt="image_One"
            />
            <div className="h-[27px] md:h-[33px] mt-1.5 relative w-[56%]">
              <Text className="absolute h-full inset-[0] justify-center m-auto text-2xl md:text-[22px] text-white-A700 sm:text-xl tracking-[0.69px] w-max">
                خالد المالكي
              </Text>
            </div>
            <Img
              className="h-[9px] my-3"
              src="images/img_arrowdown.svg"
              alt="arrowdown"
            />
          </div>
        </div>
      </header>
    </>
  );
};

Header.defaultProps = {};

export default Header;
