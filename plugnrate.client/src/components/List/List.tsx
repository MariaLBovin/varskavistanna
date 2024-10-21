import { ListComponentProps } from "./interface";
import './list.css';

const ListComponent: React.FC<ListComponentProps> = ({
    items,
    onItemClick,
    selectedItem,
  }) => {
    return (
      <ul className="list">
        {items.map((item) => (
          <li key={item}>
            <button
              onClick={() => onItemClick(item)}
              className={selectedItem === item ? 'selected' : ''}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default ListComponent;