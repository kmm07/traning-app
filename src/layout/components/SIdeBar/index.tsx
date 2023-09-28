import { Img } from "components";
import NavItem from "./NavItem";
import { useLocation, useNavigate } from "react-router-dom";
import CollapseTree from "./collapse-tree";
import { useAppDispatch } from "hooks/useRedux";
import { logOut } from "redux/slices/auth";

function SidePar() {
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const { pathname } = useLocation();
  const naveItems = [
    {
      name: "الرسائل",
      link: "/dashboard",
      src: "/images/img_mail11.png",
    },
    {
      name: "المستخدمين",
      link: "/users",
      src: "/images/img_group30copy9.svg",
    },
    {
      name: "الإشتراكات",
      link: "/subscriptions",
      src: "/images/img_group30copy9.svg",
    },
    {
      name: "التغذية",
      src: "/images/img_fork3.png",
      link: "/nutrition",
      subMenu: [
        {
          name: "الوصفات",
          link: "/nutrition/descriptions",
        },
        {
          name: "المكونات",
          link: "/nutrition/ingredients",
        },
      ],
    },
    {
      name: "التمرين",
      link: "/exercises",
      src: "/images/img_weight3.png",
      subMenu: [
        {
          name: "جدول جيم الرجال",
          link: "/exercises/table-men",
        },
        {
          name: "جدول جيم النساء",
          link: "/exercises/table-women",
        },
        {
          name: "جدول المنزل رجال",
          link: "/exercises/table-home-men",
        },
        {
          name: "جدول المنزل نساء",
          link: "/exercises/table-home-women",
        },
        {
          name: "الكارديو",
          link: "/exercises/cardio",
        },
        {
          name: "تمارين الجيم",
          link: "/exercises/exercises-gym",
        },
        {
          name: "تمارين المنزل",
          link: "/exercises/exercises-home",
        },
      ],
    },
    {
      name: "الاشعارات",
      link: "/notifications",
      src: "/images/img_notification3.png",
    },
    {
      name: "الكوبونات",
      link: "/coupones",
      src: "/images/img_coupon3.png",
    },
    {
      name: "المسؤلين",
      link: "/admins",
      src: "/images/img_setting1.png",
    },
    {
      name: "رسائل التواصل",
      link: "/contacts",
      src: "/images/img_mail11.png",
    },
  ];
  return (
    <div className="bg-gray-900_01 relative h-full py-24 border border-blue_gray-900_01 border-solid flex flex-col items-center justify-start md:px-5 rounded-bl-[25px] rounded-tl-[25px] shadow-bs">
      <div className="w-full flex flex-col h-full ">
        {naveItems?.map((props) =>
          !props?.subMenu ? (
            <NavItem
              name={props.name}
              src={props.src}
              link={props.link}
              isActive={pathname === props.link}
            />
          ) : (
            <CollapseTree
              key={props.name}
              isActive={"/" + pathname.split("/")[1] === props.link}
              name={props.name}
              src={props.src}
              subMenu={props.subMenu}
            />
          )
        )}
      </div>

      <button
        onClick={() => {
          dispatch(logOut());

          push("/");
        }}
        className="btn flex flex-col items-start justify-start w-full "
      >
        <Img
          className="h-24 md:ml-[0] mr-[31px] rotate-180 w-[25px]"
          src="/images/img_minimize.svg"
          alt="minimize"
        />
      </button>
    </div>
  );
}

export default SidePar;
