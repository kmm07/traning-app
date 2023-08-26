import { Card, Img, Modal, Text } from "components";

type Props = {
  modalLabel: string;
  onSave: () => void;
  modalContent: React.ReactNode;
};

function AddCard({ onSave, modalContent }: Props) {
  return (
    <>
      <Card className={`w-[180px] `}>
        <label
          htmlFor="add-new"
          className={`flex flex-col justify-between items-center relative p-4 cursor-pointer `}
        >
          <Img className="w-16 absolute top-4 left-0" src="/images/plus.svg" />
          <Text size="3xl" className="mt-4">
            اضافة
          </Text>
        </label>
      </Card>
      <Modal onSave={onSave} id="add-new">
        {modalContent}
      </Modal>
    </>
  );
}

export default AddCard;
