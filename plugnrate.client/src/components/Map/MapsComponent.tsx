import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import './maps.css'
import { IMapsComponentProps } from "./interface";
import { IChargingStation } from "../../interfaces/IChargingStations";


const MapsComponent: React.FC<IMapsComponentProps> = ({
  directionsResponse,
  center,
  chargingStations,
}) => {
  
  const options = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };


  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerClassName="maps-container-wrapper"
      options={options}
    >
      <Marker position={center} />
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
      {chargingStations.map((station: IChargingStation) => (
        <Marker key={station.id} position={{
          lat: station.AddressInfo.Latitude,
          lng: station.AddressInfo.Longitude,
        }} />
      ))}
    </GoogleMap>
  );
};

export default MapsComponent;
