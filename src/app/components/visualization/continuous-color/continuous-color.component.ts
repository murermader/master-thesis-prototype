import { Component, Inject } from '@angular/core';
import { VisualizationConfiguration } from '../../../models/visualization-configuration.interface';
import { FormsModule } from '@angular/forms';
import { LayerSettingsService } from '../../../services/layersettings.service';
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
} from '@coreui/angular';
import { ContinuousColorVisualization } from '../continuous-color-visualization.model';

@Component({
    selector: 'app-continuous-color',
    standalone: true,
    imports: [
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
    ],
    templateUrl: './continuous-color.component.html',
    styleUrl: './continuous-color.component.css',
})
export class ContinuousColorComponent implements VisualizationConfiguration {
    constructor(
        @Inject('config') protected config: ContinuousColorVisualization,
        private layerSettings: LayerSettingsService,
    ) {}

    configChanged() {
        this.layerSettings.visualizationConfigurationChanged(this.config);
    }
}
