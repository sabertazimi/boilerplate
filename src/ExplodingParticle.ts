interface Speed {
  x: number;
  y: number;
}

interface ParticleOptions {
  x: number;
  y: number;
  color: number[];
  duration?: number;
  speed?: Speed;
  radius?: number;
  life?: number;
}

class ExplodingParticle {
  startX: number;
  startY: number;
  color: number[];
  speed: Speed;
  radius: number;
  startTime: number;
  animationDuration: number;
  life: number;
  remainingLife: number;

  constructor({
    x = 0,
    y = 0,
    color = [156, 39, 176],
    duration = 1000,
    speed,
    radius,
    life,
  }: ParticleOptions) {
    this.startX = x;
    this.startY = y;
    this.color = color;

    // Speed
    this.speed = speed || {
      x: -5 + Math.random() * 10,
      y: -5 + Math.random() * 10,
    };

    // Size particle
    this.radius = radius || 5 + Math.random() * 5;

    // Set how long particle to animate for X ms
    this.startTime = Date.now();
    this.animationDuration = duration;

    // Set a max time to live for particle
    this.life = life || 30 + Math.random() * 10;
    this.remainingLife = this.life;
  }

  // This function will be called by animation logic
  draw(ctx: CanvasRenderingContext2D): void {
    const shouldDraw = this.radius > 0 && this.remainingLife > 0;

    if (shouldDraw) {
      // Draw a circle at the current location
      ctx.beginPath();
      ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},1)`;
      ctx.fill();

      // Update the particle's location and life
      this.startX += this.speed.x;
      this.startY += this.speed.y;
      this.radius -= 0.25;
      this.remainingLife--;
    }
  }
}

export default ExplodingParticle;
export type { Speed, ParticleOptions };
