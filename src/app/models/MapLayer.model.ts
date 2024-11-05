import { Visualization } from './visualization/Visualization.model';
import {PolyphenyResult} from "./PolyphenyResult.model";

export class MapLayer {
    name: string;
    data: PolyphenyResult[];
    visualization: Visualization;
    is_active: boolean;

    constructor(name: string, data: PolyphenyResult[], visualization: Visualization) {
        this.name = name
        this.data = data;
        this.visualization = visualization;
        this.is_active = true;
    }
}
