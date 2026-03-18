import { ColorBlender } from '../core/ColorBlender.js';
import { ColorMath } from '../core/ColorMath.js';
import { ColorPsychology } from '../core/ColorPsychology.js';

export class MixerController {
  constructor(wheelController) {
    this.wheelController = wheelController;
    
    // Colores primarios base
    this.primaries = [
        { hex: '#ff0000', label: 'Rojo Duro' },
        { hex: '#ffff00', label: 'Amarillo Puro' },
        { hex: '#0000ff', label: 'Azul Puro' },
        { hex: '#ffffff', label: 'Luz Absoluta (B)' },
        { hex: '#000000', label: 'Ausencia (N)' }
    ];

    // Selectores del DOM
    this.slotA = document.getElementById('color-a');
    this.slotB = document.getElementById('color-b');
    this.slotResult = document.getElementById('color-result');
    this.paletteContainer = document.getElementById('primary-palette');
    this.psychologyPanel = document.getElementById('psychology-panel');
    this.btnReset = document.getElementById('btn-reset');

    this.activeSlot = this.slotA;
    this.init();
  }

  init() {
    this.renderPalette();
    
    // Asignar escuchadores
    this.slotA.addEventListener('click', () => this.setActiveSlot(this.slotA));
    this.slotB.addEventListener('click', () => this.setActiveSlot(this.slotB));
    this.btnReset.addEventListener('click', () => this.reset());
    
    this.setActiveSlot(this.slotA);
  }

  /**
   * Cambia el enfoque interactivo (border azul reflectante) al contenedor que va a ser inyectado.
   */
  setActiveSlot(slot) {
    this.slotA.style.borderColor = 'var(--glass-border)';
    this.slotB.style.borderColor = 'var(--glass-border)';
    slot.style.borderColor = 'var(--accent)';
    this.activeSlot = slot;
  }

  /**
   * Renderiza el abanico de pinturas primarias.
   */
  renderPalette() {
    this.paletteContainer.innerHTML = '';
    this.primaries.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.style.backgroundColor = color.hex;
      btn.title = color.label;
      btn.addEventListener('click', () => this.selectColor(color.hex, color.label));
      this.paletteContainer.appendChild(btn);
    });
  }

  /**
   * Inyecta un color pulsado en el Slot activo y lo evalúa para mezclado.
   */
  selectColor(hex, label) {
    if (!this.activeSlot) return;

    this.activeSlot.dataset.color = hex;
    this.activeSlot.style.backgroundColor = hex;
    this.activeSlot.querySelector('.lbl-color').innerText = label || hex;
    this.activeSlot.classList.add('filled');

    // Flujo inteligente: Si inyecta A, saltamos focus a B automáticamente.
    if (this.activeSlot === this.slotA && this.slotB.dataset.color === 'none') {
        this.setActiveSlot(this.slotB);
    }
    
    this.mixAndRender();
  }

  /**
   * Orquesta Motor Sustractivo -> Analítica -> UI
   */
  mixAndRender() {
    const c1 = this.slotA.dataset.color;
    const c2 = this.slotB.dataset.color;
    
    if (c1 !== 'none' && c2 !== 'none') {
        // Core Logic
        const resultHex = ColorBlender.mixPigments(c1, c2);
        
        // Guardar el color resultante en la paleta de selección dinámicamente
        this.addColorToPalette(resultHex, `Mix`);
        
        // Pinta resultado
        this.slotResult.style.backgroundColor = resultHex;
        this.slotResult.dataset.color = resultHex;
        this.slotResult.querySelector('.lbl-color').innerText = resultHex.toUpperCase();
        
        // Ejecución de Psicología y Armonía Geométrica
        const rgb = ColorMath.hexToRgb(resultHex);
        const { h } = ColorMath.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const psych = ColorPsychology.getMeaning(h);
        
        const comp = ColorMath.getComplementary(resultHex);
        const triads = ColorMath.getTriadic(resultHex);

        this.psychologyPanel.innerHTML = `
            <div class="analysis-content">
                <h3>${psych.name} - ${resultHex.toUpperCase()}</h3>
                <p><strong>Significado Comercial:</strong> ${psych.meaning}</p>
                
                <div style="display:flex; gap: 15px; margin-top: 20px;">
                   <div>
                       <div style="width: 40px; height: 40px; background: ${resultHex}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);"></div>
                       <small style="display:block; text-align:center; color: var(--text-secondary); margin-top:5px;">Base</small>
                   </div>
                   <div>
                       <div style="width: 40px; height: 40px; background: ${comp}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);"></div>
                       <small style="display:block; text-align:center; color: var(--text-secondary); margin-top:5px;">Comp.</small>
                   </div>
                   ${triads.map((hex, i) => `
                   <div>
                       <div style="width: 40px; height: 40px; background: ${hex}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);"></div>
                       <small style="display:block; text-align:center; color: var(--text-secondary); margin-top:5px;">Tríada ${i+1}</small>
                   </div>
                   `).join('')}
                </div>
            </div>
        `;

        if (this.wheelController) {
            this.wheelController.showHarmonies(h);
        }
    }
  }

  addColorToPalette(hex, label) {
    const exists = this.primaries.find(p => p.hex.toLowerCase() === hex.toLowerCase());
    if (!exists) {
        this.primaries.push({ hex, label });
        this.renderPalette();
    }
  }

  reset() {
    [this.slotA, this.slotB].forEach((s, idx) => {
        s.dataset.color = 'none';
        s.style.backgroundColor = 'transparent';
        s.querySelector('.lbl-color').innerText = idx === 0 ? 'Color A' : 'Color B';
        s.classList.remove('filled');
    });

    this.slotResult.dataset.color = 'none';
    this.slotResult.style.backgroundColor = 'transparent';
    this.slotResult.querySelector('.lbl-color').innerText = 'Resultado';

    this.psychologyPanel.innerHTML = '<p class="empty-state">Mezcla o selecciona un color para ver su análisis teórico y relacional...</p>';
    
    if (this.wheelController && this.wheelController.container) {
        this.wheelController.container.innerHTML = '';
    }
    
    this.setActiveSlot(this.slotA);
  }
}
