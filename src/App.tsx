import { useEffect, useRef, useState } from 'react';
import { drawParticles } from './drawPracticle';
import { generateParticles } from './generatePracticle';
import './App.css';

function ParticleSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [practiclesCount, setPracticlesCount] = useState(100);
  const [particles, setParticles] = useState(generateParticles(10));
  const particleHistory = useRef<{ x: number; y: number }[][]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    setParticles(generateParticles(practiclesCount));
  }, [practiclesCount]);

  // TODO: возможно через setTimeout
  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d');

    if (!ctx) return;

    workerRef.current = new Worker(
      new URL('./simulationWorker.ts', import.meta.url),
    );

    workerRef.current.postMessage(particles);

    workerRef.current.onmessage = (event) => {
      setParticles(event.data);
      drawParticles(ctx, event.data);
      requestAnimationFrame(() => workerRef.current?.postMessage(particles));
    };

    return () => {
      workerRef.current?.terminate();
    };
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
