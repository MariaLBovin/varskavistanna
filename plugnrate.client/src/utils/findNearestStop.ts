import { IChargingStation } from "../interfaces/IChargingStations"; // Importera din ChargingStop typ

export const findNearestStop = (
    position: google.maps.LatLngLiteral,
    stations: IChargingStation[]
): IChargingStation | undefined => {
    if (stations.length === 0) return undefined;

    const distances = stations.map((station) => ({
        station,
        distance: google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(position.lat, position.lng),
            new google.maps.LatLng(station.AddressInfo.Latitude, station.AddressInfo.Longitude)
        ),
    }));

    const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
    return nearest.station;
};
