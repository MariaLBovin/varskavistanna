
import { useState } from 'react';
import './App.css';
import RouteHandler from './components/Map/RouteHandler';
import Modal from './components/Modal/Modal';


function App() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        console.log(isModalOpen);
        
        setIsModalOpen(false);
    };
    return (
        <>
        <RouteHandler/>
       <Modal children={undefined} isOpen={isModalOpen} onClose={closeModal}/>
        </>
        
    );

}

export default App;