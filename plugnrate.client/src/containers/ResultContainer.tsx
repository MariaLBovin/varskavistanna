import Display from "../components/Display/Display";
import IconBattery from "../assets/icons/IconBattery";
import { IResultContainerProps } from "../interfaces/IResultContainer";

const ResultContainer: React.FC<IResultContainerProps> = ({
  chargingStops,
  remainingBattery,
  startAdress,
  endAddress,
}) => {
  return (
    <div className="results-container">
      <Display
        stopName={"Startpunkt"}
        stopOperator=''
        address={startAdress}
        batteryLevel={100}
        chargingIcon={<IconBattery />}
      ></Display>
      {chargingStops.map((station) => (
        <Display
          key={station.id}
          stopName={station.AddressInfo.Title}
          stopOperator={station.OperatorInfo.Title}
          address={
            `${station.AddressInfo.AddressLine1}, ${station.AddressInfo.Postcode}, ${station.AddressInfo.Town}` ||
            ""
          }
          batteryLevel={90}
          chargingIcon={<IconBattery />}
        />
      ))}
      <Display
        stopName={"Slutmål"}
        stopOperator=''
        address={endAddress}
        batteryLevel={remainingBattery}
        chargingIcon={<IconBattery />}
      ></Display>
    </div>
  );
};

export default ResultContainer;
