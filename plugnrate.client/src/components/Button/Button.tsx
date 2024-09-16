import { IButtonProps } from "./interfaces";
import "./button.css";

const Button = ({ variant, text, icon, onClick }: IButtonProps) => {
  const buttonClass = `button ${
    variant === "primary"
      ? "button-primary"
      : variant === "secondary"
      ? "button-secondary"
      : "button-tertiary"
  }`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {icon && <span className='button-icon'>{icon}</span>}
      {text && <span className='button-text'>{text}</span>}
    </button>
  );
};

export default Button;
