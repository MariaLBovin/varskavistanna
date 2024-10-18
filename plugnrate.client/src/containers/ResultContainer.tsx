/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Display from "../components/Display/Display";
import IconBattery from "../assets/icons/IconBattery";
import { IResultContainerProps } from "../interfaces/IResultContainer";
import Button from "../components/Button/Button";
import IconArrowDown from "../assets/icons/IconArrowDown";
import IconArrowUp from "../assets/icons/IconArrowUp";

const ResultContainer: React.FC<IResultContainerProps> = ({
  chargingStops,
  remainingBattery,
  startAdress,
  endAddress,
  finalBattery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 750);
  const [startCoords, setStartCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [endCoords, setEndCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollUp(scrollTop > 0);
      setShowScrollDown(scrollTop + clientHeight < scrollHeight);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 750);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      handleScroll();
    }
  }, [chargingStops, isDesktop]);

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();

    const getLatLng = async (address: string) => {
      return new Promise<{ lat: number; lng: number } | null>((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.length) {
            const { location } = results[0].geometry;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            resolve(null);
          }
        });
      });
    };

    const fetchCoordinates = async () => {
      const startCoordinates = await getLatLng(startAdress);
      const endCoordinates = await getLatLng(endAddress);
      setStartCoords(startCoordinates);
      setEndCoords(endCoordinates);
    };

    fetchCoordinates();
  }, [startAdress, endAddress]);

  const goToGoogleMaps = (start: { lat: number; lng: number; }, destination: { lat: number; lng: number; }, waypoints: { Lat: number; Long: number; }[]) => {

    const waypointsString = waypoints
      .map((wp: { Lat: number; Long: number }) => `${wp.Lat},${wp.Long}`)
      .join("|");

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypointsString}`;
    window.open(mapsUrl, '_blank')
  };

  const handleBackToHome = () => {
    window.location.href = "/"; 
  };

  return (
    <div className='result-outer'>
      <div className='scroll-container'>
        {isDesktop && showScrollUp && (
          <Button
            variant={"tertiary"}
            icon={<IconArrowUp />}
            onClick={() =>
              containerRef.current?.scrollBy({ top: -100, behavior: "smooth" })
            }
          />
        )}
        <div
          className='results-container'
          ref={containerRef}
          onScroll={handleScroll}
        >
          <Display
            stopName={"Min position"}
            stopOperator=''
            address={startAdress}
            batteryLevel={100}
            chargingIcon={<IconBattery />}
          />
          <IconArrowDown />
          {chargingStops.map((station, index) => (
            <>
              <Display
                key={station.id ?? ""}
                stopName={station.AddressInfo.Title ?? ""}
                stopOperator={
                  station.OperatorInfo.Title === "(Unknown Operator)"
                    ? ""
                    : station.OperatorInfo.Title ?? ""
                }
                address={`${station.AddressInfo.AddressLine1 ?? ""}, ${
                  station.AddressInfo.Postcode ?? ""
                }, ${station.AddressInfo.Town ?? ""}`}
                batteryLevel={remainingBattery[index] || 0}
                chargingIcon={<IconBattery />}
              />
              <IconArrowDown />
            </>
          ))}
          <Display
            stopName={"Slutdestination"}
            stopOperator=''
            address={endAddress}
            batteryLevel={finalBattery}
            chargingIcon={<IconBattery />}
          />
        </div>
        {isDesktop && showScrollDown && (
          <Button
            variant={"tertiary"}
            icon={<IconArrowDown />}
            onClick={() =>
              containerRef.current?.scrollBy({ top: 100, behavior: "smooth" })
            }
          />
        )}
      </div>
      <div className='result-button-container'>
        <Button
          variant={"secondary"}
          text='Börja om'
          onClick={handleBackToHome}
        />
        <Button
          variant='primary'
          text='Kör'
          onClick={() => {
            if (startCoords && endCoords) {
              const waypoints = chargingStops.map((stop) => ({
                Lat: stop.AddressInfo.Latitude,
                Long: stop.AddressInfo.Longitude,
              }));
        
              goToGoogleMaps(startCoords, endCoords, waypoints);
            } else {
              console.error("Start or end coordinates are not available.");
            }
          }}
        />
      </div>
    </div>
  );
};

export default ResultContainer;
