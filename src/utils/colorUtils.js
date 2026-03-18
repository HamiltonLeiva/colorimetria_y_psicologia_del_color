/**
 * @module colorUtils
 * @description Utilidades matemáticas puras para manipulación de colores en espacios Hex, RGB y HSL.
 */

/**
 * Convierte un código Hexadecimal a un objeto RGB.
 * @param {string} hex - Color en formato #RRGGBB o #RGB.
 * @returns {{r: number, g: number, b: number}}
 */
export function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Convierte valores RGB a un código Hexadecimal.
 * @param {number} r - Rojo (0-255).
 * @param {number} g - Verde (0-255).
 * @param {number} b - Azul (0-255).
 * @returns {string} Hexadecimal #RRGGBB.
 */
export function rgbToHex(r, g, b) {
  const toHex = c => Math.round(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convierte valores RGB a espacio HSL.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{h: number, s: number, l: number}}
 */
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convierte valores HSL a RGB.
 * @param {number} h - Hue (0-360).
 * @param {number} s - Saturation (0-100).
 * @param {number} l - Lightness (0-100).
 * @returns {{r: number, g: number, b: number}}
 */
export function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
}

/**
 * Convierte HSL directamente a Hexadecimal.
 */
export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

/**
 * Calcula el color complementario (opuesto 180°).
 * @param {string} hex
 * @returns {string}
 */
export function getComplementary(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return hslToHex((h + 180) % 360, s, l);
}

/**
 * Genera una armonía triádica.
 * @param {string} hex
 * @returns {string[]}
 */
export function getTriadic(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l)
  ];
}

/**
 * Ajusta la luminosidad de un color hex sin cambiar el tono ni saturación.
 * @param {string} hex
 * @param {number} newLightness (0-100)
 * @returns {string}
 */
export function setLightness(hex, newLightness) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s } = rgbToHsl(r, g, b);
    return hslToHex(h, s, newLightness);
}
