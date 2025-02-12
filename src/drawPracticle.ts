import { Practicle } from "./types";

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Practicle[]) {
    // console.log(particles)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    });
}