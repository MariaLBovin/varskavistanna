import { useState } from "react"
import IconChevronDown from "../../assets/icons/IconChevronDown"
import IconChevronUp from "../../assets/icons/IconChevronUp";
import { IFilterProps } from "./interface";
import './filter.css';
import Button from "../Button/Button";

const Filter = ({options,  onChangeEvent}: IFilterProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    };
 
  return (
    <>
        <div className="filter-container">
            <div className="filter-wrapper">
                <p className="filter-wrapper-text">Visa fler val</p>
                {
                    isExpanded ? <Button variant={'icon'} icon={<IconChevronUp/>} onClick={toggleExpand} aria-label='Stäng filter'></Button>
                    : <Button variant={'icon'} icon={<IconChevronDown/>} onClick={toggleExpand} aria-label='Öppna filter'></Button>
                }
                {/* <button onClick={toggleExpand} className="filter-wrapper-button" aria-la>
                {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
                </button> */}
            </div>
            <div className={`filter-inner-wrapper ${isExpanded ? 'expanded' : ''}`}>
               {
                options.map(option => (
                    <div className="filter-input-wrapper">
                        <label htmlFor={option.label} className="filter-input-label">{option.label}</label>
                        <input 
                            type='checkbox' 
                            value={option.value}
                            id={option.label}
                            onChange={() => onChangeEvent(option.value)}
                            className="filter-inner-field"
                            />
                    </div>
                ))
                } 
            
            </div>
        </div>
    </>
  )
}

export default Filter
