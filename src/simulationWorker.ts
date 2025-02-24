import { simulate } from './simulation';

self.onmessage = (event) => {
  const particles = event.data;

  const updatedParticles = simulate(particles);

  self.postMessage(updatedParticles);
};
