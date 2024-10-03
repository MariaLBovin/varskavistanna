import { ChangeEvent } from "react";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import Select from "../components/Select/Select";
import { CarModalProps } from "../interfaces/IModalContaier";

const CarModal: React.FC<CarModalProps> = ({
  isOpen,
  onClose,
  onBrandSubmit,
  brands,
  searchValue,
  handleInputChange,
  selectedModel,
  onSave,
  onModelChange,
}) => {
  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onModelChange) {
      onModelChange(event);
    }
  };

  return (
    <div className='car-modal-container'>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Input
          placeholder='Sök bilmärke'
          onSubmit={onBrandSubmit}
          value={searchValue}
          onChange={handleInputChange}
        />

        {brands.length > 0 && (
          <>
            <Select
              options={brands}
              value={selectedModel}
              onChange={handleModelChange}
              placeholder='Välj en modell'
            />
            <Button variant='primary' text='Spara bil' onClick={onSave} />
          </>
        )}
      </Modal>
    </div>
  );
};

export default CarModal;
