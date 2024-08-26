
import { useState } from 'react';
import './App.css';
import RouteHandler from './components/Map/RouteHandler';
import Modal from './components/Modal/Modal';
import Input from './components/Input/Input';


function App() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        console.log(isModalOpen);
        
        setIsModalOpen(false);
    };
    return (
        <>
        <RouteHandler/>
        <Modal isOpen={isModalOpen} onClose={closeModal}>

            <Input placeholder={''} onSubmit={function (address: string): void {
                    throw new Error('Function not implemented.');
                } }></Input>
        </Modal>
        </>
        
    );

}

export default App;