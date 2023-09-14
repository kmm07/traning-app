import { Card } from "components";

function TrainingInfo({ activeUser }: any) {
  return <Card className="grid grid-cols-2 gap-10 p-4 mt-4">{activeUser}</Card>;
}

export default TrainingInfo;
