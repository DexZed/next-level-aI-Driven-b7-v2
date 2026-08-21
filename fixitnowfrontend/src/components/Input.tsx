import { cn } from "@/lib/tailwindMerge";

type Props = {
  name: string;
  type: string;
  placeholder?: string;
  props: any;
  inputClass?: string;
  children: React.ReactNode;
  fieldsetStyle?: string;
};

function Input({
  name,
  type,
  placeholder,
  props,
  inputClass,
  children,
  fieldsetStyle,
}: Props) {
  return (
    <fieldset className={cn("fieldset", fieldsetStyle)}>
      <label className="label" htmlFor={name}>
        {name}
      </label>
      <input
        type={type}
        id={name}
        {...props}
        className={cn("input input-bordered input-info", inputClass)}
        placeholder={placeholder}
      />
      {children}
    </fieldset>
  );
}

export default Input;
