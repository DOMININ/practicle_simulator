import { useEffect, useRef, useState } from 'react';
import { drawParticles } from './drawPracticle';
import { simulate } from './simulation';
import { generateParticles } from './generatePracticle';
import './App.css';

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
          value={practiclesCount}
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
