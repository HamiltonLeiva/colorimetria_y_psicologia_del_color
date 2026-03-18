import './style.css'
import { WheelController } from './components/WheelController.js';
import { MixerController } from './components/MixerController.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Arquitectura Base Inicializada. System Engine en verde.");
    
    // Inyección de Dependencias
    const wheelRef = new WheelController('wheel-container');
    const mixerRef = new MixerController(wheelRef);
});
