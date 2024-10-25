export const getStopLatLng = (
  route: google.maps.DirectionsRoute,
  stopDistance: number,
): google.maps.LatLng | null => {

  const pathPoints =route.overview_path;
  let accumulatedDistance = 0;

  for (let i = 1; i < pathPoints.length; i++) {
    const previousPoint = pathPoints[i - 1];
    const currentPoint = pathPoints[i];


    const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(
      previousPoint,
      currentPoint
    ) / 1000; 

    accumulatedDistance += segmentDistance;

    if (accumulatedDistance >= stopDistance) {
      return currentPoint;
    }
  }

  console.log('Inget stopp hittades inom given distans.');
  return null;
};
