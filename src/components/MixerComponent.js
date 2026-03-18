import * as colorService from '../services/colorService.js';
import * as colorUtils from '../utils/colorUtils.js';

/**
 * @class MixerComponent
 * @description Componente de Presentación para la Mesa de Mezcla.
 * Maneja el DOM y delega la lógica de colorimetría al colorService.
 */
export class MixerComponent {
  constructor(wheelComponent) {
    this.wheelComponent = wheelComponent;
    
    // Colores primarios base (Configuración de UI)
    this.primaries = [
        { hex: '#ff0000', label: 'Rojo Duro' },
        { hex: '#ffff00', label: 'Amarillo Puro' },
        { hex: '#0000ff', label: 'Azul Puro' },
        { hex: '#ffffff', label: 'Luz Absoluta' },
        { hex: '#000000', label: 'Ausencia' }
    ];

    // Cache de selectores del DOM
    this.nodes = {
        slotA: document.getElementById('color-a'),
        slotB: document.getElementById('color-b'),
        slotC: document.getElementById('color-c'),
        slotResult: document.getElementById('color-result'),
        palette: document.getElementById('primary-palette'),
        psychology: document.getElementById('psychology-panel'),
        btnReset: document.getElementById('btn-reset'),
        btnToggle3Color: document.getElementById('btn-toggle-3color'),
        mixRatio: document.getElementById('mix-ratio'),
        ratioLabel: document.getElementById('ratio-label'),
        mixRatioC: document.getElementById('mix-ratio-c'),
        ratioLabelC: document.getElementById('ratio-label-c'),
        lightness: document.getElementById('lightness-slider'),
        lightnessLabel: document.getElementById('lightness-label'),
        hexInputA: document.getElementById('hex-input-a'),
        hexInputB: document.getElementById('hex-input-b'),
        hexInputC: document.getElementById('hex-input-c'),
        slotCWrapper: document.getElementById('slot-c-wrapper'),
        contextPreview: document.getElementById('context-preview'),
        mockBtn: document.getElementById('mock-btn'),
        mockCard: document.getElementById('mock-card'),
        mockBadge: document.getElementById('mock-badge'),
        mockSphere: document.getElementById('mock-sphere')
    };

    this.state = {
        isThreeColorMode: false,
        rawMixHex: 'none',
        activeSlot: this.nodes.slotA
    };

    this.init();
  }

  init() {
    this.renderPalette();
    this.setupEventListeners();
    this.setActiveSlot(this.nodes.slotA);
  }

  setupEventListeners() {
    this.nodes.slotA.addEventListener('click', () => this.setActiveSlot(this.nodes.slotA));
    this.nodes.slotB.addEventListener('click', () => this.setActiveSlot(this.nodes.slotB));
    this.nodes.slotC.addEventListener('click', () => { 
        if(this.state.isThreeColorMode) this.setActiveSlot(this.nodes.slotC); 
    });
    
    this.nodes.btnReset.addEventListener('click', () => this.reset());
    this.nodes.mixRatio.addEventListener('input', () => this.handleUIUpdate());
    this.nodes.mixRatioC.addEventListener('input', () => this.handleUIUpdate());
    this.nodes.lightness.addEventListener('input', () => this.handleLightnessChange());
    this.nodes.btnToggle3Color.addEventListener('click', () => this.toggle3ColorMode());
    
    this.nodes.hexInputA.addEventListener('input', (e) => this.handleHexInput(e, this.nodes.slotA));
    this.nodes.hexInputB.addEventListener('input', (e) => this.handleHexInput(e, this.nodes.slotB));
    this.nodes.hexInputC.addEventListener('input', (e) => this.handleHexInput(e, this.nodes.slotC));
  }

  handleHexInput(e, slot) {
    const val = e.target.value.trim();
    const parsedHex = colorService.parseInput(val);

    if (parsedHex) {
        this.setActiveSlot(slot);
        this.selectColor(parsedHex, parsedHex.toUpperCase());
    } else if (val === '' || val === '#') {
        this.clearSlot(slot);
        this.mixAndRender();
    }
  }

  clearSlot(slot) {
    slot.dataset.color = 'none';
    slot.style.backgroundColor = 'transparent';
    slot.classList.remove('filled');
    const label = slot.id.includes('a') ? 'Color A' : slot.id.includes('b') ? 'Color B' : 'Color C';
    slot.querySelector('.lbl-color').innerText = label;
  }

