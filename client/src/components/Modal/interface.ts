import { ReactNode } from "react";

export interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    titleId?: string; 
    descriptionId?: string; 
    selectedBrand?: string;
    onBack: () => void
}