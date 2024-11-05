import {Component, Inject, Input} from '@angular/core';
import {SingleColorVisualization} from "../SingleColorVisualization.model";
import {VisualizationConfiguration} from "../../VizualizationConfiguration";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-single-color-visualization-configuration',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './single-color-visualization-configuration.component.html',
    styleUrl: './single-color-visualization-configuration.component.css',
})
export class SingleColorVisualizationConfigurationComponent
    implements VisualizationConfiguration
{
    size: number = 0;
    color: string = '';

    constructor(@Inject('config') protected config: SingleColorVisualization) {
        console.log(config)
        this.size = config.size;
        this.color = config.color;
    }
}
