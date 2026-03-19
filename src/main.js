import { WheelComponent } from './components/wheelcomponent.js';
import { MixerComponent } from './components/mixercomponent.js';

/**
 * Punto de entrada de la aplicación.
 * Implementa Inyección de Dependencias manual para orquestar los componentes.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Arquitectura Clean inicializada. Entorno de Laboratorio en Operación.");
    
    try {
        // Validación de existencia de contenedores críticos
        const wheelContainer = document.getElementById('wheel-container');
        const mixerInterface = document.getElementById('mixer-interface');

        if (!wheelContainer || !mixerInterface) {
            throw new Error("Error Crítico: No se encontraron los contenedores base en el DOM.");
        }

        // Inicialización de componentes UI
        const wheel = new WheelComponent('wheel-container');
        const mixer = new MixerComponent(wheel);

        // Exposición global controlada para telemetría y debugging
        window.app = { mixer, wheel };
        
        console.log("Componentes vinculados exitosamente.");
    } catch (error) {
        console.error("Fallo estructural en el inicio de la aplicación:", error.message);
        // Feedback visual en caso de error catastrófico
        document.body.innerHTML += `
            <div style="position:fixed; top:0; left:0; width:100%; padding:1rem; background:#7f1d1d; color:white; text-align:center; z-index:9999;">
                Error de inicialización: ${error.message}
            </div>
        `;
    }
});
