/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import MapsComponent from "./components/Map/MapsComponent";
import SearchComponent from "./containers/SearchContainer";
import ResultContainer from "./containers/ResultContainer";
import { IChargingStation } from "./interfaces/IChargingStations";
import { calculateRouteData } from "./utils/calculateRouteData"; // Importera calculateRouteData
import { Car } from "./interfaces/cars"; // Importera Car-gränssnittet

const App: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [chargingStations, setChargingStations] = useState<IChargingStation[]>([]);
  const [remainingBattery, setRemainingBattery] = useState<number>(100);
  const [batteryBeforeStops, setBatteryBeforeStops] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');  
  const [destination, setDestination] = useState<string>('');
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>("");

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Laddar...</div>;
  }

  const handleRouteResult = async (
    origin: string,
    destination: string,
    carDetails: Car | null,
   selectedFilter: string | null
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
      setChargingStations,
      selectedFilter
    );
    setShowResult(true);
  };

  const handleSetCarDetails = (car: Car | null) => {
    setSelectedCarDetails(car);
  };

  return (
    <>
      <div className="maps-container">
        <MapsComponent
          directionsResponse={directionsResponse}
          center={{ lat: 59.3293, lng: 18.0686 }}
          chargingStations={chargingStations}
        />
      </div>
      {showResult ? (
        <ResultContainer
          chargingStops={chargingStations}
          remainingBattery={remainingBattery}
          batteryBeforeStops={batteryBeforeStops}
          startAdress={origin}
          endAddress={destination}
        />
      ) : (
        <div className="search-container">
          <SearchComponent
            onCalculateRoute={handleRouteResult} 
            onSetCarDetails={handleSetCarDetails} 
            setOrigin={setOrigin}
            setDestination={setDestination}
            origin={origin}
            destination={destination}
          />
        </div>
      )}
    </>
  );
};

export default App;
