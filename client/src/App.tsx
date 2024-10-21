/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import MapsComponent from "./components/Map/MapsComponent";
import SearchComponent from "./containers/SearchContainer";
import ResultContainer from "./containers/ResultContainer";
import { IChargingStation } from "./interfaces/IChargingStations";
import { calculateRouteData } from "./utils/calculateRouteData";
import { Car } from "./interfaces/cars";
import Loader from "./components/Loader/Loader";
import NotFound from "./containers/404";

const App: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [nearestStationsData, setNearestStationsData] = useState<{
    stations: IChargingStation[];
    remainingBattery: number[];
    remainingDistance: number;
  }>({ stations: [], remainingBattery: [100], remainingDistance: 0 });

  const [showResult, setShowResult] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [, setSelectedCarDetails] = useState<Car | null>(null);
  const [, setDistance] = useState<string>('');
  const [, setDuration] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [finalBattery, setFinalBattery] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false); 

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <Loader />;
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

    setLoading(true);
    setHasError(false);

    await calculateRouteData(
      origin,
      destination,
      setDirectionsResponse,
      setDistance,
      setDuration,
      rangeNumber,
      (stations: IChargingStation[], remainingBattery: number[], remainingDistance: number) => {
        if (stations.length === 0) {
          setHasError(true);
        } else {
          setNearestStationsData({ stations, remainingBattery, remainingDistance });
        }
      },
      (finalBattery: number) => { setFinalBattery(finalBattery) },
      selectedFilter,
      (error) => { 
        console.error("Error fetching data:", error);
        setHasError(true);
      }
    );

    if (!nearestStationsData.stations.length) {
      setDirectionsResponse
    }

    setShowResult(true);
    setLoading(false);
  };

  const handleSetCarDetails = (car: Car | null) => {
    setSelectedCarDetails(car);
  };

  if (hasError) {
    return <NotFound />;
  }

  return (
    <>
      <div className="maps-container">
        <MapsComponent
          directionsResponse={directionsResponse}
          center={{ lat: 59.3293, lng: 18.0686 }}
          chargingStations={nearestStationsData.stations}
        />
      </div>
      <div className='content-container'>
      {loading ? (
        <Loader />
      ) : showResult ? (
        <ResultContainer
          chargingStops={nearestStationsData.stations}
          remainingBattery={nearestStationsData.remainingBattery}
          startAdress={origin}
          endAddress={destination}
          finalBattery={finalBattery}

        />
      ) : (
          <SearchComponent
            onCalculateRoute={handleRouteResult}
            onSetCarDetails={handleSetCarDetails}
            setOrigin={setOrigin}
            setDestination={setDestination}
            origin={origin}
            destination={destination}
          />
      )}
      </div>
    </>
  );
};

export default App;
