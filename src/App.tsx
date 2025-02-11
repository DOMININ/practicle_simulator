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
  const workerRef = useRef<Worker>(null);
  // const particleHistory = useRef(new WeakMap());

  useEffect(() => {
    setParticles(generateParticles(practiclesCount));
  }, [practiclesCount]);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d');
    workerRef.current = new Worker('./simulate.js');
    if (!!ctx) {
      // @ts-ignore
      workerRef.current.onmessage = (event) => {
        const updatedParticles = event.data; // Получаем обновленные частицы
        setParticles(updatedParticles); // Обновляем состояние
        drawParticles(ctx, updatedParticles); // Отрисовываем частицы
      };
      const animate = () => {
        // simulate(particles);
        workerRef?.current?.postMessage(particles);
        particleHistory.current.push(
          particles.map((p) => ({ x: p.x, y: p.y })),
        );
        // particles.forEach((p) => {
        //   if (!particleHistory.current.has(p)) {
        //     particleHistory.current.set(p, []);
        //   }
        //   particleHistory.current.get(p).push({ x: p.x, y: p.y });
        // });

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
