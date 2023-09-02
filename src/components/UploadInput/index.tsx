import React, { useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { setImageDelete } from "redux/slices/imageDelete";
import { Img, Text } from "components";

interface Props {
  className?: string;
  name: string;
  video?: boolean;
  label?: string;
}

function UploadInput({ className = "", name, video, label }: Props) {
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
    <div className={`relative   flex flex-col items-center  ${className}`}>
      <div className="gap-4 w-full max-w-full flex items-center">
        <Text size="3xl">{label}</Text>
        {values[name] === "" && (
          <div className="flex  flex-col gap-4 w-full h-full">
            <button
              className="border rounded-lg border-dashed px-10 overflow-hidden border-deep_purple-A200 flex justify-center items-center w-full flex-1"
              onClick={uploadFun}
              type="button"
            >
              <div className="flex justify-center flex-col items-center gap-3">
                <div className="dark:text-white text-dark-100">
                  <p>
                    <span className="text-deep_purple-A200">ارفع</span>
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
        <div className="relative">
          {values[name] !== "" &&
            (video ? (
              <video
                src={image}
                className={`w-20 ${values[name] === "" ? "hidden" : "block"}`}
              />
            ) : (
              <Img
                src={image}
                className={`w-24 h-24 ${
                  values[name] === "" ? "hidden" : "block"
                }`}
              />
            ))}
          <button
            type="button"
            className={
              values[name] === "" ? "hidden" : "block absolute bottom-0 left-0"
            }
            onClick={deleteImg}
          >
            <Img src="/images/trash.svg" className="w-4" alt="delete" />
          </button>
        </div>
      </div>
      {Boolean(touched[name]) && Boolean(errors[name]) && (
        <div className="text-error-100 text-sm text-start">
          <>{errors[name]}</>
        </div>
      )}
    </div>
  );
}

export { UploadInput };
