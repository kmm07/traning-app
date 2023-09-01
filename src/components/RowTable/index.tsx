import { Card, Text } from "components";

type RowTableProps = {
  data: { columns: string[]; header: string[] };

  title: string;
};

function RowTable({ data, title }: RowTableProps) {
  const length = data.header.length + 1;
  return (
    <Card className="flex flex-col gap-[13px]  mb-[15px] mt-3 p-4 w-full ">
      <Text size="3xl">{title}</Text>
      <div className={`grid grid-cols-${7} text-start w-full`}>
        {data.header.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </div>
      <div className="bg-indigo-500 h-[3px]" />
      <div className={`grid grid-cols-${7} w-full`}>
        {data.columns.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </div>
    </Card>
  );
}

export { RowTable };
