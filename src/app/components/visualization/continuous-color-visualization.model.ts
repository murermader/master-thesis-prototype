import { Visualization } from '../../models/visualization.interface';
import { ContinuousColorComponent } from './continuous-color/continuous-color.component';
import { RowResult } from '../../models/RowResult.model';
import * as d3 from 'd3';
import * as turf from '@turf/turf';

export class ContinuousColorVisualization implements Visualization {
    name = 'Continuous Color';
    configurationComponentType = ContinuousColorComponent;

    color: string;
    size: number;
    fieldName: string;
    normalizeByArea: boolean = false;
    colorScale?: d3.ScaleSequential<string>;

    constructor(color: string, size: number, fieldName: string, normalizeByArea: boolean) {
        this.color = color;
        this.size = size;
        this.fieldName = fieldName;
        this.normalizeByArea = normalizeByArea;
    }

    init(data: RowResult[]): void {
        const values = this.normalizeByArea
            ? data
                  .map((d) => [
                      d.getNumberValueFromField(this.fieldName),
                      turf.area(d.geometry),
                  ])
                  .filter(
                      (v): v is [number, number] =>
                          !isNaN(v[0]) && !isNaN(v[1]),
                  )
                  .map((v) => (v[1] > 0 ? v[0] / v[1] : 0))
            : data
                  .map((d) => d.getNumberValueFromField(this.fieldName))
                  .filter((v): v is number => !isNaN(v));

        console.log('values', values);

        const minValue = d3.min(values) ?? 0;
        const maxValue = d3.max(values) ?? 1;
        console.log('minValue', minValue);
        console.log('maxValue', maxValue);

        this.colorScale = d3
            .scaleSequential(d3.interpolateHsl('lightblue', 'darkblue'))
            .domain([minValue, maxValue]);
        console.log('this.colorScale', this.colorScale);
    }

    copy(): Visualization {
        return new ContinuousColorVisualization(
            this.color,
            this.size,
            this.fieldName,
            this.normalizeByArea,
        );
    }

    getValueForAttribute(attr: string, data: RowResult): string | number {
        switch (attr) {
            case 'stroke-width':
                return 1;
            case 'stroke':
                return "black";
            case 'fill-opacity':
                return 1;
            case 'fill':
                return this.colorScale!(
                    data.getNumberValueFromField(this.fieldName),
                );
        }
        throw new Error(`Visualization does not support attribute [${attr}]`);
    }

    apply(): void {}
}
