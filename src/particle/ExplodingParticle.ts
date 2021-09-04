interface Speed {
  x: number;
  y: number;
}

interface ParticleOptions {
  x?: number;
  y?: number;
  color?: number[];
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

  static getDefaultOptions(): ParticleOptions {
    const defaultOptions: ParticleOptions = {
      x: 0,
      y: 0,
      color: [156, 39, 176],
      duration: 1000,
      speed: {
        x: -5 + Math.random() * 10,
        y: -5 + Math.random() * 10,
      },
      radius: 5 + Math.random() * 5,
      life: 30 + Math.random() * 10,
    };

    return defaultOptions;
  }

  constructor(options?: ParticleOptions) {
    const defaultOptions = ExplodingParticle.getDefaultOptions();
    const { x, y, color, duration, speed, radius, life } = {
      ...defaultOptions,
      ...options,
    };

    this.startX = x as number;
    this.startY = y as number;
    this.color = color as number[];

    // Speed
    this.speed = speed as Speed;

    // Size particle
    this.radius = radius as number;

    // Set how long particle to animate for X ms
    this.startTime = Date.now();
    this.animationDuration = duration as number;

    // Set a max time to live for particle
    this.life = life as number;
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