import ExplodingParticle, { ParticleOptions } from './ExplodingParticle';

class ParticleFactory {
  particles: ExplodingParticle[];
  constructor() {
    this.particles = [];
  }

  getParticles(): ExplodingParticle[] {
    return this.particles;
  }

  clearParticles(): void {
    while (this.particles.length) {
      this.particles.pop();
    }
  }

  emit(particleOptions?: ParticleOptions): void {
    const particle = new ExplodingParticle(particleOptions);
    this.particles.push(particle);
  }
}

export default ParticleFactory;
