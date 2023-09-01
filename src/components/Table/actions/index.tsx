import { Img } from "components";

export interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

function TableActions({ onEdit, onDelete, className = "" }: Props) {
  return (
    <div className={`flex  gap-2 ${className}`}>
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
