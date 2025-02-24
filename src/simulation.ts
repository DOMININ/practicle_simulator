import { Practicle } from './types';

export function calculateGravity(p1: Practicle, p2: Practicle) {
  const G = 1;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = dx * dx + dy * dy;
  const force = (G * p1.mass * p2.mass) / distance;
  return {
    fx: (force * dx) / distance,
    fy: (force * dy) / distance,
  };
}

export function simulate(particles: Practicle[]): Practicle[] {
  const dt = 0.01; // Шаг времени

  return particles.map((p1) => {
    let fx = 0,
      fy = 0;

    particles.forEach((p2) => {
      if (p1 === p2) return;
      const { fx: fxi, fy: fyi } = calculateGravity(p1, p2);
      fx += fxi;
      fy += fyi;
    });

    // Вычисляем новые значения без мутации исходных объектов
    const vx = p1.vx + (fx / p1.mass) * dt;
    const vy = p1.vy + (fy / p1.mass) * dt;
    const x = p1.x + vx * dt;
    const y = p1.y + vy * dt;

    return { ...p1, x, y, vx, vy }; // Возвращаем обновлённую частицу
  });
}
