import { SelectProps } from "./interface";

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select an option' }) => {
    return (
      <div className="select-container">
        <select value={value} onChange={onChange} className="select-input">
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default Select;