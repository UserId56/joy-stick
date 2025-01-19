import {
  ConfigurationJoyStick,
  Direction,
  StickStatusType,
  SpeedCoefficient,
} from "./types/ConfigurationJoyStick";
import "./src/style.css";

class JoyStick {
  root: Element | null;
  config: ConfigurationJoyStick;
  pressed: boolean = false;
  circumference: number = 0;
  internalRadius: number = 0;
  maxMoveStick: number = 0;
  externalRadius: number = 0;
  centerX: number = 0;
  centerY: number = 0;
  movedX: number = 0;
  movedY: number = 0;
  internalStrokeColor: string = "#3333339f";
  externalLineWidth: number = 5;
  externalStrokeColor: string = "#3333339f";
  internalFillColor: string = "#3333339f";
  internalLineWidth: number = 2;
  canvas: HTMLCanvasElement;
  touchId: number = 0;
  ctx: CanvasRenderingContext2D;
  StickStatus: StickStatusType = {
    xPosition: 0,
    yPosition: 0,
    x: "0",
    y: "0",
    cardinalDirection: "C",
  };
  callback;
  directionHorizontalLimitPos: number = 0;
  directionHorizontalLimitNeg: number = 0;
  directionVerticalLimitPos: number = 0;
  directionVerticalLimitNeg: number = 0;

