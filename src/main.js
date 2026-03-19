import { WheelComponent } from './components/WheelComponent.js';
import { MixerComponent } from './components/MixerComponent.js';

/**
 * Punto de entrada de la aplicación.
 * Implementa Inyección de Dependencias manual para orquestar los componentes.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Arquitectura Clean inicializada. Entorno de Laboratorio en Operación.");
    
    // Inicialización de componentes UI
    const wheel = new WheelComponent('wheel-container');
    const mixer = new MixerComponent(wheel);

    // Podemos exponerlo globalmente para debugging si es necesario, 
    // pero idealmente se mantiene encapsulado.
    window.app = { mixer, wheel };
});
