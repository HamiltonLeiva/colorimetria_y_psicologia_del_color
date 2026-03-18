import { describe, it, expect } from 'vitest';
import * as colorUtils from '../../utils/colorUtils.js';

describe('colorUtils - Utilidades de Color', () => {
    it('debe convertir Hex a RGB correctamente', () => {
        const rgb = colorUtils.hexToRgb('#ffffff');
        expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('debe convertir RGB a Hex correctamente', () => {
        const hex = colorUtils.rgbToHex(255, 0, 0);
        expect(hex.toLowerCase()).toBe('#ff0000');
    });

    it('debe calcular el complementario correcto', () => {
        // Rojo -> Cyan
        const comp = colorUtils.getComplementary('#ff0000');
        expect(comp.toLowerCase()).toBe('#00ffff');
    });

    it('debe ajustar la luminosidad sin cambiar el matiz', () => {
        const hex = '#ff0000'; // Rojo puro (L=50)
        const darker = colorUtils.setLightness(hex, 20);
        const rgb = colorUtils.hexToRgb(darker);
        const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        expect(Math.round(hsl.l)).toBe(20);
        expect(Math.round(hsl.h)).toBe(0);
    });
});
