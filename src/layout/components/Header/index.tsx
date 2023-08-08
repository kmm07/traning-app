import { Img, Text } from "components";
import HeaderSearch from "components/Header";

function Header() {
  return (
    <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between w-full p-5">
      <div className="border border-light_blue-A700_6c border-solid flex flex-col h-[72px] items-center justify-start p-1.5 rounded-[50%] w-[72px]">
        <div className="border border-light_blue-A700_87 border-solid flex flex-col h-[60px] items-center justify-start p-[5px] rounded-[50%] w-[60px]">
          <div className="bg-gradient  flex flex-col h-[50px] items-center justify-start p-1.5 rounded-[50%] w-[50px]">
            <Text className="md:text-3xl sm:text-[28px] text-[32px] text-right text-white-A700 tracking-[0.28px]">
              k
            </Text>
          </div>
        </div>
      </div>
      <div className="md:h-[178px] h-[51px] relative w-[90%] md:w-full">
        <HeaderSearch className="absolute flex md:flex-col flex-row md:gap-5 inset-[0] items-center justify-center m-auto w-full" />
        <Img
          className="absolute h-[51px] inset-y-[0] my-auto right-[29%] w-[50px]"
          src="images/img_folder.svg"
          alt="folder"
        />
      </div>
    </div>
  );
}

export default Header;
