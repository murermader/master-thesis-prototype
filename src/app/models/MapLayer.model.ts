import { Visualization } from './visualization.interface';
import { RowResult } from './RowResult.model';
import { Injector } from '@angular/core';

export class MapLayer {
    name: string;
    data: RowResult[];
    isActive: boolean = true;
    isRemoved: boolean = false;
    index: number;
    visualization: Visualization;
    injector: Injector;

    constructor(name: string, index: number, data: RowResult[], visualization: Visualization) {
        this.name = name;
        this.index = index;
        this.data = data;
        this.visualization = visualization;
        this.injector = Injector.create({
            providers: [{ provide: 'config', useValue: visualization }],
        });
    }

    copy() {
        // Do not copy isActive and isRemoved, because we use the copy to check if
        // anything changes so we need to rerender, but in these cases we do not need
        // to rerender.
        return new MapLayer(
            this.name,
            this.index,
            this.data.map((d) => d.copy()),
            this.visualization.copy(),
        );
    }
}
