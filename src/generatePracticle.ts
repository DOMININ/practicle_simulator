export function generateParticles(count: number) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            id: i + 1,
            x: Math.random() * 800, // Случайная позиция по X (в пределах canvas)
            y: Math.random() * 600, // Случайная позиция по Y
            vx: (Math.random() - 0.5) * 2, // Случайная скорость по X
            vy: (Math.random() - 0.5) * 2, // Случайная скорость по Y
            mass: Math.random() * 10 + 5, // Случайная масса (от 5 до 15)
            charge: Math.random() > 0.5 ? 1 : -1, // Случайный заряд (+1 или -1)
        });
    }
    return particles;
}