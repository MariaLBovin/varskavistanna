import { ChangeEvent, FormEvent, forwardRef } from 'react';
import { IInputProps } from './interface';
import IconSearch from '../../assets/icons/IconSearch';
import './input.css';
import Button from '../Button/Button';

const Input = forwardRef<HTMLInputElement, IInputProps>(({ placeholder, onSubmit, readOnly, onClick, value, onChange }, ref) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event); 
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    
    if(onSubmit){
      if(value) {
        
        onSubmit(value);
      }
       
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <div className="input-container-wrapper">
        <input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={handleChange} 
          onClick={onClick}
          className="input-container-field"
          readOnly={readOnly}
        />
        <div className='input-container-button'>
        <Button variant={'icon'} icon={<IconSearch/>} onClick={function (): void {
            throw new Error('Function not implemented.');
          } }></Button>
        </div>
        
        
      </div>
    </form>
  );
});

export default Input;
