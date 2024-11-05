import { VisualizationConfiguration } from './VizualizationConfiguration';
import {Type} from "@angular/core";

export interface Visualization {
    configurationComponentType: Type<VisualizationConfiguration>;

    apply(): void;

    getValueForAttribute(attr: string): string | number;

    // getConfigurationComponentType(): Type<VisualizationConfiguration>;
}
