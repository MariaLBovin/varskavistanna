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

  console.log(`Startar uträkning för laddstopp`);
  console.log(
    `Totalt avstånd: ${routeDistance} km, Bilens räckvidd: ${carRange} km`
  );
  console.log(
    `Batteri startnivå: ${batteryStart}%, Minsta batterinivå: ${minBattery}%, Ladda till: ${chargeTo}%`
  );

  while (remainingDistance > 0) {
    const rangeWithCurrentBattery =
      ((currentBattery - minBattery) / (batteryStart - minBattery)) * carRange;

    console.log(
      `Nuvarande batterinivå: ${currentBattery}%, Räckvidd på denna laddning: ${rangeWithCurrentBattery.toFixed(
        2
      )} km`
    );
    console.log(`Kvarvarande avstånd: ${remainingDistance} km`);

    if (remainingDistance <= rangeWithCurrentBattery) {
      console.log(
        `Bilen kan klara resterande avstånd på ${remainingDistance} km utan fler laddstopp`
      );
      break;
    }

    const stopPosition =
      routeDistance - remainingDistance + rangeWithCurrentBattery;
    stops.push(stopPosition);
    console.log(`Laddstopp vid: ${stopPosition.toFixed(2)} km`);

    remainingDistance -= rangeWithCurrentBattery;
    currentBattery = chargeTo;
    console.log(
      `Laddar bilen till ${chargeTo}%, Kvarvarande avstånd efter laddning: ${remainingDistance.toFixed(
        2
      )} km`
    );
  }

  console.log(`Totalt antal laddstopp: ${stops.length}`);
  return { stops: stops, remainingBattery: currentBattery };
};
