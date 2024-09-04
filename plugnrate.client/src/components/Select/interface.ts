export interface SelectOption {
    value: string;
    label: string;
  }
  
export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
  }