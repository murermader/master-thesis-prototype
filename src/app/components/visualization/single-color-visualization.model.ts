import { Visualization } from '../../models/visualization.interface';
import { SingleColorComponent } from './single-color/single-color.component';

export class SingleColorVisualization implements Visualization {
    name = 'Static Color';
    configurationComponentType = SingleColorComponent;

    color: string; // CSS-color, e.g. HEX
    size: number; // px

    constructor(color: string, size: number) {
        this.color = color;
        this.size = size;
    }

    copy(): Visualization {
        return new SingleColorVisualization(this.color, this.size);
    }

    getValueForAttribute(attr: string): string | number {
        switch (attr) {
            case 'r':
                return this.size;

            case 'fill':
                // TODO: This value is different, depending on it is used with a path or a
                //       circle. Should somehow be able to control that.
                return this.color;
        }

        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
