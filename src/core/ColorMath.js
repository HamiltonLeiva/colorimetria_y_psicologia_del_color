export class ColorMath {
  /**
   * Extracción asimétrica de valores RGB desde Hexadecimal.
   */
  static hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  /**
   * Transmutación base-10 integral hacia Base-16 Hexcodes.
   */
  static rgbToHex(r, g, b) {
    const toHex = c => Math.round(c).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Algoritmo de normalización hacia Espacio HSL Cilíndrico (Hue, Saturation, Lightness).
   */
  static rgbToHsl(r, g, b) {
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
   * Reversión de coordenadas polares (HSL) devuelta a cubos RGB proyectados.
   */
  static hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
  }

  static hslToHex(h, s, l) {
    const { r, g, b } = this.hslToRgb(h, s, l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Matemáticas Artísticas: Color Complementario (Delta 180 grados).
   */
  static getComplementary(hex) {
    const { r, g, b } = this.hexToRgb(hex);
    const { h, s, l } = this.rgbToHsl(r, g, b);
    return this.hslToHex((h + 180) % 360, s, l);
  }

  /**
   * Matemáticas Artísticas: Armonía Triádica en círculo (Vector 1: +120d, Vector 2: +240d).
   */
  static getTriadic(hex) {
    const { r, g, b } = this.hexToRgb(hex);
    const { h, s, l } = this.rgbToHsl(r, g, b);
    return [
      this.hslToHex((h + 120) % 360, s, l),
      this.hslToHex((h + 240) % 360, s, l)
    ];
  }
}
