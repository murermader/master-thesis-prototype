import { Visualization } from '../../models/visualization.interface';
import { RowResult } from '../../models/RowResult.model';
import {EmptyComponent} from "./empty/empty.component";

export class AreaShapeVisualization implements Visualization {
    name = 'Area Shape';
    // TODO: Change to own component
    configurationComponentType = EmptyComponent;

    outlineThickness: number;

    // fieldName: string;

    constructor(
        outlineThickness: number,
        // fieldName: string,
    ) {
        this.outlineThickness = outlineThickness;
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
        return new AreaShapeVisualization(this.outlineThickness,
            // this.fieldName
        );
    }

    getValueForAttribute(attr: string, data: RowResult): string | number {
        switch (attr) {
            case 'stroke-width':
                return this.outlineThickness;
            case 'stroke':
                // TODO: Default color is black by default. Different color will be set
                //       inside color config.
                return 'black';
            // case 'fill-opacity':
            //     return 1;
            // case 'fill':
            //     return this.colorScale!(
            //         data.getNumberValueFromField(this.fieldName),
            //     );
        }

        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
