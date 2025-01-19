import {
  ConfigurationJoyStick,
  ConfigurationJoyStickDefault,
  TestParametr,
} from "./types/ConfigurationJoyStick";
import "./src/style.css";

const DEFAULT: ConfigurationJoyStickDefault = {
  selector: "#joy-stick",
  size: 150,
  color: "#3333339f",
};

class JoyStick {
  root: Element | null;
  config: ConfigurationJoyStick;
  btn: Element | null;
  test: TestParametr | null;

  constructor(config: ConfigurationJoyStick) {
    this.root = document.querySelector(config.selector);
    this.config = config;
    this.btn = null;
    this.test = null;
  }
  onTouchMove = (event: TouchEvent): void => {
    // console.log(event);
    // console.log(this.btn);
    this.btn!.style.display = "block";
    // document.documentElement.style.setProperty(
    //   "--joy-stick-position-y",
    //   event.changedTouches[0].clientY + "px"
    // );
    // document.documentElement.style.setProperty(
    //   "--joy-stick-position-x",
    //   event.changedTouches[0].clientX + "px"
    // );
    // this.test.x.textContent = event.changedTouches[0].clientX.toString();
    // this.test.y.textContent = event.changedTouches[0].clientY.toString();
    // this.test.force.textContent = event.changedTouches[0].force.toString();
    // this.test.identifier.textContent =
    //   event.changedTouches[0].identifier.toString();

    event.preventDefault();
    if (this.btn && this.root) {
      const touch = event.touches[0];
      const rect = this.root.children[0].getBoundingClientRect();

      // Рассчитываем позицию касания относительно центра джойстика
      let x = touch.clientX;
      let y = touch.clientY;

      // Ограничиваем движение кнопки
      console.log(rect);
      const maxDistance = rect.width / 2;
      const distance = Math.sqrt(x * x + y * y);

      if (distance > maxDistance) {
        console.log(distance, maxDistance);
        const ratio = maxDistance / distance;
        x *= ratio;
        y *= ratio;
      }

      document.documentElement.style.setProperty(
        "--joy-stick-position-y",
        y + "px"
      );
      document.documentElement.style.setProperty(
        "--joy-stick-position-x",
        x + "px"
      );

      // Применяем трансформацию без дополнительных вычислений
      // (this.btn as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;

      // Обновляем тестовые данные
      if (this.test) {
        this.test.x.textContent = x.toFixed(2);
        this.test.y.textContent = y.toFixed(2);
        this.test.force.textContent = touch.force.toFixed(2);
        this.test.identifier.textContent = touch.identifier.toString();
      }
    }
  };
  //   createJoyStick(): JoyStick {
  //     const joyStick = document.createElement("div");
  //     joyStick.classList.add("joy-stick");
  //     const JoyStickDOM = document.createElement("div");
  //     JoyStickDOM.classList.add("joy-stick__btn");
  //     document.documentElement.appendChild(JoyStickDOM);
  //     try {
  //       this.root!.appendChild(joyStick);
  //       document.documentElement.style.setProperty(
  //         "--joy-stick-size",
  //         this.config.size ? this.config.size + "px" : DEFAULT.size + "px"
  //       );
  //       document.documentElement.style.setProperty(
  //         "--joy-stick-color",
  //         this.config.color ? this.config.color : DEFAULT.color
  //       );
  //       this.root!.addEventListener("touchmove", this.onTouchMove);
  //       this.btn = document.querySelector(".joy-stick__btn");
  //       this.test = {
  //         x: document.querySelector(".test-x"),
  //         y: document.querySelector(".test-y"),
  //         force: document.querySelector(".test-force"),
  //         identifier: document.querySelector(".test-identifier"),
  //       };
  //     } catch (error) {
  //       console.log("Нет элемента ", this.config.selector);
  //     }
  //     return this;
  //   }

  // onTouchEnd = (): void => {
  //   if (this.btn) {
  //     (this.btn as HTMLElement).style.transform = "translate(-50%, -50%)";
  //   }
  // };

  createJoyStick(): JoyStick {
    const joyStick = document.createElement("div");
    joyStick.classList.add("joy-stick");

    const joyStickBtn = document.createElement("div");
    joyStickBtn.classList.add("joy-stick__btn");

    joyStick.appendChild(joyStickBtn);

    try {
      this.root!.appendChild(joyStick);
      document.documentElement.style.setProperty(
        "--joy-stick-width",
        this.config.size ? this.config.size + "px" : DEFAULT.size + "px"
      );
      document.documentElement.style.setProperty(
        "--joy-stick-height",
        this.config.size ? this.config.size + "px" : DEFAULT.size + "px"
      );
      document.documentElement.style.setProperty(
        "--joy-stick-color",
        this.config.color ? this.config.color : DEFAULT.color
      );
      this.root!.addEventListener("touchmove", this.onTouchMove);
      this.root!.addEventListener("touchstart", this.onTouchMove);
      this.root!.addEventListener("touchend", this.onTouchEnd);
      this.btn = joyStickBtn;
      // ... existing code ...
    } catch (error) {
      console.log("Нет элемента ", this.config.selector);
    }
    return this;
  }
}

export default JoyStick;
