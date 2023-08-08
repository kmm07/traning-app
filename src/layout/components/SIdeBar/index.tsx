import { Img } from "components";
import NavItem from "./NavItem";
import { useLocation } from "react-router-dom";

function SidePar() {
  const { pathname } = useLocation();
  const naveItems = [
    {
      name: "الرسائل",
      link: "/dashboard",
      src: "images/img_mail11.png",
    },
    {
      name: "المستخدمين",
      link: "/dashboard/users",
      src: "images/img_group30copy9.svg",
      isActive: true,
    },
    {
      name: "التغذية",
      //   src: "images/img_down1.png",
      link: "/dashboard/nutrition",
      src: "images/img_fork3.png",
      isActive: false,
    },
    {
      name: "التمرين",
      link: "/dashboard/exercises",
      src: "images/img_weight3.png",
    },
    {
      name: "الاشعارات",
      link: "/dashboard/notifications",
      src: "images/img_notification3.png",
    },
    {
      name: "الكوبونات",
      link: "/dashboard/coupons",
      src: "images/img_coupon3.png",
    },
    {
      name: "المسؤلين",
      link: "/dashboard/admins",
      src: "images/img_setting1.png",
    },
  ];
  return (
    <div className="bg-gray-900_01 relative h-full py-24 border border-blue_gray-900_01 border-solid flex flex-col items-center justify-start md:px-5 rounded-br-[25px] rounded-tr-[25px] shadow-bs">
      <div className="w-full flex flex-col h-full ">
        {naveItems.map((item) => (
          <NavItem
            name={item.name}
            src={item.src}
            link={item.link}
            isActive={pathname === item.link}
          />
        ))}
      </div>

      <div className="flex flex-col items-start justify-start  w-full ">
        <Img
          className="h-6 md:ml-[0] ml-[31px] w-[25px]"
          src="images/img_minimize.svg"
          alt="minimize"
        />
      </div>
    </div>
  );
}

export default SidePar;
