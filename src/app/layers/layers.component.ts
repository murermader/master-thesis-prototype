import { Component } from '@angular/core';
import { LayerSettingsService } from '../services/layersettings.service';
import { FormControlDirective, FormLabelDirective } from '@coreui/angular';

@Component({
    selector: 'app-layers',
    standalone: true,
    imports: [FormLabelDirective, FormControlDirective],
    templateUrl: './layers.component.html',
    styleUrl: './layers.component.css',
})
export class LayersComponent {
    protected baseLayerUrls = [
        'EMPTY',
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // OSM
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // OSM Hot

        // TODO: Jawg oder so hieß die andere coole map.
        // 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // OSM Hot
    ];

    constructor(protected layerSettings: LayerSettingsService) {}

    addLayerFromGeoJsonFile($event: Event) {
        if (!event) {
            console.log('Event is undefined.');
            return;
        }

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            console.log('Selected file:', file); // You can handle the file here
        }
    }
}
