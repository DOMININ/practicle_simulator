function calculateGravity(p1, p2) {
    const G = 1;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (G * p1.mass * p2.mass) / (distance * distance);
    return {
        fx: (force * dx) / distance,
        fy: (force * dy) / distance,
    };
}

function simulate(particles) {
    const dt = 0.01; // Шаг времени

    particles.forEach((p1) => {
        let fx = 0,
            fy = 0;

        // Расчет суммарной силы, действующей на p1
        particles.forEach((p2) => {
            if (p1 === p2) return;
            const { fx: fxi, fy: fyi } = calculateGravity(p1, p2);
            fx += fxi;
            fy += fyi;
        });

        // Обновление скорости и позиции
        p1.vx += (fx / p1.mass) * dt;
        p1.vy += (fy / p1.mass) * dt;
        p1.x += p1.vx * dt;
        p1.y += p1.vy * dt;
    });
}

self.onmessage = (event) => {
    const particles = event.data; // Получаем данные
    const updatedParticles = simulate(particles); // Выполняем симуляцию
    self.postMessage(updatedParticles); // Отправляем результат обратно
};