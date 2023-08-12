import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string;
  id?: string;

  modalOnDelete?: () => void;
  modalOnSave?: () => void;
};

function Modal({
  label,
  children,
  id = "my_modal",
  modalOnDelete,
  modalOnSave,
}: Props) {
  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor={id}
        className="btn !btn-primary drawer-button rounded-full"
      >
        {label}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          {children}
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <label
              htmlFor={id}
              className="btn px-5 flex-1 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl"
            >
              الغاء
            </label>
            {modalOnDelete && (
              <label
                htmlFor={id}
                className="btn px-5 flex-1 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl"
              >
                حذف
              </label>
            )}
            {modalOnSave && (
              <label
                htmlFor={id}
                className="btn px-5 flex-1 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl"
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
