import { PolyphenyResults } from './PolyphenyResults.model';
import { Visualization } from './visualization/Visualization.model';

export class MapLayer {
    data: PolyphenyResults;
    visualization: Visualization;
    is_active: boolean;

    constructor(data: PolyphenyResults, visualization: Visualization) {
        this.data = data;
        this.visualization = visualization;
        this.is_active = true;
    }
}
