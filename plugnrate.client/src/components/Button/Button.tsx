import { IButtonProps } from "./interfaces";
import "./button.css";

const Button = ({ variant, text, icon, onClick }: IButtonProps) => {
  const buttonClass = `button ${
    variant === "primary"
      ? "button-primary"
      : variant === "secondary"
      ? "button-secondary"
      : variant === "tertiary"
      ? "button-tertiary"
      : "button-icon"
  }`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {icon && <span className='button-icon-span'>{icon}</span>}
      {variant !== "icon" && text && <span className='button-text'>{text}</span>}
    </button>
  );
};

export default Button;
