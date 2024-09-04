import { ChangeEvent } from "react";
import { SelectOption } from "../components/Select/interface";

export interface CarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBrandSubmit: (brand: string) => void;
    brands: SelectOption[];
    selectedModel: string;
    onSave: () => void;
    onModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    searchValue: string;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  }
  