import { ColorMath } from './ColorMath.js';

export class ColorBlender {
  static mixPigments(hex1, hex2, ratioA = 0.5) {
    if (hex1 === hex2) return hex1;
    if (hex1 === 'none' || !hex1) return hex2;
    if (hex2 === 'none' || !hex2) return hex1;

    const c1 = ColorMath.hexToRgb(hex1);
    const c2 = ColorMath.hexToRgb(hex2);
    
    const hsl1 = ColorMath.rgbToHsl(c1.r, c1.g, c1.b);
    const hsl2 = ColorMath.rgbToHsl(c2.r, c2.g, c2.b);

    const ratioB = 1 - ratioA;

    let h1 = hsl1.h;
    let h2 = hsl2.h;
    
    // Shortest Path en el cilindro cromático de 360 grados
    if (Math.abs(h1 - h2) > 180) {
        if (h1 < h2) h1 += 360;
        else h2 += 360;
    }

    let mixedH = (h1 * ratioA + h2 * ratioB) % 360;
    if (mixedH < 0) mixedH += 360;

    // Evaluaciones RYB espaciales
    const isBlue1 = hsl1.h > 200 && hsl1.h < 260;
    const isYellow1 = hsl1.h > 40 && hsl1.h < 80;
    const isBlue2 = hsl2.h > 200 && hsl2.h < 260;
    const isYellow2 = hsl2.h > 40 && hsl2.h < 80;

    const isRed1 = hsl1.h < 20 || hsl1.h > 340;
    const isRed2 = hsl2.h < 20 || hsl2.h > 340;

    let mixedL = (hsl1.l * ratioA + hsl2.l * ratioB);

    if ((isBlue1 && isYellow2) || (isYellow1 && isBlue2)) {
        mixedH = 120; // Válvula RYB al Verde Tradicional
        mixedL = mixedL * 0.90; // Corrección lumínica normal
    } else if ((isRed1 && isYellow2) || (isYellow1 && isRed2)) {
        mixedH = 35; // Naranja Vibrante Natural
        // EXCEPCIÓN LUMÍNICA: Evitamos multiplicar por 0.90 para preservar la pureza luz de Naranja.
    } else {
        mixedL = mixedL * 0.90; // Decaimiento sustractivo base aplicable al resto
    }

    const mixedS = (hsl1.s * ratioA + hsl2.s * ratioB);

    return ColorMath.hslToHex(mixedH, mixedS, mixedL);
  }
}
