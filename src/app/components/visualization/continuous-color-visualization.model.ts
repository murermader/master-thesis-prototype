import { Visualization } from '../../models/visualization.interface';
import {ContinuousColorComponent} from "./continuous-color/continuous-color.component";

export class ContinuousColorVisualization implements Visualization {
    name = 'Continuous Color';
    configurationComponentType = ContinuousColorComponent;

    color: string;
    size: number;
    fieldName: string;

    constructor(color: string, size: number, fieldName: string) {
        this.color = color;
        this.size = size;
        this.fieldName = fieldName;
    }

    copy(): Visualization {
        return new ContinuousColorVisualization(
            this.color,
            this.size,
            this.fieldName,
        );
    }

    getValueForAttribute(attr: string): string | number {
        switch (attr) {
            case 'r':
                return this.size;
            case 'fill':
                // Todo: We need to access the data here, and return a different value
                //       depending on the value.
                return this.color;
        }
        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
