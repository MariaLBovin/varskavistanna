
import { IButtonProps } from './interfaces'
import './button.css';

const Button = ({variant, text, onClick}:IButtonProps) => {
  const buttonClass = `button ${variant === 'primary' ? 'button-primary' : 'button-secondary'}`;

  return (
    <button className={buttonClass} onClick={onClick}>{text}</button>
  )
}

export default Button