  toggle3ColorMode() {
    this.state.isThreeColorMode = !this.state.isThreeColorMode;
    const is3 = this.state.isThreeColorMode;
    
    this.nodes.slotCWrapper.classList.toggle('hidden-slot', !is3);
    this.nodes.mixRatioC.parentElement.classList.toggle('hidden-slot', !is3);
    this.nodes.btnToggle3Color.innerText = is3 ? '- Desactivar Módulo 3 Colores' : '+ Módulo 3 Colores';
    
    if (!is3) {
        this.clearSlot(this.nodes.slotC);
        this.nodes.hexInputC.value = '';
        if (this.state.activeSlot === this.nodes.slotC) this.setActiveSlot(this.nodes.slotB);
    } else {
        this.setActiveSlot(this.nodes.slotC);
    }
    this.mixAndRender();
  }

  handleUIUpdate() {
    const rA = parseInt(this.nodes.mixRatio.value, 10);
    this.nodes.ratioLabel.innerText = `${rA}% / ${100 - rA}%`;
    
    const rC = parseInt(this.nodes.mixRatioC.value, 10);
    this.nodes.ratioLabelC.innerText = `Base ${rC}% / C ${100 - rC}%`;

    this.mixAndRender();
  }

  handleLightnessChange() {
    if (this.state.rawMixHex === 'none') return;
    const l = parseInt(this.nodes.lightness.value, 10);
    this.nodes.lightnessLabel.innerText = `Luminosidad: ${l}%`;
    
    const adjusted = colorService.adjustLightness(this.state.rawMixHex, l);
    // Solo actualizamos la visualización del resultado, no el rawMix original
    this.renderResultData({ ...this.lastMixData, hex: adjusted.hex, hsl: adjusted.hsl });
  }

  setActiveSlot(slot) {
    [this.nodes.slotA, this.nodes.slotB, this.nodes.slotC].forEach(s => s.classList.remove('active-slot'));
    slot.classList.add('active-slot');
    this.state.activeSlot = slot;
  }

