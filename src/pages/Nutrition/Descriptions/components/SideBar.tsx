import { RowTable } from "components/RowTable";

function SideBar() {
  return (
    <>
      <RowTable
        data={{
          columns: ["1", "2", "3", "4", "5", "6", "7"],
          header: [
            "السعرات",
            "البروتين",
            "الكاربوهيدرات",
            "الدهون",
            "الدهون المتحولة",
            "السكريات",
            "الحجم",
          ],
        }}
        title="القيمة الغذائية"
      />
    </>
  );
}

export default SideBar;
