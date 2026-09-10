import React, { useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { setImageDelete } from "redux/slices/imageDelete";
import { Img } from "components";

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

  /*
   * 🔴 **لافتةُ الرفع كانت `size="3xl"`** — أي بحجم عنوانِ صفحةٍ بجانب مربّعِ
   *    رفعٍ صغير، فتقرأ العينُ اللافتةَ قبل أيّ شيءٍ في النموذج. صارت لافتةَ
   *    حقلٍ كبقيّة الحقول.
   *
   * 🔴 **ونصُّ الزرّ كان `text-dark-100`** — من عائلة الأصناف الصامتة التي
   *    صارت أسودَ على أسودَ لمّا عُرِّفت. ومعه كلمةُ «ارفع» وحدها بلا بيانٍ
   *    لما يُرفع.
   */
  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <div className="gap-4 w-full max-w-full flex items-center flex-wrap">
        {Boolean(label) && (
          <span className="text-sm font-medium text-content-muted">
            {label}
          </span>
        )}
        {values[name] === "" && (
          <div className="flex  flex-col gap-4 w-full h-full">
            <button
              className="group border rounded-field border-dashed border-line-strong hover:border-brand-400 hover:bg-brand-400/[0.04] px-6 py-5 overflow-hidden flex justify-center items-center w-full flex-1 transition-colors"
              onClick={uploadFun}
              type="button"
            >
              <div className="flex justify-center flex-col items-center gap-2">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-content-faint group-hover:text-brand-400 transition-colors"
                  aria-hidden="true"
                >
                  <path d="M12 16V4" />
                  <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
                  <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
                </svg>
                <span className="text-sm font-semibold text-content group-hover:text-brand-400 transition-colors">
                  {video === true ? "ارفع مقطعاً" : "ارفع صورة"}
                </span>
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
              <a href={image} target="_blank">
                <Img
                  src={image}
                  className={`w-[150px] h-[130px] object-cover rounded-field border border-line ${
                    values[name] === "" ? "hidden" : "block"
                  }`}
                />
              </a>
            ))}
          <button
            type="button"
            aria-label="حذف الملف"
            title="حذف الملف"
            className={
              values[name] === ""
                ? "hidden"
                : "grid place-items-center absolute bottom-2 left-2 h-8 w-8 rounded-lg bg-ink-950/80 border border-line hover:bg-danger-500 hover:border-danger-500 transition-colors"
            }
            onClick={deleteImg}
          >
            <Img src="/images/trash.svg" className="w-4" alt="" />
          </button>
        </div>
      </div>
      {Boolean(touched[name]) && Boolean(errors[name]) && (
        <div className="text-danger-400 text-xs text-start">
          <>{errors[name]}</>
        </div>
      )}
    </div>
  );
}

export { UploadInput };
