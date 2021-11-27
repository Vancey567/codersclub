import React from "react";
import styles from "./Button.module.css";

const Button = ({text, onClick}) => { // The prop name should be same with the name that is being given in the parent component.
  return (
      <button onClick={onClick} className={styles.button}>
        <span>{text}</span>
        <img className = {styles.arrow} src="/images/arrow-forward.png" alt="arrow" />
      </button>
  );
};

export default Button;
