import DatePicker, {
  CalendarProps,
  DateObject,
  DatePickerProps,
} from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { FieldProps, Field } from "formik";
import React, { FC, useEffect, useRef, useState } from "react";
import moment from "moment";
import gregorian_en from "react-date-object/locales/gregorian_en";

const DateInput: FC<
  CalendarProps &
    DatePickerProps & {
      name: string;
      label?: string;
      isForm?: boolean;
    }
> = ({
  name,
  label,
  isForm = true,
  className = "",
  required,
  ...props
}: CalendarProps &
  DatePickerProps & {
    label?: string;
    name: string;
    isForm?: boolean;
  }) => {
  const ref: React.MutableRefObject<any> = useRef(null);

  return isForm ? (
    <Field name={name}>
      {({
        field,
        form: { errors, touched, setFieldValue, values },
      }: FieldProps) => {
        return (
          <div className="w-full relative">
            {label !== undefined && (
              <label
                htmlFor={name}
                className={
                  "text-start block mb-2 text-sm  w-full !text-dark-200 dark:!text-white font-normal"
                }
              >
                {label}{" "}
                {required === true && <span className="text-red-500"> *</span>}
              </label>
            )}
            <DatePicker
              multiple={false}
              ref={ref}
              locale={gregorian_en}
              render={
                <CustomCalendarButton
                  {...props}
                  date={values[name]}
                  placeholder={props?.placeholder}
                  onClick={() => {
                    ref?.current?.openCalendar();
                  }}
                />
              }
              containerClassName={`h-10 w-full ${
                props.disabled === true ? "opacity-50 cursor-not-allowed" : ""
              } rounded-md border-dark-300  ${className}`}
              inputClass={`${
                Boolean(touched[name]) && Boolean(errors[name])
                  ? "border-error-100"
                  : ""
              } bg-transparent h-10 w-full px-2`}
              className={`${
                Boolean(touched[name]) && Boolean(errors[name])
                  ? "border-error-100"
                  : ""
              } w-full `}
              {...props}
              {...field}
              name={name}
              onChange={(dateObject: DateObject) => {
                if (props?.onChange !== undefined)
                  props?.onChange?.(dateObject);
                else {
                  setFieldValue(name, dateObject);
                }
              }}
            />
            {Boolean(touched[name]) && Boolean(errors[name]) && (
              <div className="text-error-100 text-sm text-start">
                <>{errors[name]}</>
              </div>
            )}
          </div>
        );
      }}
    </Field>
  ) : (
    <div className="w-full relative">
      {label !== undefined && (
        <label
          htmlFor={name}
          className={
            "text-start block mb-2 text-sm  w-full !text-dark-200 dark:!text-white font-normal"
          }
        >
          {label}{" "}
          {required === true && <span className="text-red-500"> *</span>}
        </label>
      )}
      <DatePicker
        multiple={false}
        ref={ref}
        render={
          <CustomCalendarButton
            {...props}
            className={className}
            date={props.value as string}
            placeholder={props?.placeholder}
            onClick={() => {
              ref?.current?.openCalendar();
            }}
          />
        }
        containerClassName={`h-10 w-full  rounded-md border-dark-300 ${
          props.disabled === true ? "opacity-60 cursor-not-allowed" : ""
        }  ${className}`}
        inputClass={"bg-transparent h-10 w-full px-2"}
        className={"h-10 w-full "}
        {...props}
        name={name}
      />
    </div>
  );
};
export default DateInput;

function CustomCalendarButton({
  date,
  onClick,
  placeholder,
  className = "",
  format = "DD/MM/YYYY",
}: {
  placeholder?: string;
  date: string;
  onClick: () => void;
  className?: string;
  format?: string;
}) {
  const [ssr, setSSR] = useState(true);
  useEffect(() => {
    setSSR(false);
  }, []);

  const splitDate = (index: number) => date?.toString().split(",")[index];
  const showDate = (index: number) => {
    const formattedDate = moment(splitDate(index))
      .locale("en-GB")
      .format(format);
    if (formattedDate === "Invalid date") {
      return moment(splitDate(index), format).locale("en-GB").format(format);
    }
    return formattedDate;
  };

  return (
    <div
      className={`border h-10 w-full dark:bg-transparent border-dark-300 rounded-md flex items-center ${className}`}
      onClick={onClick}
    >
      {/* <Calendar className="stroke-dark-300 mx-2" /> */}
      {!ssr && (
        <span className="flex items-center h-full text-dark-100 dark:text-white">
          {showDate(0) ?? <span className="text-dark-300">{placeholder}</span>}
          {splitDate(1) !== undefined && showDate(1) !== "Invalid date"
            ? ` -  ${showDate(1)}`
            : null}
        </span>
      )}
    </div>
  );
}
