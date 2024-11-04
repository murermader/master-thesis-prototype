import {Component} from '@angular/core';
import {LayerSettingsService} from '../services/layersettings.service';
import {FormControlDirective, FormLabelDirective} from '@coreui/angular';
import {PolyphenyResult} from '../models/PolyphenyResult.model';
import {FeatureCollection, GeoJSON} from 'geojson';
import {PolyphenyResults} from '../models/PolyphenyResults.model';
import {MapLayer} from "../models/MapLayer.model";
import {SingleColorVisualization} from "../models/visualization/SingleColorVisualization.model";

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

    constructor(protected layerSettings: LayerSettingsService) {
    }

    async addLayerFromGeoJsonFile($event: Event) {
        if (!event) {
            return;
        }

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            const geoJson: FeatureCollection = JSON.parse(await file.text());
            const layer = new MapLayer(geoJson.features.map(
                (f, i) => new PolyphenyResult(i, f.geometry),
            ), new SingleColorVisualization("red", 5))
            this.layerSettings.setLayers([layer])
        }
    }
}