  renderPalette() {
    this.nodes.palette.innerHTML = '';
    this.primaries.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.style.backgroundColor = color.hex;
      btn.title = color.label;
      btn.addEventListener('click', () => this.selectColor(color.hex, color.label));
      this.nodes.palette.appendChild(btn);
    });
  }

  selectColor(hex, label) {
    const slot = this.state.activeSlot;
    if (!slot) return;

    slot.dataset.color = hex;
    slot.style.backgroundColor = hex;
    slot.querySelector('.lbl-color').innerText = label || hex.toUpperCase();
    slot.classList.add('filled');

    // Update Input
    if (slot === this.nodes.slotA) this.nodes.hexInputA.value = hex.toUpperCase();
    if (slot === this.nodes.slotB) this.nodes.hexInputB.value = hex.toUpperCase();
    if (slot === this.nodes.slotC) this.nodes.hexInputC.value = hex.toUpperCase();

    // Smart Focus Flow
    this.autoFocusNext(slot);
    this.mixAndRender();
  }

  autoFocusNext(currentSlot) {
    if (currentSlot === this.nodes.slotA && this.nodes.slotB.dataset.color === 'none') {
        this.setActiveSlot(this.nodes.slotB);
    } else if (currentSlot === this.nodes.slotB && this.state.isThreeColorMode && this.nodes.slotC.dataset.color === 'none') {
        this.setActiveSlot(this.nodes.slotC);
    }
  }

  mixAndRender() {
    const cA = this.nodes.slotA.dataset.color;
    const cB = this.nodes.slotB.dataset.color;
    const cC = this.nodes.slotC.dataset.color;

    if (cA !== 'none' && cB !== 'none') {
        const colors = [cA, cB];
        const ratios = [parseInt(this.nodes.mixRatio.value, 10) / 100];
        
        if (this.state.isThreeColorMode && cC !== 'none') {
            colors.push(cC);
            ratios.push(parseInt(this.nodes.mixRatioC.value, 10) / 100);
        }

        const data = colorService.processMix(colors, ratios);
        if (data) {
            this.state.rawMixHex = data.hex;
            this.lastMixData = data; // Store for lightness adjustments
            
            // Sync UI
            this.nodes.lightness.value = Math.round(data.hsl.l);
            this.nodes.lightnessLabel.innerText = `Luminosidad: ${Math.round(data.hsl.l)}%`;
            this.nodes.lightness.disabled = false;
            
            this.renderResultData(data);
        }
    }
  }

  renderResultData(data) {
    const { hex, hsl, psychology, harmonies } = data;
    
    // 1. Slot Result
    this.nodes.slotResult.style.backgroundColor = hex;
    this.nodes.slotResult.dataset.color = hex;
    this.nodes.slotResult.querySelector('.lbl-color').innerText = hex.toUpperCase();
    this.nodes.slotResult.classList.add('filled');

    // 2. Psychology and Harmonies
    this.renderAnalysisPanel(hex, psychology, harmonies);

    // 3. Context Preview
    this.renderContextPreview(hex, hsl);

    // 4. Wheel Update
    if (this.wheelComponent) {
        this.wheelComponent.showHarmonies(hsl.h);
    }

    // 5. Historial update logic here if needed
    this.addResultToPalette(hex, 'Mezcla');
  }

  renderAnalysisPanel(hex, psych, harmonies) {
    const { complementary: comp, triads } = harmonies;
    this.nodes.psychology.innerHTML = `
        <div class="analysis-content">
            <h3>${psych.name} - ${hex.toUpperCase()}</h3>
            <p><strong>Análisis E-E-A-T:</strong> ${psych.meaning}</p>
            <div class="harmony-grid">
               ${this.createHarmonyItemHTML(hex, 'Base')}
               ${this.createHarmonyItemHTML(comp, 'Comp.')}
               ${triads.map((t, i) => this.createHarmonyItemHTML(t, `Tríada ${i+1}`)).join('')}
            </div>
        </div>
    `;

    this.nodes.psychology.querySelectorAll('.harmony-item').forEach(item => {
        item.addEventListener('click', () => this.selectColor(item.dataset.hex, item.dataset.label));
    });
  }

  createHarmonyItemHTML(hex, label) {
    return `
        <div class="harmony-item" data-hex="${hex}" data-label="${label}">
            <div class="harmony-color" style="background: ${hex};" title="Usar ${label} (${hex})"></div>
            <span class="harmony-label">${label}<br/>${hex.toUpperCase()}</span>
        </div>
    `;
  }

  renderContextPreview(hex, hsl) {
    if (!this.nodes.contextPreview) return;
    this.nodes.contextPreview.style.display = 'block';

    const isLight = hsl.l > 60;
    const textColor = isLight ? '#121212' : '#ffffff';

    if(this.nodes.mockBtn) {
        this.nodes.mockBtn.style.backgroundColor = hex;
        this.nodes.mockBtn.style.color = textColor;
    }
    if(this.nodes.mockCard) this.nodes.mockCard.style.borderTop = `5px solid ${hex}`;
    if(this.nodes.mockBadge) {
        this.nodes.mockBadge.style.backgroundColor = hex;
        this.nodes.mockBadge.style.color = textColor;
    }
    
    if(this.nodes.mockSphere) {
        const light = colorUtils.hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 30));
        const shadow = colorUtils.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 40));
        this.nodes.mockSphere.style.background = `radial-gradient(circle at 35% 35%, ${light} 0%, ${hex} 40%, ${shadow} 90%)`;
    }
  }

  addResultToPalette(hex, label) {
    const exists = this.primaries.find(p => p.hex.toLowerCase() === hex.toLowerCase());
    if (!exists) {
        this.primaries.push({ hex, label });
        this.renderPalette();
    }
  }

  reset() {
    [this.nodes.slotA, this.nodes.slotB, this.nodes.slotC, this.nodes.slotResult].forEach(s => this.clearSlot(s));
    this.nodes.psychology.innerHTML = '<p class="empty-state">Inicia una mezcla para ver el análisis profesional...</p>';
    if (this.wheelComponent && this.wheelComponent.container) this.wheelComponent.container.innerHTML = '';
    
    this.nodes.mixRatio.value = 50;
    this.nodes.ratioLabel.innerText = '50% / 50%';
    this.nodes.mixRatioC.value = 50;
    this.nodes.ratioLabelC.innerText = 'Base 50% / C 50%';
    this.nodes.lightness.value = 50;
    this.nodes.lightnessLabel.innerText = 'Luminosidad: --%';
    this.nodes.lightness.disabled = true;
    this.state.rawMixHex = 'none';
    
    this.nodes.hexInputA.value = '';
    this.nodes.hexInputB.value = '';
    this.nodes.hexInputC.value = '';
    if (this.nodes.contextPreview) this.nodes.contextPreview.style.display = 'none';

    this.setActiveSlot(this.nodes.slotA);
  }
}
