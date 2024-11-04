import {Visualization} from "./Visualization.model";

export class SingleColorVisualization implements Visualization {
  color: string; // CSS-color, e.g. HEX
  size: number; // px

  constructor(color: string, size: number) {
    this.color = color;
    this.size = size;
  }

  apply(): void {

  }
}
