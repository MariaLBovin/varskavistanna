import { useState } from "react";
import { ISliderProps } from "./interface"
import './slider.css'

const Slider = ({label, descriptions, onValueChange}: ISliderProps) => {
    const [selectedValue, setSelectedValue] = useState<string>(descriptions[0]);

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
        onValueChange(value);
    };
  return (
    <>
        <div className="slider-container" >
            <h2 className="slider-header">{label}</h2>
            <ul className="slider-bar-wrapper">
                {descriptions.map((desc, index) => (
                    <li className="slider-bar-item" key={index}>
                        <button
                        className={`slider-dot ${selectedValue === desc ? 'active' : ''}`}
                        onClick={() => handleValueChange(desc)}
                    >&#x2022;</button>
                    </li>
                    
                ))}
            </ul>
            <div className="slider-description-wrapper">
            {descriptions.map((desc =>(
                    <p className="slider-description-text">{desc}</p>
                )))}
            </div>
            
        </div>
    </>
  )
}

export default Slider