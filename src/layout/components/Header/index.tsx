import { Text } from "components";
import HeaderSearch from "components/Header";

function Header() {
  return (
    <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between w-full p-5">
      <div className="bg-gradient  flex flex-col h-[50px] items-center justify-center p-1.5 rounded-[50%] w-[50px]">
        <Text className="md:text-3xl sm:text-[28px] text-[32px]">k</Text>
      </div>
      <div className="md:h-[178px] h-[51px] relative w-[90%] md:w-full">
        <HeaderSearch className="absolute flex md:flex-col flex-row md:gap-5 inset-[0] items-center justify-center m-auto w-full" />
      </div>
    </div>
  );
}

export default Header;
