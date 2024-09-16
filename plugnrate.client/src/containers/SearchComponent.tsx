import React, { useRef, useState, ChangeEvent } from "react";
import { Autocomplete} from "@react-google-maps/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import CarModal from "./CarModal";
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
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onCalculateRoute,
  onSetCarDetails,
}) => {
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [brand, setBrand] = useState<string>("");
  const [models, setModels] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const handleBrandSubmit = async (brand: string) => {
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
    const origin = originRef.current?.value;
    const destination = destinationRef.current?.value;

    if (origin && destination) {
      onCalculateRoute(origin, destination, selectedCarDetails, selectedFilter);
    }
  };

  const filterOptions = [
    { label: "Restaurang", value: "restaurant" },
    { label: "Toalett", value: "establishment" },
    { label: "Rastplats", value: "park" },
    { label: "Köpcentrum", value: "shopping_mall" },
  ];

  return (
    <>
      <Autocomplete>
        <Input placeholder="Ange startpunkt" onSubmit={() => {}} ref={originRef} />
      </Autocomplete>
      <Autocomplete>
        <Input placeholder="Ange slutmål" onSubmit={() => {}} ref={destinationRef} />
      </Autocomplete>
      <Button
        variant="tertiary"
        text={brand && selectedModel ? `${brand} ${selectedModel}` : "Sök bilmodell"}
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
      <Filter
        options={filterOptions}
        onChangeEvent={handleFilterChange}
      />
      <Button variant="primary" text="Sök" onClick={calculateRoute} />
    </>
  );
};

export default SearchComponent;
