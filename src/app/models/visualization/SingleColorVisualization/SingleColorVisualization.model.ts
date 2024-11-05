import { Type } from '@angular/core';
import { Visualization } from '../Visualization.model';
import { SingleColorVisualizationConfigurationComponent } from './single-color-visualization-configuration/single-color-visualization-configuration.component';
import { VisualizationConfiguration } from '../VizualizationConfiguration';

export class SingleColorVisualization implements Visualization {
    color: string; // CSS-color, e.g. HEX
    size: number; // px
    configurationComponentType = SingleColorVisualizationConfigurationComponent

    constructor(color: string, size: number) {
        this.color = color;
        this.size = size;
    }

    // getConfigurationComponentType(): Type<VisualizationConfiguration> {
    //     return SingleColorVisualizationConfigurationComponent;
    // }

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
