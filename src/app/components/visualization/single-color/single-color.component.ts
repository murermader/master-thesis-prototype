import { Component, Inject } from '@angular/core';
import { SingleColorVisualization } from '../single-color-visualization.model';
import { VisualizationConfiguration } from '../../../models/visualization-configuration.interface';
import { FormsModule } from '@angular/forms';
import { LayerSettingsService } from '../../../services/layersettings.service';

@Component({
    selector: 'app-single-color',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './single-color.component.html',
    styleUrl: './single-color.component.css',
})
export class SingleColorComponent implements VisualizationConfiguration {
    size: number = 0;
    color: string = '';

    constructor(
        @Inject('config') protected config: SingleColorVisualization,
        private layerSettings: LayerSettingsService,
    ) {
        this.size = config.size;
        this.color = config.color;
    }

    configChanged() {
        this.layerSettings.visualizationConfigurationChanged(this.config);
    }
}
