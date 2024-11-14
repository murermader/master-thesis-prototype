import { Visualization } from '../../models/visualization.interface';
import { SingleColorComponent } from './single-color/single-color.component';
import {RowResult} from "../../models/RowResult.model";

export class SingleColorVisualization implements Visualization {
    name = 'Static Color';
    configurationComponentType = SingleColorComponent;

    color: string; // CSS-color, e.g. HEX
    size: number; // px

    constructor(color: string, size: number) {
        this.color = color;
        this.size = size;
    }

    init(data: RowResult[]): void {
        // Nothing to do.
    }

    copy(): Visualization {
        return new SingleColorVisualization(this.color, this.size);
    }

    getValueForAttribute(attr: string): string | number {
        switch (attr) {
            case 'r':
            case 'stroke-width':
                return this.size;
            case 'stroke':
                return this.color;
            case "fill-opacity":
                return 0.25;
            case 'fill':
                return this.color
        }

        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
