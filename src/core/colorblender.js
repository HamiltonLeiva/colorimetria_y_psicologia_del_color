import * as colorUtils from '../utils/colorutils.js';

/**
 * @module colorBlender
 * @description Motor de mezcla sustractiva (pigmentos reales).
 */
export class ColorBlender {
  /**
   * Mezcla dos colores simulando pigmentos físicos (Modelo Sustractivo).
   * @param {string} hex1 
   * @param {string} hex2 
   * @param {number} ratioA - Proporción del primer color (0 a 1).
   * @returns {string} Resultado en Hex.
   */
  /**
   * Mezcla tres o más colores usando pesos individuales (Modelo Sustractivo CMYK).
   * CMYK es el estándar para pigmentos físicos (cian, magenta, amarillo, negro).
   * @param {string[]} hexColors - Array de colores Hex.
   * @param {number[]} weights - Array de pesos (0-100).
   * @returns {string} Resultado en Hex.
   */
  static mixMultiplePigments(hexColors, weights) {
    if (!hexColors || hexColors.length === 0) return '#000000';
    
    // Si solo hay un color, devolverlo
    if (hexColors.length === 1) return hexColors[0];
    
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return hexColors[0];

    let sumC = 0, sumM = 0, sumY = 0, sumK = 0;

    hexColors.forEach((hex, i) => {
      const rgb = colorUtils.hexToRgb(hex);
      const w = weights[i] / totalWeight;
      
      // Convert RGB to CMYK
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;
      
      const k = 1 - Math.max(r, g, b);
      const c = (k === 1) ? 0 : (1 - r - k) / (1 - k);
      const m = (k === 1) ? 0 : (1 - g - k) / (1 - k);
      const y = (k === 1) ? 0 : (1 - b - k) / (1 - k);
      
      sumC += c * w;
      sumM += m * w;
      sumY += y * w;
      sumK += k * w;
    });

    // Convert CMYK back to RGB
    const r = 255 * (1 - sumC) * (1 - sumK);
    const g = 255 * (1 - sumM) * (1 - sumK);
    const b = 255 * (1 - sumY) * (1 - sumK);

    return colorUtils.rgbToHex(r, g, b);
  }

  static mixPigments(hex1, hex2, ratioA = 0.5) {
    return this.mixMultiplePigments([hex1, hex2], [ratioA * 100, (1 - ratioA) * 100]);
  }
}
