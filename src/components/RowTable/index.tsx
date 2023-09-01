import { Card, Text } from "components";

type RowTableProps = {
  data: { columns: string[]; header: string[] };

  title: string;
};

function RowTable({ data, title }: RowTableProps) {
  return (
    <Card className="flex gris flex-col gap-[13px]  mb-[15px] mt-3 p-4 w-full ">
      <Text size="3xl">{title}</Text>
      <div
        style={{
          gridTemplateColumns: `repeat(${
            data.header.length + 1
          }, minmax(0, 1fr))`,
        }}
        className={`grid text-center w-full`}
      >
        {data.header.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </div>
      <div className="bg-indigo-500 h-[3px]" />
      <div
        style={{
          gridTemplateColumns: `repeat(${
            data.header.length + 1
          }, minmax(0, 1fr))`,
        }}
        className={`grid text-center`}
      >
        {data.columns.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </div>
    </Card>
  );
}

export { RowTable };
