export interface ListComponentProps {
    items: string[];
    onItemClick: (item: string) => void; 
    selectedItem: string;
  }