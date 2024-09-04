/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import MapsComponent from "../components/Map/MapsComponent";
import { fetchCarsByBrand } from "../services/getData";
import { SelectOption } from "../components/Select/interface";
import { fetchAndSetRouteData } from "../services/routeData";
import { Car } from "../interfaces/cars";
import CarModal from "./CarModal";

const RouteHandler: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);
  const [brands, setBrands] = useState<SelectOption[]>([]);

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [brand, setBrand] = useState("");

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

  const calculateRoute = async () => {
    const origin = originRef.current?.value;
    const destination = destinationRef.current?.value;

    if (!origin || !destination) {
      console.error("Both origin and destination are required.");
      return;
    }

    await fetchAndSetRouteData(
      origin,
      destination,
      setDirectionsResponse,
      setDistance,
      setDuration
    );
  };

  const handleOpenCarModal = () => setIsCarModalOpen(true);
  const handleCloseCarModal = () => setIsCarModalOpen(false);

  const handleBrandSubmit = async (brand: string) => {
    console.log("testar submit", brand);

    try {
      const carModels: Car[] = await fetchCarsByBrand(brand);
      const options = carModels.map((car) => ({
        value: car.model,
        label: car.model,
      }));
      console.log(options);

      setBrands(options);
      setBrand(brand);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = event.target.value;
    setSelectedModel(selectedModel);
  };

  const handleSaveCar = () => {
    setIsCarModalOpen(false);
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBrand(event.target.value);
  };
  return (
    <div>
      <MapsComponent
        directionsResponse={directionsResponse}
        center={{ lat: 48.8584, lng: 2.2945 }}
      />
      <Autocomplete>
        <Input
          placeholder='Ange startpunkt'
          onSubmit={() => {}}
          ref={originRef}
        />
      </Autocomplete>
      <Autocomplete>
        <Input
          placeholder='Ange slutmål'
          onSubmit={() => {}}
          ref={destinationRef}
        />
      </Autocomplete>
      <Input
        placeholder='Sök bilmodell'
        onClick={handleOpenCarModal}
        value={selectedModel}
        readOnly
        onChange={() => {}}
        onSubmit={() => {}}
      />
      <CarModal
        isOpen={isCarModalOpen}
        onClose={handleCloseCarModal}
        onBrandSubmit={handleBrandSubmit}
        brands={brands}
        selectedModel={selectedModel}
        onSave={handleSaveCar}
        searchValue={brand}
        handleInputChange={handleInputChange}
        onModelChange={handleModelChange}
      />
      <Button variant={"primary"} text={"Sök"} onClick={calculateRoute} />
    </div>
  );
};

export default RouteHandler;