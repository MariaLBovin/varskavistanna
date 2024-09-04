import { useEffect, useRef } from "react";
import { ModalProps } from "./interface";
import Button from "../Button/Button";
import "./modal.css";

const Modal = ({
  children,
  isOpen,
  onClose,
  titleId,
  descriptionId,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className='modal-container'
      onClick={handleOutsideClick}
      role='dialog'
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-live='assertive'
    >
      <div
        className='modal-container-inner'
        ref={modalRef}
        onClick={(e) => e.stopPropagation}
      >
        <div className='modal-close-button'>
          <Button variant={"tertiary"} onClick={onClose}></Button>
        </div>
        <div className='modal-inner-children'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
