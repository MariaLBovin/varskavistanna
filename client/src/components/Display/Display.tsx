import { IChargingStopProps } from "./interface";
import './display.css';

const Display: React.FC<IChargingStopProps> = ({ stopName, address, batteryLevel, chargingIcon }) => {

  const parts = address.split(",").map(part => part.trim());

  const street = parts.length > 1 ? parts.slice(0, -1).join(', ') : parts[0]; 
  const town = parts[parts.length - 1]; 

  return (
    <article className="display-container">
      <div className="display-container-inner">
        <div className="text-container">
          <p className="display-text">{stopName}</p>
          <p className="display-text">{street}</p>
          <p className="display-text">{town}</p>
        </div>
        <p className="display-text">{batteryLevel}%</p>
        <span className="display-icon">{chargingIcon}</span>
      </div>
    </article>
  );
}

export default Display;
