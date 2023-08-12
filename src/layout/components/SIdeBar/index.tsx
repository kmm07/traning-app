import { Img } from "components";
import NavItem from "./NavItem";
import { useLocation } from "react-router-dom";

function SidePar() {
  const { pathname } = useLocation();
  const naveItems = [
    {
      name: "الرسائل",
      link: "/messages",
      src: "images/img_mail11.png",
    },
    {
      name: "المستخدمين",
      link: "/users",
      src: "images/img_group30copy9.svg",
      isActive: true,
    },
    {
      name: "التغذية",
      //   src: "images/img_down1.png",
      link: "/nutrition",
      src: "images/img_fork3.png",
      isActive: false,
    },
    {
      name: "التمرين",
      link: "/exercises",
      src: "images/img_weight3.png",
    },
    {
      name: "الاشعارات",
      link: "/notifications",
      src: "images/img_notification3.png",
    },
    {
      name: "الكوبونات",
      link: "/coupons",
      src: "images/img_coupon3.png",
    },
    {
      name: "المسؤلين",
      link: "/admins",
      src: "images/img_setting1.png",
    },
  ];
  return (
    <div className="bg-gray-900_01 relative h-full py-24 border border-blue_gray-900_01 border-solid flex flex-col items-center justify-start md:px-5 rounded-bl-[25px] rounded-tl-[25px] shadow-bs">
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

      <button className="btn flex flex-col items-start justify-start  w-full ">
        <Img
          className="h-6 md:ml-[0] mr-[31px] rotate-180 w-[25px]"
          src="images/img_minimize.svg"
          alt="minimize"
        />
      </button>
    </div>
  );
}

export default SidePar;