  constructor(
    config: ConfigurationJoyStick,
    callback: (data: SpeedCoefficient) => void
  ) {
    this.root = document.querySelector(config.selector);
    this.config = config;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.callback = callback;
  }
  onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    if (this.pressed && event.targetTouches[0].target === this.canvas) {
      this.movedX = event.targetTouches[0].pageX;
      this.movedY = event.targetTouches[0].pageY;
      // Manage offset
      if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
        this.movedX -= this.canvas.offsetLeft;
        this.movedY -= this.canvas.offsetTop;
      } else {
        this.movedX -= this.canvas.offsetParent.offsetLeft;
        this.movedY -= this.canvas.offsetParent.offsetTop;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawExternal();
      this.drawInternal();

      // Set attribute of callback
      this.StickStatus.xPosition = this.movedX;
      this.StickStatus.yPosition = this.movedY;
      this.StickStatus.x = (
        100 *
        ((this.movedX - this.centerX) / this.maxMoveStick)
      ).toFixed();
      this.StickStatus.y = (
        100 *
        ((this.movedY - this.centerY) / this.maxMoveStick) *
        -1
      ).toFixed();
      this.StickStatus.cardinalDirection = this.getCardinalDirection();
      this.callback(this.calcMoveData());
    }
  };
  onTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    this.pressed = true;
    this.touchId = event.targetTouches[0].identifier;
  };
  onTouchEnd = (event: TouchEvent): void => {
    event.preventDefault();
    if (event.changedTouches[0].identifier !== this.touchId) return;
    console.log(this.StickStatus);
    this.pressed = false;
    // На будущее если нужна настройка не возвращать, хотя зачем?
    if (true) {
      this.movedX = this.centerX;
      this.movedY = this.centerY;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawExternal();
    this.drawInternal();

    // Вывод параметров для обратного вызова
    this.StickStatus.xPosition = this.movedX;
    this.StickStatus.yPosition = this.movedY;
    this.StickStatus.x = (
      100 *
      ((this.movedX - this.centerX) / this.maxMoveStick)
    ).toFixed();
    this.StickStatus.y = (
      100 *
      ((this.movedY - this.centerY) / this.maxMoveStick) *
      -1
    ).toFixed();
    this.StickStatus.cardinalDirection = this.getCardinalDirection();
    this.callback(this.calcMoveData());
  };

  calcMoveData(): SpeedCoefficient {
    // высчитываю как далеко от центра, для коэфициента скорости
    let xSpeed =
      100 / (this.maxMoveStick / (this.StickStatus.xPosition - this.centerX));
    let ySpeed =
      100 / (this.maxMoveStick / (this.StickStatus.yPosition - this.centerY));
    return {
      xSpeed: xSpeed / 100,
      ySpeed: ySpeed / 100,
    };
  }

  createJoyStick(): JoyStick {
    // Создаеми canvas
    this.canvas.id = `joyStick`;
    this.canvas.classList.add("joy-stick");
    // Если высота и ширина не заданы в параметрах, берем размер контейнера в котором будет рисоваться Джойстик

    if (!this.config.size) {
      const container = this.root!;
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientWidth;
      // Дублирую, что бы был квадрат, если верстальщик накосячит
    } else {
      this.canvas.width = this.config.size;
      this.canvas.height = this.config.size;
    }
    this.circumference = 2 * Math.PI;
    this.internalRadius =
      (this.canvas.width - (this.canvas.width / 2 + 10)) / 2;
    this.maxMoveStick = this.internalRadius + 5;
    this.externalRadius = this.internalRadius + 30;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.directionHorizontalLimitPos = this.canvas.width / 10;
    this.directionHorizontalLimitNeg = this.directionHorizontalLimitPos * -1;
    this.directionVerticalLimitPos = this.canvas.height / 10;
    this.directionVerticalLimitNeg = this.directionVerticalLimitPos * -1;
    // Координаты начала джостика(подвижный круг)
    this.movedX = this.centerX;
    this.movedY = this.centerY;
    try {
      this.root!.appendChild(this.canvas);
      this.canvas.addEventListener("touchmove", this.onTouchMove, false);
      this.canvas.addEventListener("touchstart", this.onTouchStart, false);
      this.canvas.addEventListener("touchend", this.onTouchEnd, false);
      this.drawExternal();
      this.drawInternal();
    } catch (error) {
      console.log("Нет элемента ", this.config.selector, error.message);
    }
    return this;
  }

  drawExternal() {
    this.ctx.beginPath();
    this.ctx.arc(
      this.centerX,
      this.centerY,
      this.externalRadius,
      0,
      this.circumference,
      false
    );
    this.ctx.lineWidth = this.externalLineWidth;
    this.ctx.strokeStyle = this.externalStrokeColor;
    this.ctx.stroke();
  }
  drawInternal() {
    this.ctx.beginPath();
    if (this.movedX < this.internalRadius) {
      this.movedX = this.maxMoveStick;
    }
    if (this.movedX + this.internalRadius > this.canvas.width) {
      this.movedX = this.canvas.width - this.maxMoveStick;
    }
    if (this.movedY < this.internalRadius) {
      this.movedY = this.maxMoveStick;
    }
    if (this.movedY + this.internalRadius > this.canvas.height) {
      this.movedY = this.canvas.height - this.maxMoveStick;
    }
    this.ctx.arc(
      this.movedX,
      this.movedY,
      this.internalRadius,
      0,
      this.circumference,
      false
    );
    // create radial gradient
    let grd = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      5,
      this.centerX,
      this.centerY,
      200
    );
    // Light color
    grd.addColorStop(0, this.internalFillColor);
    // Dark color
    grd.addColorStop(1, this.internalStrokeColor);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
    this.ctx.lineWidth = this.internalLineWidth;
    this.ctx.strokeStyle = this.internalStrokeColor;
    this.ctx.stroke();
  }

  getCardinalDirection(): Direction {
    let result: Direction = null;
    let orizontal = this.movedX - this.centerX;
    let vertical = this.movedY - this.centerY;

    if (
      vertical >= this.directionVerticalLimitNeg &&
      vertical <= this.directionVerticalLimitPos
    ) {
      result = "C";
    }
    if (vertical < this.directionVerticalLimitNeg) {
      result = "N";
    }
    if (vertical > this.directionVerticalLimitPos) {
      result = "S";
    }

    if (orizontal < this.directionHorizontalLimitNeg) {
      if (result === "C") {
        result = "W";
      } else {
        result += "W";
      }
    }
    if (orizontal > this.directionHorizontalLimitPos) {
      if (result === "C") {
        result = "E";
      } else {
        result += "E";
      }
    }

    return result;
  }
}

export default JoyStick;
