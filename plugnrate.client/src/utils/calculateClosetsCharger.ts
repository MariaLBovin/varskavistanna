export const findNearestChargingStations = (
  positions: google.maps.LatLngLiteral[],
  chargingStations: google.maps.LatLngLiteral[]
): google.maps.LatLngLiteral[] => {
  if (positions.length === 0 || chargingStations.length === 0) return [];

  const findNearest = (position: google.maps.LatLngLiteral) => {
    const distances = chargingStations.map(station => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(position.lat, position.lng),
        new google.maps.LatLng(station.lat, station.lng)
      );
      return { station, distance };
    });

    const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
    return nearest.station;
  };

  return positions.map(findNearest);
};
