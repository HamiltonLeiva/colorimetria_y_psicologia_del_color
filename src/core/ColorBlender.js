import * as colorUtils from '../utils/colorUtils.js';

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
  static mixPigments(hex1, hex2, ratioA = 0.5) {
    if (hex1 === hex2) return hex1;
    if (hex1 === 'none' || !hex1) return hex2;
    if (hex2 === 'none' || !hex2) return hex1;

    const c1 = colorUtils.hexToRgb(hex1);
    const c2 = colorUtils.hexToRgb(hex2);
    
    const hsl1 = colorUtils.rgbToHsl(c1.r, c1.g, c1.b);
    const hsl2 = colorUtils.rgbToHsl(c2.r, c2.g, c2.b);

    const ratioB = 1 - ratioA;

    let h1 = hsl1.h;
    let h2 = hsl2.h;
    
    // Shortest Path en el círculo cromático
    if (Math.abs(h1 - h2) > 180) {
        if (h1 < h2) h1 += 360;
        else h2 += 360;
    }

    let mixedH = (h1 * ratioA + h2 * ratioB) % 360;
    if (mixedH < 0) mixedH += 360;

    // Lógica RYB (Red-Yellow-Blue) para mezclas artísticas
    const isBlue1 = hsl1.h > 200 && hsl1.h < 260;
    const isYellow1 = hsl1.h > 40 && hsl1.h < 80;
    const isBlue2 = hsl2.h > 200 && hsl2.h < 260;
    const isYellow2 = hsl2.h > 40 && hsl2.h < 80;

    const isRed1 = hsl1.h < 20 || hsl1.h > 340;
    const isRed2 = hsl2.h < 20 || hsl2.h > 340;

    let mixedL = (hsl1.l * ratioA + hsl2.l * ratioB);

    // Ajustes de saturación y brillo para simular pérdida de luz en mezcla física
    if ((isBlue1 && isYellow2) || (isYellow1 && isBlue2)) {
        mixedH = 120; // Verde
        mixedL *= 0.90;
    } else if ((isRed1 && isYellow2) || (isYellow1 && isRed2)) {
        mixedH = 35; // Naranja
    } else {
        mixedL *= 0.90;
    }

    const mixedS = (hsl1.s * ratioA + hsl2.s * ratioB);

    return colorUtils.hslToHex(mixedH, mixedS, mixedL);
  }
}
