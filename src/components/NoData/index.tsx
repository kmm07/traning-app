import { Text } from "components";

interface Props {
  className?: string;
}
const NoDataFounded = ({ className = "" }: Props) => {
  return (
    <div
      className={`grid place-items-center w-full h-full text-center items-center gap-5 ${className}`}
    >
      <div className="flex flex-col items-center">
        <Text as="h1" className="!font-bold !text-xl">
          عفوا لا يوجد بينات متاحة لعرضها
        </Text>

        {/* <Image
          src="/images/empty.png"
          alt="image"
          width={1000}
          height={1000}
          className="w-[400px] h-[350px]"
        /> */}
      </div>
    </div>
  );
};
export default NoDataFounded;
