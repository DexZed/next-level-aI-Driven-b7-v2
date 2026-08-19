import React from "react";

type Props = {
  name: string;
  props: any;
  selectClass: string;
  options: options[];
  children: React.ReactNode;
};
type options = {
  value: string;
  label: string;
};
function Select({ name, props, selectClass, children, options }: Props) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{name}</legend>
      <select id={name} {...props} className={selectClass}>
        {options.map((o) => (
          <option value={o.value}>{o.label}</option>
        ))}
      </select>
      {children}
    </fieldset>
  );
}

export default Select;
