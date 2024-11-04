import React, { useRef, useState, ChangeEvent } from "react";
import { Autocomplete } from "@react-google-maps/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import CarModal from "./CarModalContainer";
import Filter from "../components/Filter/Filter";
import { fetchAllCarBrands, fetchCarsByBrand } from "../services/getData";
import { SelectOption } from "../components/Select/interface";
import { Car } from "../interfaces/cars";

interface SearchComponentProps {
  onCalculateRoute: (
    origin: string,
    destination: string,
    selectedCarDetails: Car | null,
    selectedFilter: string | null
  ) => void;
  onSetCarDetails: (car: Car | null) => void;
  origin: string;
  destination: string;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onCalculateRoute,
  onSetCarDetails,
  setOrigin,
  setDestination,
}) => {
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [brand, setBrand] = useState<string>("");
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const [isOriginEmpty, setIsOriginEmpty] = useState<boolean>(false);
  const [isDestinationEmpty, setIsDestinationEmpty] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBrandSubmit = async (brand: string) => {
    setBrand(brand);
    try {
      const carModels: Car[] = await fetchCarsByBrand(brand);

      const options = carModels.map((car) => ({
        value: car.model,
        label: car.model,
        range: car.range,
      }));
      setModels(options);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = event.target.value;

    setSelectedModel(selectedModel);

    const modelDetails = models.find((brand) => brand.value === selectedModel);
    if (modelDetails) {
      setSelectedCarDetails(modelDetails as unknown as Car);
      onSetCarDetails(modelDetails as unknown as Car);
    }
    
  };

  const handleFilterChange = (selectedOption: string) => {
    setSelectedFilter(selectedOption);
  };

  const calculateRoute = () => {
    const originValue = originRef.current?.value.trim() || "";
    const destinationValue = destinationRef.current?.value.trim() || "";
  
    setOrigin(originValue);
    setDestination(destinationValue);
  
    const originEmpty = originValue === "";
    const destinationEmpty = destinationValue === "";
  
    setIsOriginEmpty(originEmpty);
    setIsDestinationEmpty(destinationEmpty);

    if (!brand && !selectedModel) {
      setErrorMessage("Vänligen välj en bilmodell eller ett märke.");
    } else {
      setErrorMessage(null); 
    }
  
    if (!originEmpty && !destinationEmpty) {
      onCalculateRoute(originValue, destinationValue, selectedCarDetails, selectedFilter);
    }
  };
  

  const filterOptions = [
    { label: "Restaurang", value: "restaurant" },
    { label: "Café", value: "cafe" },
    { label: "Rastplats", value: "campground" },
    { label: "Köpcentrum", value: "shopping_mall" },
    { label: "Matvaruaffär", value: "supermarket" },
    { label: "Bankomat", value: "atm" },
  ];

  const handleOpenCarModal = async () => {
    setIsCarModalOpen(true);
    setBrand("");
    setBrands([]);
    setModels([]);
    setSelectedModel("");
    setSelectedCarDetails(null);

    const allBrands = await fetchAllCarBrands();
    setBrands(allBrands);

  
  };

  const handleOriginClick = () => {
    setOrigin("");
    setIsOriginEmpty(false)
    if (originRef.current) {
      originRef.current.value = "";
    }
  };
  const handleDestinationClick = () => {
    setDestination("");
    setIsDestinationEmpty(false)
    if (destinationRef.current) {
      destinationRef.current.value = "";
    }
  };
  const handleSaveCar = () => {
    setIsCarModalOpen(false);
    if (selectedCarDetails) {
      setBrand(brand)
      setSelectedModel(selectedModel);
    }

  };

  const handleClear = () => {
    setBrand("");
    setBrands([]);
    setModels([]);
    setSelectedModel("");
    setSelectedCarDetails(null);
    setSelectedFilter(null);
    setOrigin("");
    setDestination("");
    if (originRef.current) {
      originRef.current.value = "";
    }
    if (destinationRef.current) {
      destinationRef.current.value = "";
    }
  };

  return (
    <>
      <Autocomplete>
        <Input
          placeholder='Ange startpunkt'
          ref={originRef}
          isEmpty={isOriginEmpty}
          onClick={handleOriginClick}
        />
      </Autocomplete>
      <Autocomplete>
        <Input
          placeholder='Ange slutmål'
          ref={destinationRef}
          isEmpty={isDestinationEmpty}
          onClick={handleDestinationClick}
        />
      </Autocomplete>
    <div className="search-button-plan">
    <Button
        variant='tertiary'
        text={
          brand || selectedModel ? `${brand} ${selectedModel}` : "Sök bilmodell"
        }
        onClick={handleOpenCarModal}
      />
      {errorMessage && <span className='search-error-message'>{errorMessage}</span>}
      <div className={isCarModalOpen ? "car-modal-open" : "car-modal-closed"}>
    </div>
      
        <CarModal
          isOpen={isCarModalOpen}
          onClose={() => setIsCarModalOpen(false)}
          onBrandSubmit={handleBrandSubmit}
          models={models}
          selectedModel={selectedModel}
          onSave={handleSaveCar}
          searchValue={brand}
          brands={brands}
          onModelChange={handleModelChange}
        />
      </div>
      <Filter options={filterOptions} onChangeEvent={handleFilterChange} />
      <div className='search-button-container'>
        <Button variant='primary' text='Planera' onClick={calculateRoute} />
        <Button variant={"secondary"} text={"Rensa"} onClick={handleClear} />
      </div>
    </>
  );
};

export default SearchComponent;
