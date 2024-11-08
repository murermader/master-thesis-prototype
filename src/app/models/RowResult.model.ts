import {Geometry, Point} from 'geojson';
import {MapLayer} from "./MapLayer.model";

/**
 * Represents one row in the results returned by Polypheny.
 */
export class RowResult {
    /**
     * Used for styling if the results are ordered
     */
    index: number;
    geometry: Geometry;
    data: Record<string, any> = {};
    cache: Record<string, number> = {};
    layer?: MapLayer = undefined;

    constructor(
        index: number,
        geometry: Geometry,
        data: Record<string, any> | undefined = undefined,
    ) {
        this.index = index;
        this.geometry = geometry;

        if (data) {
            this.data = data;
        }
    }

    getPoint() {
        if (this.geometry.type == "Point"){
            return this.geometry as Point;
        }
        throw new Error("Can only call getPoint() if geometry is actually of type Point!")
    }

    copy(){
        // We leave out cache on purpose, because we will use the copy to compare both if the layer has changed.
        return new RowResult(this.index, this.geometry, this.data);
    }
}
