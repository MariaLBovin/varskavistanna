import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

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
  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "70vw", height: "30vh" }}
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
