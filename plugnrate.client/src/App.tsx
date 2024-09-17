/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import MapsComponent from "./components/Map/MapsComponent";
import SearchComponent from "./containers/SearchComponent";
import { Car } from "./interfaces/cars";
import { calculateRouteData } from "./utils/calculateRouteData";


const App: React.FC = () => {
    const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult| null>(null);
  const [chargingStations, setChargingStations] = useState<
    google.maps.LatLngLiteral[]
  >([]);
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    null
  );
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Laddar...</div>;
  }

  const calculateRoute = async (
    origin: string,
    destination: string,
    carDetails: Car | null,
    filter: string | null
  ) => {
    if (!carDetails) {
      console.error("Bilspecifikationer krävs för att beräkna rutt.");
      return;
    }

    const rangeNumber = parseFloat(carDetails.range);
    if (isNaN(rangeNumber)) {
      console.error("Kunde inte omvandla bilens räckvidd till ett tal.");
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
      filter
    );
  };

  return (
    <>
      <div className='maps-container'>
        <MapsComponent
          directionsResponse={directionsResponse}
          center={{ lat: 59.3293, lng: 18.0686 }}
          chargingStations={chargingStations}
        />
      </div>
      <div className='search-container'>
        <SearchComponent
          onCalculateRoute={calculateRoute}
          onSetCarDetails={setSelectedCarDetails}
        />
      </div>
    </>
  );
};

export default App;
