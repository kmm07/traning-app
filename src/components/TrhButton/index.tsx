import { Button } from "components";

function TrhButton({
  onDelete,
  id = "my-drawer",
}: {
  onDelete: () => void;
  id?: string;
}) {
  return (
    <div className="flex justify-between mx-10">
      <Button primary type="submit" size="large" rounded="full">
        حفظ
      </Button>
      <Button
        size="large"
        rounded="full"
        primary
        onClick={() => document.getElementById(id)?.click()}
      >
        الغاء
      </Button>
      <Button size="large" rounded="full" danger onClick={onDelete}>
        خذف
      </Button>
    </div>
  );
}

export { TrhButton };
