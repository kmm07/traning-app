import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-[300px]">
      <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
    </div>
  );
};

export default Loading;