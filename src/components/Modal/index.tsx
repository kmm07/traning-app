import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string | React.ReactNode;
  id?: string;

  modalOnDelete?: () => void;
  onSave?: () => void;
  className?: string;
};

function Modal({
  label,
  className,
  children,
  id = "my_modal",
  modalOnDelete,
  onSave,
}: Props) {
  return (
    <>
      {/* The button to open modal */}
      {label && (
        <label
          htmlFor={id}
          className={`${className} btn btn-sm !btn-primary !px-4 drawer-button rounded-full `}
        >
          {label}
        </label>
      )}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          {children}
          <div className="modal-action flex gap-4 justify-start">
            {/* if there is a button in form, it will close the modal */}
            <label
              htmlFor={id}
              className="btn !px-10 bg-gradient-to-tr from-sky-500 to-blue-600 text-white rounded-xl"
            >
              الغاء
            </label>
            {modalOnDelete && (
              <label
                htmlFor={id}
                onClick={modalOnDelete}
                className="btn !px-10 bg-gradient-to-tr from-sky-500 to-red-600 rounded-xl"
              >
                حذف
              </label>
            )}
            {onSave && (
              <label
                htmlFor={id}
                onClick={onSave}
                className="btn !px-10 bg-gradient-to-tr from-green-300 to-green-700 text-white rounded-xl"
              >
                حفظ
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export { Modal };
