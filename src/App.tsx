import { useEffect, useRef, useState } from 'react';
import './App.css';

type Practicle = {
  id: number;
  x: number; // Позиция по X
  y: number; // Позиция по Y
  vx: number; // Скорость по X
  vy: number; // Скорость по Y
  mass: number; // Масса
  charge: number; // Заряд
};

function generateParticles(count: number) {
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

function calculateGravity(p1: Practicle, p2: Practicle) {
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

function simulate(particles: Practicle[]) {
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

function drawParticles(ctx: CanvasRenderingContext2D, particles: Practicle[]) {
  // console.log(particles)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
  });
}

function ParticleSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [practiclesCount, setPracticlesCount] = useState(100);
  const [particles, setParticles] = useState(generateParticles(10));
  const particleHistory = useRef<{ x: number; y: number }[][]>([]);

  useEffect(() => {
    setParticles(generateParticles(practiclesCount));
  }, [practiclesCount]);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d');
    if (!!ctx) {
      const animate = () => {
        simulate(particles);
        particleHistory.current.push(
          particles.map((p) => ({ x: p.x, y: p.y })),
        );

        drawParticles(ctx, particles);
        requestAnimationFrame(animate);
      };

      animate();
    }
  }, [particles]);

  const handleSendHistory = () => {
    console.log(particleHistory);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div>
        <button onClick={() => handleSendHistory()}>Отправить отчет</button>
        Количество частиц:{' '}
        <input
          type="text"
          // @ts-ignore
          onChange={(e) => setPracticlesCount(e.target.value)}
        />
      </div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

const App = () => {
  return <ParticleSimulator />;
};

export default App;
