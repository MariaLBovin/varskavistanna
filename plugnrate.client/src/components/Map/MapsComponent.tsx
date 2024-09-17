import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import './maps.css'

interface MapsComponentProps {
  directionsResponse: google.maps.DirectionsResult | null;
  center: google.maps.LatLngLiteral;
  chargingStations: google.maps.LatLngLiteral[];
}

const MapsComponent: React.FC<MapsComponentProps> = ({
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
      {chargingStations.map((station, index) => (
        <Marker key={index} position={station} />
      ))}
    </GoogleMap>
  );
};

export default MapsComponent;
