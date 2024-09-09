export const findNearestPointOnPolyline = (polyline, targetDistance)=> {
    let nearestPoint = null;
    let minDistance = Infinity;
  
    for (let i = 0; i < polyline.length; i++) {
      const point = polyline[i];
      const distance = Math.abs(targetDistance - calculateDistance(point, previousPoint));
  
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
  
      previousPoint = point;
    }
  
    return nearestPoint;
  }