export class WheelController {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  showHarmonies(baseHue) {
    if (!this.container) return;
    this.container.innerHTML = ''; 
    
    // Generar un slice angular CSS (Pedazo visible de pastel)
    const createSlice = (h, isMain) => {
      const slice = document.createElement('div');
      slice.style.position = 'absolute';
      const width = isMain ? 95 : 65; // Margen exterior ensanchado
      slice.style.width = `${width}px`;
      slice.style.height = '50%'; // Cobertura desde el arco circular al pivote del bloque principal
      
      slice.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
      // Vector de recorte geométrico en V centrado
      slice.style.clipPath = 'polygon(50% 100%, 0 0, 100% 0)'; 
      
      slice.style.top = '0';
      slice.style.left = `calc(50% - ${width/2}px)`; // Pivotado simétricamente con calc()
      slice.style.transformOrigin = 'bottom center';
      slice.style.transform = `rotate(${h}deg)`;
      slice.style.zIndex = isMain ? '10' : '5';
      slice.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      
      this.container.appendChild(slice);
    };

    createSlice(baseHue, true);
    createSlice((baseHue + 180) % 360, false);
    createSlice((baseHue + 120) % 360, false);
    createSlice((baseHue + 240) % 360, false);
  }
}
