/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Button from "../Button/Button";
import Input from "../Input/Input";
import MapsComponent from "./MapsComponent";
import { fetchChargingStations } from "./fetchChargingStations";

const RouteHandler: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

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

    const directionService = new google.maps.DirectionsService();

    try {
      const results = await directionService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (results && results.routes && results.routes.length > 0) {
        const route = results.routes[0];
        if (route && route.legs && route.legs.length > 0) {
          const leg = route.legs[0];

          const chargingStationsPromises = leg.steps.map((step) => {
            const { lat, lng } = step.end_location;
            return fetchChargingStations(lat(), lng());
          });

          const chargingStations = await Promise.all(chargingStationsPromises);

          const allStations = chargingStations.flat();

          console.log("Laddstationer:", allStations);

          setDistance(leg.distance?.text || "Distance not available");
          setDuration(leg.duration?.text || "Duration not available");
          setDirectionsResponse(results);
        } else {
          console.error("No legs found in route");
        }
      } else {
        console.error("No route found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handleSubmit = (address: string) => {
    console.log("Address submitted:", address);
  };

  return (
    <div>
      <MapsComponent
        directionsResponse={directionsResponse}
        center={{ lat: 48.8584, lng: 2.2945 }} // Center of the map
      />
      <Autocomplete>
        <Input
          placeholder='Ange startpunkt'
          onSubmit={handleSubmit}
          ref={originRef}
        />
      </Autocomplete>
      <Autocomplete>
        <Input
          placeholder='Ange slutmål'
          onSubmit={handleSubmit}
          ref={destinationRef}
        />
      </Autocomplete>
      <Button variant={"primary"} text={"Sök"} onClick={calculateRoute} />
    </div>
  );
};

export default RouteHandler;
