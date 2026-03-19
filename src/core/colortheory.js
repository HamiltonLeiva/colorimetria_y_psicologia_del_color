/**
 * @module colorTheory
 * @description Lógica de dominio sobre psicología y teoría del color.
 */

const COLOR_MEANINGS = [
    { range: [345, 15], name: "Rojo (Energía/Pasión)", meaning: "Asociado a la acción, el calor y el peligro. En diseño estimula respuestas rápidas y eleva la intensidad visual del proyecto." },
    { range: [15, 45], name: "Naranja (Creatividad)", meaning: "Transmite entusiasmo, juventud y accesibilidad. Es altamente cálido sin la urgencia agresiva del componente rojo." },
    { range: [45, 75], name: "Amarillo (Precaución/Alegría)", meaning: "Efectivo para atraer atención directa. Representa la luz, el intelecto y el optimismo puro." },
    { range: [75, 165], name: "Verde (Crecimiento/Armonía)", meaning: "Relajante para el ojo humano. Directamente asociado a finanzas, naturaleza, sostenibilidad y equilibrio." },
    { range: [165, 255], name: "Azul (Confianza/Lógica)", meaning: "Transmite profesionalidad, seguridad corporativa y calma reflexiva. Altamente usado en tecnología, B2B e IT." },
    { range: [255, 315], name: "Morado (Lujo/Ambición)", meaning: "Asociado al misterio, la realeza y lo premium. Sugiere creatividad alta y profundidad conceptual." },
    { range: [315, 345], name: "Rosa/Magenta (Innovación)", meaning: "Dependiendo de su saturación, sugiere disrupción, rebeldía (magenta fuerte) o delicadeza (tonos pastel)." }
];

/**
 * Obtiene el significado psicológico basado en el Tono (Hue).
 * @param {number} hue - Valor entre 0 y 360.
 * @returns {{name: string, meaning: string}}
 */
export function getColorMeaning(hue) {
    const matched = COLOR_MEANINGS.find(({ range }) => {
        const [min, max] = range;
        if (min > max) { // Rango que cruza el 0/360 (Rojo)
            return hue >= min || hue < max;
        }
        return hue >= min && hue < max;
    });

    return matched ? { name: matched.name, meaning: matched.meaning } : { name: "Neutral (Gris)", meaning: "Balance, formalidad y neutralidad estructural." };
}
