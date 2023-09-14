import { SettingCard, Table } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import AddCard from "shared/AddCard";
import SideBar from "./components/SideBar";
import AddExercise from "./components/AddExercise";
import { useQueryClient } from "react-query";
import { useDeleteQuery } from "hooks/useQueryHooks";
import { toast } from "react-toastify";
function ExercisesGym() {
  const [level, setLevel] = useState(1);

  const cardData = [
    {
      label: "مبتدئ",
      id: "junior",
    },
    {
      label: "متوسط",
      id: "mid",
    },
    {
      label: "متقدم",
      id: "senior",
    },
  ];

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();
  const daysNum = 1;
  const home = 1;
  const onDelete = async (id: number) => {
    try {
      await mutateAsync(`/training-categories/${id}`);

      await queryClient.invalidateQueries(
        `/training-categories?lvl=${level}&gender=male&days_num=${
          daysNum as any
        }&home=${home}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEdit = () => {
    document.getElementById("add-new-exercise-category")?.click();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "التمرين",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <span className="indicator-item badge-sm h-6 rounded-full badge badge-warning">
                  2
                </span>
                <div className="w-12 h-12 rounded-full">
                  <img src="/images/img_rectangle347.png" />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  const onSave = () => {
    console.log("save");
  };
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {cardData.map((item, index) => (
          <SettingCard
            onDelete={onDelete}
            onEdit={onEdit}
            id={item.id}
            key={index}
            label={item.label}
            active={level === (item.id as any)}
            onClick={() => setLevel(item.id as any)}
          />
        ))}
        <AddCard
          modalContent={<>dd</>}
          onSave={onSave}
          modalLabel="اضافة مستوى"
        />
      </div>

      <Table
        data={[]}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة تمرين"
        modalContent={<AddExercise />}
      />

      <Drawer>
        <SideBar />
      </Drawer>
    </div>
  );
}

export default ExercisesGym;
