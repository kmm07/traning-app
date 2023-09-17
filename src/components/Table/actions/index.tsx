import { Img } from "components";

export interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  className?: string;
}

function TableActions({ onEdit, onDelete, onAdd, className = "" }: Props) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {onAdd !== undefined ? (
        <span className="cursor-pointer flex-1" onClick={onAdd}>
          إضافة بديل
        </span>
      ) : null}

      {onEdit !== undefined ? (
        <span className="cursor-pointer w-4" onClick={onEdit}>
          <Img src="/images/edit.svg" />
        </span>
      ) : null}

      {onDelete !== undefined ? (
        <span className="cursor-pointer w-4" onClick={onDelete}>
          <Img src="/images/trash.svg" />
        </span>
      ) : null}
    </div>
  );
}

export default TableActions;
