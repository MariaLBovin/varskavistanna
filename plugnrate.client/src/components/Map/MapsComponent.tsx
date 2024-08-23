import { GoogleMap, Marker, DirectionsRenderer} from "@react-google-maps/api";

interface MapsComponentProps {
    directionsResponse: google.maps.DirectionsResult | null;
    center: google.maps.LatLngLiteral;
}

const MapsComponent: React.FC<MapsComponentProps> = ({ directionsResponse, center}) => {

    return (
        <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "70vw", height: "30vh" }}
        >
            <Marker position={center} />
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
    );
};

export default MapsComponent;
