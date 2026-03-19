# Arquitectura: App Web de Colorimetría (Clean Architecture)

Este documento detalla la estructura y las decisiones técnicas tomadas para
garantizar un proyecto escalable, mantenible y profesional.

## 1. Diseño por Capas (Separation of Concerns)

Se ha implementado una arquitectura por capas para separar la lógica de negocio
de la interfaz de usuario:

- **Capa de Utilidades (`/src/utils`)**: Funciones puras de conversión
  matemática y manipulación de color (Hex, RGB, HSL). Sin dependencias de
  dominio.
- **Capa de Dominio (`/src/core`)**: Contiene las reglas de negocio puras.
  - `colorTheory.js`: Psicología y relaciones teóricas.
  - `colorBlender.js`: Motor sustractivo de mezcla física.
- **Capa de Aplicación (`/src/services`)**: orquestación de lógica.
  `colorService.js` actúa como fachada para que los componentes consuman datos
  estructurados (Mezcla + Significado + Armonías).
- **Capa de Presentación (`/src/components`)**: Componentes UI
  (`MixerComponent`, `WheelComponent`) que solo manejan el DOM y delegación de
  eventos.

## 2. Convenciones de Nomenclatura

- **Archivos de Lógica**: `camelCase` (ej. `colorUtils.js`, `colorService.js`).
- **Componentes / Clases**: `PascalCase` (ej. `MixerComponent.js`).
- **Funciones y Variables**: `camelCase` estricto.

## 3. Inyección de Dependencias

Se utiliza una inyección manual en `main.js` para conectar los componentes,
permitiendo que `MixerComponent` dependa de una instancia de `WheelComponent`
sin acoplamiento rígido, facilitando las pruebas.

## 4. Evolución del Proyecto

El sistema ahora soporta:

- Mezcla sustractiva de 2 y 3 colores con proporciones variables.
- Entrada de datos dual (HEX / RGB).
- Previsualización en contexto (Objetos 3D y UI Mockups).
- Análisis psicológico y de armonías dinámicas.

---

**Hamilton Leiva Group**\
_Senior IT Architect | 2026_
