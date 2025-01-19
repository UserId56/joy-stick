export interface ConfigurationJoyStick {
  selector: string;
  size?: number;
  color?: string;
}

export interface ConfigurationJoyStickDefault extends ConfigurationJoyStick {
  size: number;
  color: string;
}

export type Direction = "C" | "N" | "S" | "W" | "E" | null;

export interface StickStatusType {
  x: string;
  y: string;
  xPosition: number;
  yPosition: number;
  cardinalDirection: Direction;
}

export interface SpeedCoefficient {
  xSpeed: number;
  ySpeed: number;
}
