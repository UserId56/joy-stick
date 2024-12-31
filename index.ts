import { ConfigurationJoyStick } from "./types/ConfigurationJoyStick";
import "./src/style.css";

class JoyStick {
  root: Element | null;
  config: ConfigurationJoyStick;

  constructor(config: ConfigurationJoyStick) {
    this.root = document.querySelector(config.selector);
    this.config = config;
  }
  createJoyStick(): JoyStick {
    const joyStick = document.createElement("div");
    joyStick.classList.add("joy-stick");
    try {
      this.root!.appendChild(joyStick);
    } catch (error) {
      console.error("Failed to append joy-stick to DOM:", error);
    }
    return this;
  }
}

export default JoyStick;
