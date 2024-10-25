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
  const [brand, setBrand] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const [isOriginEmpty, setIsOriginEmpty] = useState<boolean>(false);
  const [isDestinationEmpty, setIsDestinationEmpty] = useState<boolean>(false)


  const handleBrandSubmit = async (brand: string) => {
    setBrand(brand)
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
    console.log(brand, selectedModel);
    
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
    const originValue = originRef.current?.value || "";
    const destinationValue = destinationRef.current?.value || ""; 

    setOrigin(originValue);
    setDestination(destinationValue); 

    setIsOriginEmpty(originValue === "");
    setIsDestinationEmpty(destinationValue === "");


    if (originValue && destinationValue) {
      onCalculateRoute(
        originValue,
        destinationValue,
        selectedCarDetails,
        selectedFilter
      );
    }
  };

  const filterOptions = [
    { label: "Restaurang", value: "restaurant" },
    { label: "Café", value:'cafe'},
    { label: "Rastplats", value: "campground" },
    { label: "Köpcentrum", value: "shopping_mall" },
    {label: 'Matvaruaffär', value: 'supermarket'},
    {label: 'Bankomat', value:'atm'},

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
    if (originRef.current) {
      originRef.current.value = ""; 
    }
  };
  const handleDestinationClick = () => {
    setDestination("");
    if(destinationRef.current) {
      destinationRef.current.value = "";
    }
  }
  
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
    if(destinationRef.current) {
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
      <Button
        variant='tertiary'
        text={
          brand && selectedModel ? `${brand} ${selectedModel}` : "Sök bilmodell"
        }
        onClick={handleOpenCarModal}
      />
      <div className={isCarModalOpen ? 'car-modal-open' : 'car-modal-closed'}>
      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        onBrandSubmit={handleBrandSubmit}
        models={models}
        selectedModel={selectedModel}
        onSave={() => setIsCarModalOpen(false)}
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
