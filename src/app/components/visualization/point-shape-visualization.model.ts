import { Visualization } from '../../models/visualization.interface';
import { RowResult } from '../../models/RowResult.model';
import {ShapePointComponent} from "./shape-point/shape-point.component";

export class PointShapeVisualization implements Visualization {
    name = 'Point shape';
    // TODO: Change to own component
    configurationComponentType = ShapePointComponent;

    size: number;

    // fieldName: string;

    constructor(
        size: number,
        // fieldName: string,
    ) {
        this.size = size;
        // this.fieldName = fieldName;
    }

    init(data: RowResult[]): void {
        // const values = this.normalizeByArea
        //     ? data
        //           .map((d) => [
        //               d.getNumberValueFromField(this.fieldName),
        //               turf.area(d.geometry),
        //           ])
        //           .filter(
        //               (v): v is [number, number] =>
        //                   !isNaN(v[0]) && !isNaN(v[1]),
        //           )
        //           .map((v) => (v[1] > 0 ? v[0] / v[1] : 0))
        //     : data
        //           .map((d) => d.getNumberValueFromField(this.fieldName))
        //           .filter((v): v is number => !isNaN(v));
        //
        // console.log('values', values);
        //
        // const minValue = d3.min(values) ?? 0;
        // const maxValue = d3.max(values) ?? 1;
        // console.log('minValue', minValue);
        // console.log('maxValue', maxValue);
        //
        // this.colorScale = d3
        //     .scaleSequential(d3.interpolateHsl('lightblue', 'darkblue'))
        //     .domain([minValue, maxValue]);
        // console.log('this.colorScale', this.colorScale);
    }

    copy(): Visualization {
        return new PointShapeVisualization(this.size,
            // this.fieldName
        );
    }

    getValueForAttribute(attr: string, data: RowResult): string | number {
        if (data.isPoint()) {
            switch (attr) {
                case 'r':
                    return this.size;
            }
        }

        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
