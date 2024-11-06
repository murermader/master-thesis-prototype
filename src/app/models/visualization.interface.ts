import { VisualizationConfiguration } from './visualization-configuration.interface';
import { Type } from '@angular/core';

export interface Visualization {
    configurationComponentType: Type<VisualizationConfiguration>;

    apply(): void;

    copy(): Visualization;

    getValueForAttribute(attr: string): string | number;
}
