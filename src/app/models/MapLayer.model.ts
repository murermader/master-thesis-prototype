import { PolyphenyResults } from './PolyphenyResults.model';
import { Visualization } from './visualization/Visualization.model';
import {PolyphenyResult} from "./PolyphenyResult.model";

export class MapLayer {
    data: PolyphenyResult[];
    visualization: Visualization;
    is_active: boolean;

    constructor(data: PolyphenyResult[], visualization: Visualization) {
        this.data = data;
        this.visualization = visualization;
        this.is_active = true;
    }
}
