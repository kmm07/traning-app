import ReactSelect, { Props } from "react-select";
import { ErrorMessage, Field, FieldProps } from "formik";
import ReactSelectTheme from "./ReactSelectTheme";

export interface Options {
  value: string | number | null;
  label: string | number;
}

interface SelectProps extends Props {
  options: Options[];
  isForm?: boolean;
  label?: string;
  readOnly?: boolean;
}

function Select({
  options,
  className = "",
  label,
  isForm = true,
  readOnly = false,
  name = "",
  required,
  ...props
}: SelectProps & Partial<FieldProps>) {
  return isForm ? (
    <Field name="department">
      {({
        field,
        form: { errors, touched, setFieldValue, values },
      }: FieldProps) => {
        return (
          <div className="w-full flex flex-col">
            {Boolean(label) && (
              <label
                htmlFor={name}
                className={" text-start block mb-2 text-sm  w-full !text-white"}
              >
                {label}{" "}
                {required === true && <span className="text-red-500"> *</span>}
              </label>
            )}
            <ReactSelect
              required={required}
              id="long-value-select"
              instanceId="long-value-select"
              options={options}
              styles={ReactSelectTheme()}
              {...field}
              value={options?.filter(function (option) {
                return option.value === values[name];
              })}
              name={name}
              classNamePrefix={`select2-selection !text-white ${
                props.isDisabled === true
                  ? "!opacity-80 !cursor-not-allowed"
                  : ""
              }
               ${
                 Boolean(touched[name]) && Boolean(errors[name])
                   ? "!border-error-100"
                   : ""
               } `}
              {...props}
              className={`h-10 w-full ${className} !text-white `}
              onChange={(selectedOption: any) => {
                if (props?.onChange == null) {
                  setFieldValue(name, selectedOption.value);
                }
              }}
            />
            <div className="text-red-500 text-sm text-start">
              <ErrorMessage name={name} />
            </div>
          </div>
        );
      }}
    </Field>
  ) : (
    <div
      className={`w-full flex flex-col ${
        props.isDisabled === true ? "!opacity-80 !cursor-not-allowed" : ""
      }`}
    >
      {Boolean(label) && (
        <label
          htmlFor={name}
          className={
            " text-start block mb-2 text-sm  w-full !text-white font-normal"
          }
        >
          {label}
        </label>
      )}
      <ReactSelect
        id="long-value-select"
        instanceId="long-value-select"
        options={options}
        styles={ReactSelectTheme()}
        {...props}
        classNamePrefix={`select2-selection !text-white ${
          props.isDisabled === true ? "!opacity-80 " : ""
        }
         `}
        className={`h-10 w-full ${className}!text-white `}
      />
    </div>
  );
}

export { Select };
