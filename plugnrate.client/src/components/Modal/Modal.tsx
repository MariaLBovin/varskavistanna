import { useEffect, useRef} from "react"
import { ModalProps } from "./interface"
import Button from "../Button/Button";
import './modal.css'

const Modal = ({children, isOpen, onClose, titleId, descriptionId}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;


  return (
    <div className="modal-container" 
    onClick={onClose}
    role='dialog'
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    aria-live="assertive"
    >
        <div className="modal-container-inner"
        ref={modalRef}
        onClick={(e) => e.stopPropagation}
        >
            <Button variant={"primary"} text={"Stäng"} onClick={onClose}></Button>
            {children}</div>
    </div>
  )
}

export default Modal