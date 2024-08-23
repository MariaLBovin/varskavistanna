import { ChangeEvent, FormEvent, useState, forwardRef } from 'react';
import { IInputProps } from './interface';
import IconSearch from '../../assets/icons/IconSearch';
import './input.css';

const Input = forwardRef<HTMLInputElement, IInputProps>(({ placeholder, onSubmit }, ref) => {
    const [address, setAddress] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(address);
    };

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <div className="input-container-wrapper">
                <input
                    ref={ref}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className="input-container-field"
                />
                <button type="submit" className="input-container-button">
                    <IconSearch />
                </button>
            </div>
        </form>
    );
});

export default Input;
