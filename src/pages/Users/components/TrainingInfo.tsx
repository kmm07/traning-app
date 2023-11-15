import { Button, Card, Select, Text } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";

const weekDaysNums = [
  { day_num: "1", day_name: "السبت" },
  { day_num: "2", day_name: "الأحد" },
  { day_num: "3", day_name: "الإثنين" },
  { day_num: "4", day_name: "الثلاثاء" },
  { day_num: "5", day_name: "الأربعاء" },
  { day_num: "6", day_name: "الخميس" },
  { day_num: "7", day_name: "الجمعة" },
];

function TrainingInfo() {
  const { values, setFieldValue } = useFormikContext<any>();

  const [trainingData, setTrainigData] = useState<any>({
    selectValue: { label: "", value: { gender: "", lvl: "", home: "" } },
    daysNum: { label: "", value: "" },
  });

  const isNoValidToGetData = Object.values(trainingData).some((value) =>
    ["", undefined, null].includes(value as string)
  );

  const url = `/training-categories?lvl=${trainingData?.selectValue?.value?.lvl}&gender=${trainingData?.selectValue?.value?.gender}&days_num=${trainingData?.daysNum?.value}&home=${trainingData?.selectValue?.value?.home}`;

  const { data: trainingCategories = [] }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data?.map((category: any) => ({
          label: category.name,
          value: category?.id,
        })),
      enabled: !isNoValidToGetData,
    }
  );

  const onAddRestDay = (day_num: string) => {
    if (values.rest_days?.includes(day_num)) {
      const filteredArray = values.rest_days.filter(
        (day: any) => day !== day_num
      );

      setFieldValue("rest_days", filteredArray);
    } else {
      if (values.rest_days.length + Number(trainingData.daysNum.value) >= 7) {
        return toast.error(
          "يجب ان يكون مجموع أيام الراحة وأيام التدريب مساوي لعدد أيام الإسبوع"
        );
      }
      setFieldValue("rest_days", [...values.rest_days, day_num]);
    }
  };

  // get level options =================>
  const trainingPeriods = [
    { label: "أقل من 3 شهور", value: "less_3" },
    { label: "من 3 شهور إلي 6 شهور", value: "between_3_6" },
    { label: "أكثر من 12 شهر", value: "more_12" },
  ];

  const getTrainingPeriod = () => {
    return trainingPeriods.find(
      (period) => period.value === values.training_period
    );
  };

  // get level options =================>
  const weekDaysOptions = [
    { label: "2 أيام في السبوع", value: "2" },
    { label: "3 أيام في السبوع", value: "3" },
    { label: "4 أيام في السبوع", value: "4" },
    { label: "5 أيام في السبوع", value: "5" },
    { label: "6 أيام في السبوع", value: "6" },
  ];

  // get level options =================>
  const levelOptions = [
    {
      label: "في الجيم / رجال /مبتدئ",
      value: { home: 0, gender: "male", lvl: "junior" },
    },
    {
      label: "في الجيم / رجال /متوسط",
      value: { home: 0, gender: "male", lvl: "mid" },
    },
    {
      label: "في الجيم / رجال /متقدم",
      value: { home: 0, gender: "male", lvl: "senior" },
    },
    {
      label: "في الجيم / نساء /مبتدئ",
      value: { home: 0, gender: "female", lvl: "junior" },
    },
    {
      label: "في الجيم / نساء /متوسط",
      value: { home: 0, gender: "female", lvl: "mid" },
    },
    {
      label: "في الجيم / نساء /متقدم",
      value: { home: 0, gender: "female", lvl: "senior" },
    },
    {
      label: "في المنزل / رجال /مبتدئ",
      value: { home: 1, gender: "male", lvl: "junior" },
    },
    {
      label: "في المنزل / رجال /متوسط",
      value: { home: 1, gender: "male", lvl: "mid" },
    },
    {
      label: "في المنزل / رجال /متقدم",
      value: { home: 1, gender: "male", lvl: "senior" },
    },
    {
      label: "في المنزل / نساء /مبتدئ",
      value: { home: 1, gender: "female", lvl: "junior" },
    },
    {
      label: "في المنزل / نساء /متوسط",
      value: { home: 1, gender: "female", lvl: "mid" },
    },
    {
      label: "في المنزل / نساء /متقدم",
      value: { home: 1, gender: "female", lvl: "senior" },
    },
  ];

  useEffect(() => {
    const initialLevelObject = {
      home: values.training_place === "gym" ? 0 : 1,
      gender: values.type,
      lvl: values.lvl,
    };

    const initialLevel = levelOptions.find(
      (level) =>
        level.value.home === initialLevelObject.home &&
        level.value.gender === initialLevelObject.gender &&
        level.value.lvl === initialLevelObject.lvl
    );

    const initialDays = weekDaysOptions.find(
      (day) => Number(day.value) === values.training_days
    );

    setTrainigData({ selectValue: initialLevel, daysNum: initialDays });
  }, [values.training_place, values.type, values.lvl, values.training_days]);

  return (
    <Card className="grid grid-cols-3 gap-10 p-4 mt-4">
      <div className="flex flex-col gap-4">
        <Text as="h2">المعلومات التدريبية:</Text>
        <Text as="h2">المستوي</Text>
        <Card className="p-3">
          <Select
            isForm={false}
            name=""
            options={levelOptions as any}
            value={trainingData?.selectValue}
            onChange={(e: any) => {
              setTrainigData({
                ...trainingData,
                selectValue: e.value,
              });
              setFieldValue("type", e.value.gender);
              setFieldValue("lvl", e.value.lvl);
              setFieldValue(
                "training_place",
                e.value.home === 1 ? "home" : "gym"
              );
            }}
          />
        </Card>

        <Text as="h2">كم يوم في الإسبوع</Text>
        <Card className="p-3">
          <Select
            isForm={false}
            name=""
            options={weekDaysOptions}
            value={trainingData?.daysNum}
            onChange={(e: any) => {
              if (values.rest_days?.length + Number(e?.value) > 7) {
                return toast.error(
                  "يجب ان يكون مجموع أيام الراحة وأيام التدريب مساوي لعدد أيام الإسبوع"
                );
              }

              setTrainigData({
                ...trainingData,
                daysNum: e,
              });

              setFieldValue("weekly_training", Number(e.value));
            }}
          />
        </Card>

        <Text as="h2">نوع الجدول التدريبي</Text>
        <Card className="p-3">
          <Select
            name="training_category_id"
            options={trainingCategories ?? []}
            value={values.training_category_id}
            isForm={false}
            onChange={(e) => setFieldValue("training_category_id", e)}
          />
        </Card>
        <div className="hidden">
          <Text as="h2">نوع الجدول التدريبي</Text>
          <Card className="p-3">
            <Select
              name="training_category_id"
              options={trainingCategories ?? []}
              value={values.training_category_id}
              isForm={false}
              onChange={(e) => setFieldValue("training_category_id", e)}
            />
          </Card>
        </div>
      </div>

      <div>
        <Text as="h5" className="mb-4">
          الإسبوع الحالي:
        </Text>
        {values.training_week_days?.map((weekDay: any, index: number) => (
          <Card
            key={index}
            className="p-2 flex items-center justify-between mb-2"
          >
            <Text as="h5">
              {isNaN(weekDay.day_num)
                ? weekDay.day_num
                : `اليوم رقم ${index + 1}`}
            </Text>
            <img
              className="h-5"
              src={
                weekDay.done
                  ? "/images/img_checkmark.svg"
                  : "/images/img_clock5.png"
              }
              alt="image"
            />
          </Card>
        ))}

        <Card className="p-4">
          <Text as="h5">منذ متي يتمرن:</Text>

          {/* <Text as="h5" className="!text-center font-bold">
            {getTrainingPeriod()?.label}
          </Text> */}

          <Select
            name="training_period"
            options={trainingPeriods}
            defaultValue={getTrainingPeriod()}
          />
        </Card>
      </div>

      <div>
        <Text as="h2">أيام الراحة</Text>
        <div className="flex justify-center flex-wrap gap-4 mt-4 border-b-[3px] border-primary pb-4">
          {weekDaysNums.map((weekDay) => (
            <Button
              key={weekDay.day_name}
              secondaryBorder={values.rest_days?.includes(weekDay.day_num)}
              onClick={() => onAddRestDay(weekDay.day_num)}
              className="w-[45%]"
            >
              {weekDay.day_name}
            </Button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <Text as="h5">تقدم برنامج التدريب</Text>

          <div
            className={"radial-progress text-[#E80054]"}
            style={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              {
                "--value":
                  (values.program_progress_done / values.program_progress_all) *
                  100,
              } as any
            }
          >
            <Text as="h5">
              {values.program_progress_done} / {values.program_progress_all}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TrainingInfo;
