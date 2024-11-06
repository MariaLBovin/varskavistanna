import { ChangeEvent, FormEvent, forwardRef, useState } from "react";
import { IInputProps } from "./interface";
import IconSearch from "../../assets/icons/IconSearch";
import "./input.css";
import Button from "../Button/Button";

const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ placeholder, onSubmit, readOnly, onClick, value, onChange, isEmpty},
    ref
  ) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (event.target.value) {
        setError(null);
      }
    };

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      const inputValue = (ref as React.RefObject<HTMLInputElement>).current?.value;

      if (inputValue && inputValue.trim() !== "") {
        onSubmit?.(inputValue);
        setError(null);
      } else {
        setError("Det här fältet är obligatoriskt");
      }
    };


    return (
      <div className='input'>
        <form onSubmit={handleSubmit} className='input-container'>
          <div className='input-container-wrapper'>
            <input
              ref={ref}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onClick={onClick}
              className='input-container-field'
              readOnly={readOnly}
            />
            <div className='input-container-button'>
              <Button
                variant={"icon"}
                icon={<IconSearch />}
                aria-label='Sök'
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              ></Button>
            </div>
          </div>
        </form>
        {isEmpty || error ? (
          <span className='input-error-message'>
            Detta fält är obligatoriskt
          </span>
        ) : null}
      </div>
    );
  }
);

export default Input;
