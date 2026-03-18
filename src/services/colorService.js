import * as colorUtils from '../utils/colorUtils.js';
import * as colorTheory from '../core/colorTheory.js';
import { ColorBlender } from '../core/colorBlender.js';

/**
 * @module colorService
 * @description Capa de servicio que orquestra la lógica de colorimetría para la UI.
 */

/**
 * Procesa la mezcla de colores y devuelve un análisis completo (Hex, HSL, Significado, Armonías).
 * @param {string[]} colors - Array de colores Hex.
 * @param {number[]} ratios - Array de proporciones (0 a 1).
 * @returns {Object} Datos estructurados para la vista.
 */
export function processMix(colors, ratios) {
    if (!colors || colors.length === 0) return null;

    let resultHex = colors[0];
    
    // Mezcla secuencial (soporta 2 o 3 colores)
    if (colors.length >= 2) {
        resultHex = ColorBlender.mixPigments(colors[0], colors[1], ratios[0]);
        if (colors.length === 3) {
            // Nota: Aquí se asume una proporción base vs el tercer color
            const ratioBase = ratios[1] || 0.5;
            resultHex = ColorBlender.mixPigments(resultHex, colors[2], ratioBase);
        }
    }

    const rgb = colorUtils.hexToRgb(resultHex);
    const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const psychology = colorTheory.getColorMeaning(hsl.h);
    const complementary = colorUtils.getComplementary(resultHex);
    const triads = colorUtils.getTriadic(resultHex);

    return {
        hex: resultHex,
        rgb,
        hsl,
        psychology,
        harmonies: {
            complementary,
            triads
        }
    };
}

/**
 * Ajusta la luminosidad de un color y actualiza su análisis.
 */
export function adjustLightness(hex, l) {
    const newHex = colorUtils.setLightness(hex, l);
    const rgb = colorUtils.hexToRgb(newHex);
    const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    return {
        hex: newHex,
        hsl
    };
}

/**
 * Helper para validar entradas de color (Hex o RGB string).
 */
export function parseInput(val) {
    val = val.trim();
    // RGB a Hex
    const rgbMatch = val.match(/^(?:rgb\()?(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\)?$/i);
    if (rgbMatch) {
         const r = parseInt(rgbMatch[1], 10);
         const g = parseInt(rgbMatch[2], 10);
         const b = parseInt(rgbMatch[3], 10);
         if (r <= 255 && g <= 255 && b <= 255) return colorUtils.rgbToHex(r, g, b);
    }
    
    // Hex robusto
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
        if (val.length === 4) return '#' + val[1]+val[1] + val[2]+val[2] + val[3]+val[3];
        return val;
    }
    return null;
}
