export interface ISliderProps {
    label: string;
    descriptions: string []
    onValueChange: (selectedValue: string | number) => void
}