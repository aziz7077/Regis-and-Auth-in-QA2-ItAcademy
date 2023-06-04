import React from "react";
import s from "./Input.module.scss";

const BasicInput = ({ title, ...props }) => {
  return (
    <div>
      <p className={s.pishka}>{title}</p>
      <input className={s.input} {...props} />
    </div>
  );
};

export default BasicInput;
