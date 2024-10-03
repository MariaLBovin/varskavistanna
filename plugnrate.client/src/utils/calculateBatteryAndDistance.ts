export const calculateBatteryAndDistance = (
    startLocation: google.maps.LatLng,
    stopLocation: google.maps.LatLng,
    carRange: number,
    currentBattery: number
  ): { battery: number; distanceDriven: number } => {
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      startLocation,
      stopLocation
    );
    const distanceInKm = Math.round(distanceInMeters / 1000);
    console.log("", distanceInKm);
    
    const batteryUsed = (distanceInKm / carRange) * 100;
    const batteryAfterStop = currentBattery - batteryUsed;
    console.log(batteryAfterStop);
    
  
    return { battery: batteryAfterStop, distanceDriven: distanceInKm };
  };
  