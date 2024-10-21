export const getStopLatLng = (
    leg: google.maps.DirectionsLeg,
    stopDistance: number
  ): google.maps.LatLng | null => {
    let accumulatedDistance = 0;
    for (const step of leg.steps) {
      const stepDistanceKm = (step.distance?.value || 0)/1000;
      accumulatedDistance += stepDistanceKm;
  
      if (accumulatedDistance >= stopDistance) {
        const progress =
          (stopDistance - (accumulatedDistance - stepDistanceKm)) / stepDistanceKm;
        const startLatLng = step.start_location;
        const endLatLng = step.end_location;
  
        const lat =
          startLatLng.lat() + (endLatLng.lat() - startLatLng.lat()) * progress;
        const lng =
          startLatLng.lng() + (endLatLng.lng() - startLatLng.lng()) * progress;
        
        return new google.maps.LatLng(lat, lng);
      }
    }
    return null;
  };