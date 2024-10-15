import React, { useRef, useState, ChangeEvent, useEffect,  } from "react";
import { Autocomplete } from "@react-google-maps/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import CarModal from "./CarModalContainer";
import Filter from "../components/Filter/Filter";
import { fetchCarsByBrand } from "../services/getData";
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
  const [brand, setBrand] = useState<string>(
    localStorage.getItem("brand") || ""
  );
  const [models, setModels] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    localStorage.getItem("selectedModel") || ""
  );
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    JSON.parse(localStorage.getItem("selectedCarDetails") || "null")
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    localStorage.getItem("selectedFilter") || null
  );
  
  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const [isOriginEmpty, setIsOriginEmpty] = useState<boolean>(false);
  const [isDestinationEmpty, setIsDestinationEmpty] = useState<boolean>(false)

  // Ladda origin och destination från localStorage
    
  useEffect(() => {
    const savedOrigin = localStorage.getItem("origin");
    const savedDestination = localStorage.getItem("destination");
  
    if (savedOrigin && originRef.current) {
      originRef.current.value = savedOrigin; // Sätt värdet i ref-fältet
      setOrigin(savedOrigin); // Uppdatera state
    }
    if (savedDestination && destinationRef.current) {
      destinationRef.current.value = savedDestination; // Sätt värdet i ref-fältet
      setDestination(savedDestination); // Uppdatera state
    }
  }, [setOrigin, setDestination]);


  const handleBrandSubmit = async (brand: string) => {
    try {
      const carModels: Car[] = await fetchCarsByBrand(brand);

      const options = carModels.map((car) => ({
        value: car.model,
        label: car.model,
        range: car.range,
      }));
      setModels(options);
      localStorage.setItem("brand", brand); // Spara i localStorage
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

      // Spara bilinformation i localStorage
      localStorage.setItem("selectedModel", selectedModel);
      localStorage.setItem("selectedCarDetails", JSON.stringify(modelDetails));
    }
  };

  const handleFilterChange = (selectedOption: string) => {
    setSelectedFilter(selectedOption);
    localStorage.setItem("selectedFilter", selectedOption); // Spara filter i localStorage
  };

  const calculateRoute = () => {
    const originValue = originRef.current?.value || "";
    const destinationValue = destinationRef.current?.value || ""; 

    setOrigin(originValue);
    setDestination(destinationValue); 

    setIsOriginEmpty(originValue === "");
    setIsDestinationEmpty(destinationValue === "");

    // Spara origin och destination i localStorage
    localStorage.setItem("origin", originValue);
    localStorage.setItem("destination", destinationValue);

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
    { label: "Toalett", value: "establishment" },
    { label: "Rastplats", value: "park" },
    { label: "Köpcentrum", value: "shopping_mall" },
  ];

  const handleClear = () => {
    setBrand("");
    setModels([]);
    setSelectedModel("");
    setSelectedCarDetails(null);
    setSelectedFilter(null);
    setOrigin("");
    setDestination("");

    // Rensa localStorage
    localStorage.removeItem("brand");
    localStorage.removeItem("selectedModel");
    localStorage.removeItem("selectedCarDetails");
    localStorage.removeItem("selectedFilter");
    localStorage.removeItem("origin");
    localStorage.removeItem("destination");
  };

  
  return (
    <>
      <Autocomplete>
        <Input
          placeholder='Ange startpunkt'
          ref={originRef}
          isEmpty={isOriginEmpty}
          
        />
      </Autocomplete>
      <Autocomplete>
        <Input
          placeholder='Ange slutmål'
          ref={destinationRef}
          isEmpty={isDestinationEmpty}
          
        />
      </Autocomplete>
      <Button
        variant='tertiary'
        text={
          brand && selectedModel ? `${brand} ${selectedModel}` : "Sök bilmodell"
        }
        onClick={() => setIsCarModalOpen(true)}
      />
      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        onBrandSubmit={handleBrandSubmit}
        brands={models}
        selectedModel={selectedModel}
        onSave={() => setIsCarModalOpen(false)}
        searchValue={brand}
        handleInputChange={(e) => setBrand(e.target.value)}
        onModelChange={handleModelChange}
      />
      <Filter options={filterOptions} onChangeEvent={handleFilterChange} />
      <div className='search-button-container'>
        <Button variant='primary' text='Planera' onClick={calculateRoute} />
        <Button variant={"secondary"} text={"Rensa"} onClick={handleClear} />
      </div>
    </>
  );
};

export default SearchComponent;
