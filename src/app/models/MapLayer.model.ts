import { Visualization } from './visualization/Visualization.model';
import {PolyphenyResult} from "./PolyphenyResult.model";
import {Injector} from "@angular/core";

export class MapLayer {
    name: string;
    data: PolyphenyResult[];
    visualization: Visualization;
    is_active: boolean;
    injector: Injector;

    constructor(name: string, data: PolyphenyResult[], visualization: Visualization) {
        this.name = name
        this.data = data;
        this.visualization = visualization;
        this.is_active = true;
        this.injector = Injector.create({
            providers: [{ provide: 'config', useValue: visualization }],
        });
    }
}
