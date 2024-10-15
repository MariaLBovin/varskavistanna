import Display from "../components/Display/Display";
import IconBattery from "../assets/icons/IconBattery";
import { IResultContainerProps } from "../interfaces/IResultContainer";

const ResultContainer: React.FC<IResultContainerProps> = ({
  chargingStops,
  remainingBattery,
  startAdress,
  endAddress,
  finalBattery
}) => {
  console.log(remainingBattery);
  
  return (
    <div className="results-container">
      <Display
        stopName={"Min positon"}
        stopOperator=''
        address={startAdress}
        batteryLevel={100}
        chargingIcon={<IconBattery />}
      ></Display>
      {chargingStops.map((station, index) => (
        <Display
          key={station.id ?? ''}
          stopName={station.AddressInfo.Title ?? ''}
          stopOperator={
            station.OperatorInfo.Title === "(Unknown Operator)" 
              ? '' 
              : station.OperatorInfo.Title ?? ''
          }
          address={
            `${station.AddressInfo.AddressLine1 ?? ''}, ${station.AddressInfo.Postcode ?? ''}, ${station.AddressInfo.Town ?? ''}` ||
            ""
          }
          batteryLevel={remainingBattery[index] || 0}
          chargingIcon={<IconBattery />}
        />
      ))}
      <Display
        stopName={"Slutdestination"}
        stopOperator=''
        address={endAddress}
        batteryLevel={finalBattery}
        chargingIcon={<IconBattery />}
      ></Display>
    </div>
  );
};

export default ResultContainer;
