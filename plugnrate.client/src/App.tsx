// import { useRef, useState } from 'react';
import './App.css';
// import Input from './components/Input/Input';
// import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
// import Button from './components/Button/Button';
import RouteHandler from './components/Map/RouteHandler';


function App() {
    // const handleSubmit = (address: string) => {
    //     console.log(address);
        
    // }
    // const handleSearch = () => {
    //     calculateRoute();
    // }

    // const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    // const [distance, setDistance] = useState('');
    // const [duration, setDuration] = useState('');

    // const originRef = useRef<HTMLInputElement | null>(null);
    // const destinationRef = useRef<HTMLInputElement | null>(null);

    // const calculateRoute = async () => {
    //     const origin = originRef.current?.value;
    //     const destination = destinationRef.current?.value;
    
    //     if (!origin || !destination) {
    //         console.error('Both origin and destination are required.');
    //         return;
    //     }

    //     const directionService = new google.maps.DirectionsService();
    
    //     try {
    //         const results = await directionService.route({
    //             origin: origin,
    //             destination: destination,
    //             travelMode: google.maps.TravelMode.DRIVING
    //         });
    
    //         console.log('Route results:', results);
    //         if (results && results.routes && results.routes.length > 0) {
    //             const route = results.routes[0];
    //             if (route && route.legs && route.legs.length > 0) {
    //                 const leg = route.legs[0];
    //                 if (leg && leg.distance && leg.distance.text) {
    //                     setDistance(leg.distance.text);
    //                 } else {
    //                     setDistance('Distance not available');
    //                 }
    //                 if (leg && leg.duration && leg.duration.text) {
    //                     setDuration(leg.duration.text);
    //                 } else {
    //                     setDuration('Duration not available');
    //                 }
    //                 setDirectionsResponse(results);
    //             } else {
    //                 console.error('No legs found in route');
    //             }
    //         } else {
    //             console.error('No route found');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching route:', error);
    //     }
    // };

    // const center = { lat: 48.8584, lng: 2.2945 };

    // const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    // if (!apiKey) {
    // throw new Error("Google Maps API key is missing");
    //  }

    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: apiKey,
    //     libraries: ['places']
    // });

    // if (!isLoaded) {
    //     return <div>Laddar kartan...</div>; 
    // }
   
    return (
        <>
        <RouteHandler/>
        {/* <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "70vw", height: "30vh"}}
        >
            <Marker position={center}/>
            {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
        </GoogleMap>
        <Autocomplete>
            <Input 
            placeholder='Ange startpunkt'
            onSubmit={handleSubmit}
            ref={originRef}/>
        </Autocomplete>
        <Autocomplete>
            <Input 
            placeholder='Ange slutmål'
            onSubmit={handleSubmit}
            ref={destinationRef}/>
        </Autocomplete>
        <Button variant={'primary'} text={'Sök'} onClick={handleSearch }></Button>
         */}
        </>
        
    );

}

export default App;