export const findNearestStation = (
    position: google.maps.LatLngLiteral,
    stations: google.maps.LatLngLiteral[]
  ): google.maps.LatLngLiteral | undefined => {
    if (stations.length === 0) return undefined;
  
    const distances = stations.map((station) => ({
      station,
      distance: google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(position.lat, position.lng),
        new google.maps.LatLng(station.lat, station.lng)
      ),
    }));
  
    const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
    return nearest.station;
  };