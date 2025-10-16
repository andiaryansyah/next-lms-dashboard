import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label?: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  step?: string;
  textarea?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};
const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  step,
  textarea,
  placeholder,
  maxLength,
  rows,
  inputProps,
}: InputFieldProps) => {
  return (
    <div
      className={
        hidden
          ? "hidden"
          : `flex flex-col gap-2 w-full md:${textarea ? "w-full" : "w-1/4"}`
      }
    >
      <label className="text-xs text-gray-500">{label}</label>
      {textarea ? (
        <textarea
          {...register(name)}
          defaultValue={defaultValue}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          step={step}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
          {...inputProps}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}

      {error?.message && (
        <p className="text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
