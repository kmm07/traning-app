import React, { useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { setImageDelete } from "redux/slices/imageDelete";
import { Img } from "components";

interface Props {
  className?: string;
  name: string;
}

function UploadImg({ className = "", name }: Props) {
  const { setFieldValue, values, errors, touched }: any = useFormikContext();

  const [image, setImage] = useState<string>("");

  const dispatch = useDispatch();

  const filesInput = useRef<HTMLInputElement>(null);

  const deleteImg = () => {
    dispatch(setImageDelete(true));
    setFieldValue(name, "");
  };

  const changeHandler = (e: { target: { files: any } }) => {
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
    setFieldValue(name, e.target.files[0]);
  };

  const uploadFun = () => {
    filesInput.current?.click();
  };

  useEffect(() => {
    if (values[name] === "" || values[name] === null) setImage("");
    else {
      if (typeof values[name] === "string") setImage(values[name]);
    }
  }, [values[name]]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden flex flex-col items-center  ${className}`}
    >
      <div className="h-[200px] sm:w-60 w-full max-w-full">
        {values[name] === "" && (
          <div className="flex flex-col gap-4 w-full h-full">
            <button
              className="!border-[1px] border-dashed border-primary-100 flex justify-center items-center w-full flex-1"
              onClick={uploadFun}
              type="button"
            >
              <div className="flex justify-center flex-col items-center gap-3">
                <Img
                  src="images/img-upload.svg"
                  className="w-20 h-20 object-contain"
                  alt="upload"
                />
                <div className="dark:text-white text-dark-100">
                  <p>
                    اسحب صورك أو
                    <span className="text-primary-100">تصفح</span>
                  </p>
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                ref={filesInput}
                name={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  changeHandler(e)
                }
              />
            </button>
          </div>
        )}
        {values[name] !== "" && (
          <Img
            src={image}
            className={`w-full h-full ${
              values[name] === "" ? "hidden" : "block"
            }`}
          />
        )}
        <button
          type="button"
          className={
            values[name] === "" ? "hidden" : "block absolute top-3 right-3"
          }
          onClick={deleteImg}
        >
          <Img src="images/trash.svg" alt="delete" />
        </button>
      </div>
      {Boolean(touched[name]) && Boolean(errors[name]) && (
        <div className="text-error-100 text-sm text-start">
          <>{errors[name]}</>
        </div>
      )}
    </div>
  );
}
export { UploadImg };
