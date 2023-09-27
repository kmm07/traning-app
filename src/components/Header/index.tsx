import React from "react";

import { Img, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<any>;

const Header: React.FC<HeaderProps> = (props) => {
  // get chat notifications ================>

  const url = "/chat-notification";

  const { data: notifications = [] }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  return (
    <header className={props.className}>
      <div className="flex flex-col items-center justify-start w-[62%] md:w-full"></div>

      <div className="flex flex-row items-center mx-10 gap-10">
        <div className="dropdown">
          <label tabIndex={0} className="btn m-1 relative ">
            <Img
              className="h-10 object-cover "
              src="/images/img_group.png"
              alt="group"
            />
            <span className="absolute -top-2 -right-2 indicator-item badge-sm h-6 rounded-full badge badge-warning">
              {notifications?.length}
            </span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {notifications?.length > 0 ? (
              notifications?.map((item: any, index: any) => (
                <li key={index}>
                  <a className="line-clamp-1">{item?.message}</a>
                  <span>{item?.created_at}</span>
                </li>
              ))
            ) : (
              <Text
                as="h5"
                className="font-bold !text-center w-full !text-[12px]"
              >
                {"لا يوجد رسائل فائتة"}
              </Text>
            )}
          </ul>
        </div>
        {/* <Img className="h-[71px]" src="/images/img_folder.svg" alt="folder" /> */}
        <Img
          className="h-[30px] md:h-auto mb-1 ml-1.5 object-cover "
          src="/images/img_image.png"
          alt="image_One"
        />
        خالد المالكي
      </div>
    </header>
  );
};

Header.defaultProps = {};

export default Header;
