import React from "react";

import { Dropdown, Img, Input } from "components";

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<any>;

const Header: React.FC<HeaderProps> = (props) => {
  return (
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

      <div className="flex flex-row items-center mx-10 gap-10">
        <Img
          className="h-10 object-cover "
          src="/images/img_group.png"
          alt="group"
        />
        <Img className="h-[71px]" src="/images/img_folder.svg" alt="folder" />
        <Img
          className="h-[30px] md:h-auto mb-1 ml-1.5 object-cover "
          src="/images/img_image.png"
          alt="image_One"
        />
        <Dropdown
          list={[
            {
              label: "asd",
              value: "asd",
            },
          ]}
        >
          خالد المالكي
        </Dropdown>
      </div>
    </header>
  );
};

Header.defaultProps = {};

export default Header;
