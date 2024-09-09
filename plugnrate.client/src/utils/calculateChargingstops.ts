export const calculateChargingStops = (
  routeDistance: number,
  carRange: number,
  batteryStart: number = 100,
  minBattery: number = 10,
  chargeTo: number = 80
): { stops: number[]; remainingBattery: number } => {
  const stops: number[] = [];
  let currentBattery = batteryStart;
  let remainingDistance = routeDistance;
  let isFirstStop = true;

  const calculateRange = (isFirstStop: boolean) => {
    if (isFirstStop) {
      return carRange * Math.min((batteryStart - minBattery) / 100);
    } else {
      return carRange * Math.min((chargeTo - minBattery) / 100);
    }
  };

  while (remainingDistance > 0) {
    const range = calculateRange(isFirstStop);
    isFirstStop = false;

    // console.log(
    //   `Remaining distance: ${remainingDistance}, Calculated range: ${range}`
    // );

    if (remainingDistance <= range) {
      if (stops.length === 0 || stops[stops.length - 1] !== routeDistance) {
        break;
      }
      remainingDistance = 0;
    } else {
      const stopPosition = routeDistance - remainingDistance + range;
      stops.push(stopPosition);
      remainingDistance -= range;
      currentBattery = chargeTo;
    }
    // console.log(stops, range);
  }

  const finalBatteryLevel = Math.max(
    currentBattery - (remainingDistance / carRange) * 100,
    minBattery
  );
  // console.log(`Final battery level after the trip: ${finalBatteryLevel}%`);
  return { stops: stops, remainingBattery: finalBatteryLevel };
};
