type Props = {
  name: string;
  type: string;
  placeholder: string;
  props: any;
  inputClass: string;
  children: React.ReactNode;
};

function Input({
  name,
  type,
  placeholder,
  props,
  inputClass,
  children,
}: Props) {
  return (
    <fieldset className="fieldset">
      <label className="label" htmlFor={name}>
        {name}
      </label>
      <input
        type={type}
        id={name}
        {...props}
        className={inputClass}
        placeholder={placeholder}
      />
      {children}
    </fieldset>
  );
}

export default Input;
