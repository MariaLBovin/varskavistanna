import { IChargingStation } from "../interfaces/IChargingStations"; 
import { calculateFirstStop } from "./calculateFirstStop";
import { calculateNextStops } from "./calculateNextStops";

export const calculateRouteData = async (
  origin: string,
  destination: string,
  setDirectionsResponse: (response: google.maps.DirectionsResult | null) => void,
  setDistance: (distance: string) => void,
  setDuration: (duration: string) => void,
  carRange: number,
  setNearestChargingStations: (stations: IChargingStation[], remainingBattery: number[], remainingDistance: number) => void,
  setFinalBattery: (battery: number) => void,
  selectedFilter: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError: (error: any) => void
) => {
  
  const directionService = new google.maps.DirectionsService();

  try {
    const results = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (!results?.routes?.length) {
      handleError;
    }

    const leg = results.routes[0].legs[0];
    const totalDistanceKm = (leg.distance?.value || 0) / 1000;


    const { firstStop, remainingDistance, currentBattery, batteryLeft } = await calculateFirstStop(leg, carRange, selectedFilter);

    if (!firstStop) {
      const batteryUsed = (totalDistanceKm / carRange) * 100; 
      const finalBattery = Math.round(100 - batteryUsed); 
      console.log("No charging station needed, total distance:", totalDistanceKm);

      setDistance(leg.distance?.text || "Distance not available");
      setDuration(leg.duration?.text || "Duration not available");
      // setDirectionsResponse(results);

      setNearestChargingStations([], [], remainingDistance);
      setFinalBattery(finalBattery);
      return;
    }
    const { chargingStations, batteryLevels, finalBattery } = await calculateNextStops(
      leg,
      remainingDistance,
      totalDistanceKm,
      carRange,
      currentBattery,
      selectedFilter,
      firstStop
    );

    const waypoints = [
      { location: new google.maps.LatLng(firstStop.AddressInfo.Latitude, firstStop.AddressInfo.Longitude), stopover: true },
      ...chargingStations.map((station) => ({
        location: new google.maps.LatLng(station.AddressInfo.Latitude, station.AddressInfo.Longitude),
        stopover: true,
      })),
    ];
    console.log('waypoints: ', waypoints);
    

    const updatedResults = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints, 
      optimizeWaypoints: false,
    });

    const updatedLeg = updatedResults.routes[0].legs[0];

    setDistance(updatedLeg.distance?.text || "Distance not available");
    setDuration(updatedLeg.duration?.text || "Duration not available");
    setDirectionsResponse(updatedResults);

    const allStops = [{ station: firstStop, remainingBattery: batteryLeft }, 
      ...chargingStations.map((station, index) => ({
        station,
        remainingBattery: batteryLevels[index + 1]

      }))
    ];

    setDistance(leg.distance?.text || "Distance not available");
    setDuration(leg.duration?.text || "Duration not available");
    setDirectionsResponse(updatedResults);

    setNearestChargingStations(
      allStops.map(stop => stop.station),
      allStops.map(stop => stop.remainingBattery),
      remainingDistance
    );
    setFinalBattery(finalBattery);
  } catch (error) {
    handleError;
  }
};
