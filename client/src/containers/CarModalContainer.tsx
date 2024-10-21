import { ChangeEvent, useEffect, useState } from "react";
import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import Select from "../components/Select/Select";
import { CarModalProps } from "../interfaces/IModalContaier";
import ListComponent from "../components/List/List";

const CarModal: React.FC<CarModalProps> = ({
  isOpen,
  onClose,
  onBrandSubmit,
  models,
  brands,
  selectedModel,
  onSave,
  onModelChange,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedBrand("");
    }
  }, [isOpen]); 

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    if (onBrandSubmit) {
      onBrandSubmit(brand);
    }
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onModelChange) {
      onModelChange(event);
    }
  };

  const filteredBrands = selectedBrand ? [selectedBrand] : brands;

  return (
    <div className='car-modal-container'>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ListComponent
          items={filteredBrands}
          onItemClick={handleBrandClick}
          selectedItem={selectedBrand}
        />

        {models.length > 0 && selectedBrand && ( 
          <>
            <Select
              options={models}
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
