# Scores Carioca

Aplicación web para registrar y gestionar los puntajes del juego de naipes **Carioca**.  
Incluye cálculo automático de puntos según las cartas restantes, historial de partidas y soporte para múltiples jugadores.

**Demo en vivo:** [scores-app-iota.vercel.app](https://scores-app-iota.vercel.app)

---

## Características

- Crear partidas con 2 o más jugadores
- 10 rondas predefinidas con las combinaciones oficiales del Carioca:
  - 2 tríos
  - 1 trío + 1 escala
  - 2 escalas
  - 3 tríos
  - 2 tríos + 1 escala
  - 1 trío + 2 escalas
  - 3 escalas
  - 4 tríos
  - Escala sucia
  - Escala real
- Cálculo automático de puntos por cartas restantes (A = 20 pts, Joker = 30 pts, etc.)
- Selector de cartas o ingreso manual de puntaje
- Agregar jugadores en cualquier momento de la partida
- Editar rondas anteriores
- Deshacer la última ronda
- Historial de partidas finalizadas (almacenado en localStorage)
- Persistencia de partidas en curso

---

## Tecnologías

| Tecnología          | Uso                          |
| ------------------- | ---------------------------- |
| **Next.js 16**      | Framework (App Router)       |
| **React 19**        | UI                           |
| **TypeScript**      | Tipado estático              |
| **Tailwind CSS**    | Estilos                      |
| **Zustand**         | Estado global + persistencia |
| **Vitest**          | Testing                      |
| **Testing Library** | Tests de componentes         |

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/PALLdev/scores-app.git
cd scores-app

# Instalar dependencias (recomendado con pnpm)
pnpm install

# Ejecutar en modo desarrollo
pnpm dev
```
