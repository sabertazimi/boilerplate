import ExplodingParticle from './ExplodingParticle';

describe('ExplodingParticle', () => {
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fillStyle: '',
      fill: jest.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  afterEach(() => {
    mockContext = {} as unknown as CanvasRenderingContext2D;
  });

  test('should get same x, y, color and duration with empty options', () => {
    const particle = new ExplodingParticle();
    const defaultOptions = ExplodingParticle.getDefaultOptions();

    expect(particle.startX).toBe(defaultOptions.x);
    expect(particle.startY).toBe(defaultOptions.y);
    expect(particle.color).toStrictEqual(defaultOptions.color);
    expect(particle.animationDuration).toBe(defaultOptions.duration);
  });

  test('should get random radius, speed and life with empty options', () => {
    const particle = new ExplodingParticle();
    const defaultOptions = ExplodingParticle.getDefaultOptions();

    expect(particle.radius).not.toBe(defaultOptions.radius);
    expect(particle.speed).not.toStrictEqual(defaultOptions.speed);
    expect(particle.life).toBe(particle.remainingLife);
    expect(particle.life).not.toBe(defaultOptions.life);
    expect(particle.remainingLife).not.toBe(defaultOptions.life);
  });

  test('should move according to its speed', () => {
    const particle = new ExplodingParticle({
      x: 1,
      y: 2,
      speed: { x: 1, y: -2 },
    });

    expect(particle.startX).toBe(1);
    expect(particle.startY).toBe(2);
    particle.draw(mockContext);
    expect(particle.startX).toBe(2);
    expect(particle.startY).toBe(0);
    particle.draw(mockContext);
    expect(particle.startX).toBe(3);
    expect(particle.startY).toBe(-2);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(2);
    expect(mockContext.arc).toHaveBeenCalledTimes(2);
    expect(mockContext.fill).toHaveBeenCalledTimes(2);
  });

  test('should shrink radius when time passed', () => {
    const particle = new ExplodingParticle({
      radius: 1.25,
    });

    expect(particle.radius).toBe(1.25);
    particle.draw(mockContext);
    expect(particle.radius).toBe(1);
    particle.draw(mockContext);
    expect(particle.radius).toBe(0.75);
    particle.draw(mockContext);
    expect(particle.radius).toBe(0.5);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(3);
    expect(mockContext.arc).toHaveBeenCalledTimes(3);
    expect(mockContext.fill).toHaveBeenCalledTimes(3);
  });

  test('should disappear (freezed) when radius becomes zero', () => {
    const particle = new ExplodingParticle({
      x: 0,
      y: 0,
      speed: { x: 1, y: 1 },
      radius: 0.25,
    });

    expect(particle.startX).toBe(0);
    expect(particle.startY).toBe(0);
    expect(particle.radius).toBe(0.25);
    expect(particle.speed).toStrictEqual({ x: 1, y: 1 });
    particle.draw(mockContext);
    expect(particle.startX).toBe(1);
    expect(particle.startY).toBe(1);
    expect(particle.radius).toBe(0);
    particle.draw(mockContext);
    expect(particle.startX).toBe(1);
    expect(particle.startY).toBe(1);
    expect(particle.radius).toBe(0);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockContext.arc).toHaveBeenCalledTimes(1);
    expect(mockContext.fill).toHaveBeenCalledTimes(1);
  });
});
