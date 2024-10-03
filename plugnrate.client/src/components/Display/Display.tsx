import { IChargingStopProps } from "./interface";
import './display.css';

const Display: React.FC<IChargingStopProps> = ({ stopName, stopOperator, address, batteryLevel, chargingIcon }) => {
  console.log(address);
  
  const [street, postalCode, town] = address.split(",").map(part => part.trim());

  return (
    <article className="display-container">
      <div className="display-container-inner">
        <div className="text-container">
          <p className="display-text">{stopName}</p>
          <p className="display-text">{stopOperator}</p>
          <p className="display-text">{street}</p>
          <p className="display-text">{postalCode} {town}</p>
        </div>
        <p className="display-text">{batteryLevel}%</p>
        <span className="display-icon">{chargingIcon}</span>
      </div>
    </article>
  );
}

export default Display;
