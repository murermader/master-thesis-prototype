import {Geometry, Point} from 'geojson';

/**
 * Represents one row in the results returned by Polypheny.
 */
export class PolyphenyResult {
    /**
     * Used for styling if the results are ordered
     */
    index: number;
    geometry: Geometry;
    data: Record<string, any> = {};
    cache: Record<string, number> = {};

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
}
