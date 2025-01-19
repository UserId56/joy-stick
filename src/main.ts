import JoyStick from "../index";

let sprite;

class Sprite {
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private frameIndex: number;
  private tickCount: number;
  private ticksPerFrame: number;
  private numberOfFrames: number;
  private width: number;
  private height: number;
  private fps: number;

  constructor(options: {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    width: number;
    height: number;
    numberOfFrames: number;
    fps?: number;
  }) {
    this.ctx = options.ctx;
    this.image = options.image;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.width = options.width;
    this.height = options.height;
    this.setFPS(options.fps || 60);
    this.start();
  }

  setFPS(fps: number) {
    this.fps = fps;
    this.ticksPerFrame = Math.round(60 / this.fps);
  }

  update() {
    this.tickCount++;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.frameIndex < this.numberOfFrames - 1) {
        this.frameIndex++;
      } else {
        this.frameIndex = 0;
      }
    }
  }

  render() {
    this.ctx.drawImage(
      this.image,
      (this.frameIndex * this.width) / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      0,
      0,
      this.width / this.numberOfFrames,
      this.height
    );
  }

  start() {
    const loop = () => {
      this.update();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.render();
      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
  }
  setImage(image: HTMLImageElement) {
    this.image = image;
  }
}

let container = document.getElementById("test");
let canvas = document.createElement("canvas");
container.appendChild(canvas);
canvas.width = 128;
canvas.height = 128;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

let UserCharRun = new Image();
UserCharRun.src = "/src/Run.png";
let UserCharRunBacked = new Image();
UserCharRunBacked.src = "/src/Run_back.png";
let UserCharIdle = new Image();
UserCharIdle.src = "/src/Idle.png";

Promise.all([
  loadImage("/src/Run.png"),
  loadImage("/src/Run_back.png"),
  loadImage("/src/Idle.png"),
])
  .then(([UserCharRun, UserCharRunBacked]) => {
    sprite = new Sprite({
      ctx: canvas.getContext("2d"),
      image: UserCharIdle,
      width: 640,
      height: 128,
      numberOfFrames: 5,
      fps: 2,
    });

    console.log(sprite);

    const joyStick = new JoyStick(
      {
        selector: "#app",
        size: 200,
      },
      (data) => {
        console.log(data);
        let speed = data.xSpeed;
        if (data.xSpeed > 0) {
          sprite.setImage(UserCharRun);
        } else if (data.xSpeed < 0) {
          sprite.setImage(UserCharRunBacked);
        } else if (data.xSpeed === 0) {
          sprite.setImage(UserCharIdle);
          speed = 0.5;
        }
        sprite.setFPS(Math.abs(15 * speed));
      }
    );
    joyStick.createJoyStick();
    console.log(joyStick);
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });
