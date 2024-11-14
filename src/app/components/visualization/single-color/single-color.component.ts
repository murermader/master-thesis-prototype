import { Component, Inject } from '@angular/core';
import { SingleColorVisualization } from '../single-color-visualization.model';
import { VisualizationConfiguration } from '../../../models/visualization-configuration.interface';
import { FormsModule } from '@angular/forms';
import { LayerSettingsService } from '../../../services/layersettings.service';
import {
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
} from '@coreui/angular';

@Component({
    selector: 'app-single-color',
    standalone: true,
    imports: [
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
    ],
    templateUrl: './single-color.component.html',
    styleUrl: './single-color.component.css',
})
export class SingleColorComponent implements VisualizationConfiguration {
    constructor(
        @Inject('config') protected config: SingleColorVisualization,
        private layerSettings: LayerSettingsService,
    ) {}

    configChanged() {
        this.layerSettings.visualizationConfigurationChanged(this.config);
    }
}
