/**
 * @class WheelComponent
 * @description Componente visual para renderizar el círculo cromático y armonías.
 */
export class WheelComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renderiza las armonías visuales en el círculo cromático.
   * @param {number} baseHue - Tono base en grados (0-360).
   */
  showHarmonies(baseHue) {
    if (!this.container) return;
    this.container.innerHTML = ''; 
    
    // Helper para generar una "rebanada" (slice) angular en el círculo
    const createSlice = (h, isMain) => {
      const slice = document.createElement('div');
      slice.className = `wheel-slice ${isMain ? 'main-slice' : ''}`;
      
      const width = isMain ? 75 : 50; 
      slice.style.width = `${width}px`;
      slice.style.height = '50%';
      slice.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
      slice.style.left = `calc(50% - ${width/2}px)`;
      slice.style.transform = `rotate(${h}deg)`;
      
      this.container.appendChild(slice);
    };

    // Renderizar Base, Complementario y Tríada
    createSlice(baseHue, true);
    createSlice((baseHue + 180) % 360, false);
    createSlice((baseHue + 120) % 360, false);
    createSlice((baseHue + 240) % 360, false);
  }
}
