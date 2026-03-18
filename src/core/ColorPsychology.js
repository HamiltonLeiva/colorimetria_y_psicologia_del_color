export class ColorPsychology {
  /**
   * Diccionario de Psicología del Color referenciando arcos de Hue (Tono).
   */
  static getMeaning(hue) {
    if (hue < 15 || hue >= 345) return { name: "Rojo (Energía/Pasión)", meaning: "Asociado a la acción, el calor y el peligro. En diseño estimula respuestas rápidas y eleva la intensidad visual del proyecto." };
    if (hue >= 15 && hue < 45) return { name: "Naranja (Creatividad)", meaning: "Transmite entusiasmo, juventud y accesibilidad. Es altamente cálido sin la urgencia agresiva del componente rojo." };
    if (hue >= 45 && hue < 75) return { name: "Amarillo (Precaución/Alegría)", meaning: "Efectivo para atraer atención directa. Representa la luz, el intelecto y el optimismo puro." };
    if (hue >= 75 && hue < 165) return { name: "Verde (Crecimiento/Armonía)", meaning: "Relajante para el ojo humano. Directamente asociado a finanzas, naturaleza, sostenibilidad y equilibrio." };
    if (hue >= 165 && hue < 255) return { name: "Azul (Confianza/Lógica)", meaning: "Transmite profesionalidad, seguridad corporativa y calma reflexiva. Altamente usado en tecnología, B2B e IT." };
    if (hue >= 255 && hue < 315) return { name: "Morado (Lujo/Ambición)", meaning: "Asociado al misterio, la realeza y lo premium. Sugiere creatividad alta y profundidad conceptual." };
    if (hue >= 315 && hue < 345) return { name: "Rosa/Magenta (Innovación)", meaning: "Dependiendo de su saturación, sugiere disrupción, rebeldía (magenta fuerte) o delicadeza (tonos pastel)." };
    
    return { name: "Neutral (Gris)", meaning: "Balance, formalidad y neutralidad estructural." };
  }
}
