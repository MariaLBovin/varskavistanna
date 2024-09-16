/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, ChangeEvent } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Button from "../components/Button/Button";
import MapsComponent from "../components/Map/MapsComponent";
import { fetchCarsByBrand } from "../services/getData";
import { SelectOption } from "../components/Select/interface";
import { Car } from "../interfaces/cars";
import CarModal from "./CarModal";
import Filter from "../components/Filter/Filter";
import { calculateRouteData } from "../utils/calculateRouteData";
import Input from "../components/Input/Input";

const RouteHandler: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    null
  );
  const [chargingStations, setChargingStations] = useState<
    google.maps.LatLngLiteral[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Laddar...</div>;
  }

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
    } else {
      console.error("Model details not found.");
    }
  };

  const calculateRoute = async () => {
    const origin = originRef.current?.value;
    const destination = destinationRef.current?.value;

    if (!origin || !destination || !selectedCarDetails) {
      console.error("Both origin and destination are required.");
      return;
    }

    const rangeNumber = parseFloat(selectedCarDetails.range);

    if (isNaN(rangeNumber)) {
      console.error("Car range could not be converted to a number.");
      return;
    }

    let calculatedDistance = "";
    let calculatedDuration = "";
    let calculatedChargingStations: google.maps.LatLngLiteral[] = [];

    await calculateRouteData(
      origin,
      destination,
      setDirectionsResponse,
      (distance: string) => {
        calculatedDistance = distance;
        setDistance(distance);
      },
      (duration: string) => {
        calculatedDuration = duration;
        setDuration(duration);
      },
      rangeNumber,
      (stations: google.maps.LatLngLiteral[]) => {
        calculatedChargingStations = stations;
        setChargingStations(stations);
      },
      selectedFilter
    );
  };

  const handleOpenCarModal = () => setIsCarModalOpen(true);
  const handleCloseCarModal = () => setIsCarModalOpen(false);

  const handleSaveCar = () => {
    setIsCarModalOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBrand(event.target.value);
  };

  const handleFilterChange = (selectedOption: string) => {
    setSelectedFilter(selectedOption);
  };

  const filterOptions = [
    { label: "Restaurang", value: "restaurant" },
    { label: "Toalett", value: "establishment" },
    { label: "Rastplats", value: "park" },
    { label: "Köpcentrum", value: "shopping_mall" },
  ];

  return (
    <div>
      <MapsComponent
        directionsResponse={directionsResponse}
        center={{ lat: 48.8584, lng: 2.2945 }}
        chargingStations={chargingStations}
      />
      <Autocomplete>
        <Input placeholder="Ange startpunkt" onSubmit={() => {}} ref={originRef} />
      </Autocomplete>
      <Autocomplete>
        <Input placeholder="Ange slutmål" onSubmit={() => {}} ref={destinationRef} />
      </Autocomplete>
      <Button
        variant="tertiary"
        text={brand && selectedModel ? `${brand} ${selectedModel}` : "Sök bilmodell"}
        onClick={handleOpenCarModal}
      />
      <CarModal
        isOpen={isCarModalOpen}
        onClose={handleCloseCarModal}
        onBrandSubmit={handleBrandSubmit}
        brands={models}
        selectedModel={selectedModel}
        onSave={handleSaveCar}
        searchValue={brand}
        handleInputChange={handleInputChange}
        onModelChange={handleModelChange}
      />
      <Filter
        options={filterOptions}
        onChangeEvent={(selectedOption: string) => handleFilterChange(selectedOption)}
      />
      <Button variant={"primary"} text={"Sök"} onClick={calculateRoute} />
    </div>
  );
};

export default RouteHandler;

