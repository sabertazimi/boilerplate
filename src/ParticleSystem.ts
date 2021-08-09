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
  draw(ctx: CanvasRenderingContext2D) {
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

class ParticleFactory {
  particles: ExplodingParticle[];
  constructor() {
    this.particles = [];
  }

  getParticles() {
    return this.particles;
  }

  clearParticles() {
    while (this.particles.length) {
      this.particles.pop();
    }
  }

  emit(particleOptions: ParticleOptions) {
    const particle = new ExplodingParticle(particleOptions);
    this.particles.push(particle);
  }
}

class ParticleSystem {
  factory: ParticleFactory;
  bufferCanvas: HTMLCanvasElement;
  buffer: CanvasRenderingContext2D;
  screenCanvas: HTMLCanvasElement;
  screen: CanvasRenderingContext2D;
  factor: number;

  constructor(factor = 20) {
    this.factory = new ParticleFactory();
    this.bufferCanvas = document.createElement('canvas');
    this.buffer = this.bufferCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.screenCanvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.screen = this.screenCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.factor = factor;

    this.init();
  }

  init(): void {
    this.resize();
    this.initStyle();
    this.handleClick();
  }

  resize(): void {
    // Size canvas
    this.screenCanvas.width = window.innerWidth;
    this.screenCanvas.height = window.innerHeight;
    this.bufferCanvas.width = window.innerWidth;
    this.bufferCanvas.height = window.innerHeight;
  }

  initStyle(): void {
    // Position out canvas
    this.screenCanvas.style.position = 'absolute';
    this.screenCanvas.style.top = '0';
    this.screenCanvas.style.left = '0';

    // Make sure it's on top of other elements
    this.screenCanvas.style.zIndex = '1001';
  }

  handleClick(): void {
    // bind click event to screen canvas
    this.screenCanvas.addEventListener('click', (event) => {
      const x = event.clientX;
      const y = event.clientY;
      const getRandomInt = (min: number, max: number) => () =>
        Math.floor(Math.random() * (max - min)) + min;
      const getColor = getRandomInt(0, 255);

      for (let count = this.factor; count > 0; --count) {
        const color = [getColor(), getColor(), getColor()];
        const speed = {
          x: -5 + Math.random() * 10,
          y: -5 + Math.random() * 10,
        };
        this.emit({ x, y, color, speed });
        count--;
      }
    });
  }

  emit({ x = 0, y = 0, color = [156, 39, 176], speed }: ParticleOptions): void {
    this.factory.emit({ x, y, color, speed });
  }

  draw(): void {
    // render particles to offscreen canvas
    const particles = this.factory.getParticles();

    particles.forEach((particle, index, particles) => {
      particle.draw(this.buffer);

      // Simple way to clean up if the last particle is done animating
      if (index === particles.length - 1) {
        const percent =
          (Date.now() - particle.startTime) / particle.animationDuration;

        if (percent > 1) {
          this.factory.clearParticles();
        }
      }
    });

    // render to screen canvas
    this.screen.drawImage(this.bufferCanvas, 0, 0);
  }

  clear(): void {
    this.buffer.clearRect(
      0,
      0,
      this.bufferCanvas.width,
      this.bufferCanvas.height
    );

    this.screen.clearRect(
      0,
      0,
      this.screenCanvas.width,
      this.screenCanvas.height
    );
  }

  update(): void {
    this.clear();
    this.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  start(): void {
    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default ParticleSystem;
