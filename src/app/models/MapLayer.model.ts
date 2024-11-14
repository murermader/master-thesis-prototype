import { Visualization } from './visualization.interface';
import { RowResult } from './RowResult.model';
import { Injector } from '@angular/core';
import { SingleColorVisualization } from '../components/visualization/single-color-visualization.model';
import { ContinuousColorVisualization } from '../components/visualization/continuous-color-visualization.model';
import {LayerSettingsService} from "../services/layersettings.service";

export class MapLayer {
    name: string;
    data: RowResult[] = [];

    visualizations: Visualization[] = [
        new SingleColorVisualization('green', 2),
        new ContinuousColorVisualization('red', 5, 'todo'),
    ];

    visualization: Visualization = this.visualizations[0];
    injector: Injector;

    // Computed (Not used in copy)
    isActive: boolean = true;
    isRemoved: boolean = false;
    index: number = -1;

    constructor(name: string) {
        this.name = name;
        this.injector = Injector.create({
            providers: [{ provide: 'config', useValue: this.visualization }],
        });
    }

    updateConfigInjector(): void {
        this.injector = Injector.create({
            providers: [{ provide: 'config', useValue: this.visualization}],
        });
    }

    copy() {
        // Do not copy isActive and isRemoved, because we use the copy to check if
        // anything changes so we need to rerender, but in these cases we do not need
        // to rerender.
        return new MapLayer(this.name)
            .addData(this.data.map((d) => d.copy()))
            .addVisualizations(this.visualizations.map((v) => v.copy()), this.visualization.copy());
    }

    addData(data: RowResult[]) {
        data.forEach((d) => (d.layer = this));
        this.data.push(...data);
        return this;
    }

    addVisualizations(visualizations: Visualization[], visualization: Visualization) {
        this.visualizations = visualizations;
        this.visualization = visualization;
        return this;
    }
}
