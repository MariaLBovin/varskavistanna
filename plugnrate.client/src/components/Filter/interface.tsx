type FilterOptions = {
    label: string,
    value: string,
}
export interface IFilterProps {
    options: FilterOptions[];
    onChangeEvent: (selectedOptions: string) => void;

}