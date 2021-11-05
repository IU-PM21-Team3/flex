import React from "react";

type CheckBoxProps = {
  checked: boolean,
  label: string
}

const SimpleCheckBox = ({ checked, label }: CheckBoxProps) => {
  return (
    <>
      <input
        type="checkbox"
        checked={checked}
      />
      <label>{label}</label>
    </>
  );
};

export default SimpleCheckBox;
