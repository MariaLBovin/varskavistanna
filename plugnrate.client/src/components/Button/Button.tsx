
import { IButtonProps } from './interfaces'
import './button.css';
import IconX from '../../assets/icons/IconX';

const Button = ({variant, text, onClick}:IButtonProps) => {
  const buttonClass = `button ${
    variant === 'primary' 
      ? 'button-primary' 
      : variant === 'secondary' 
        ? 'button-secondary' 
        : 'button-tertiary'
  }`;
  

  return (
    <button className={buttonClass} onClick={onClick}>
      {variant === 'tertiary' && <IconX/>}
      {text}</button>
  )
}

export default Button