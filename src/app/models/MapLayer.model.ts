import { Visualization } from './visualization.interface';
import {RowResult} from "./RowResult.model";
import {Injector} from "@angular/core";

export class MapLayer {
    name: string;
    data: RowResult[];
    visualization: Visualization;
    is_active: boolean;
    injector: Injector;

    constructor(name: string, data: RowResult[], visualization: Visualization) {
        this.name = name
        this.data = data;
        this.visualization = visualization;
        this.is_active = true;
        this.injector = Injector.create({
            providers: [{ provide: 'config', useValue: visualization }],
        });
    }

    copy(){
        return new MapLayer(this.name, this.data.map(d => d.copy()), this.visualization.copy())
    }
}
