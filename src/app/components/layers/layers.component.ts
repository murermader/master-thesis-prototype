import {ChangeDetectionStrategy, Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { LayerSettingsService } from '../../services/layersettings.service';
import { FormControlDirective, FormLabelDirective } from '@coreui/angular';
import { PolyphenyResult } from '../../models/PolyphenyResult.model';
import { FeatureCollection } from 'geojson';
import { MapLayer } from '../../models/MapLayer.model';
import { SingleColorVisualization } from '../visualization/single-color-visualization.model';
import {AsyncPipe, NgComponentOutlet, NgIf} from '@angular/common';
import {Visualization} from "../../models/visualization.interface";

@Component({
    selector: 'app-layers',
    standalone: true,
    imports: [
        FormLabelDirective,
        FormControlDirective,
        AsyncPipe,
        NgComponentOutlet,
        NgIf,
    ],
    templateUrl: './layers.component.html',
    styleUrl: './layers.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersComponent implements OnInit {
    protected baseLayerUrls = [
        'EMPTY',
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // OSM
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // OSM Hot

        // TODO: Jawg oder so hieß die andere coole map.
        // 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // OSM Hot
    ];
    protected layers: MapLayer[] = [];
    protected layersStringified: string = ""
    protected canRerenderLayers: boolean = false;

    constructor(protected layerSettings: LayerSettingsService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.layerSettings.layers$.subscribe((layers) => {
            if (!layers) {
                return;
            }

            this.layers = layers;
            this.layersStringified = JSON.stringify(layers)
            console.log(this.layersStringified)
            // Disable Change Detection and manually trigger to prevent rerenders when mouse moves
            this.cdRef.markForCheck();
        });

        this.layerSettings.modifiedVisualization$.subscribe((config) => {
            if (!config) {
                return;
            }

            this.canRerenderLayers = this.layersStringified != JSON.stringify(this.layers)
            console.log("Config changed. Rerender layers?", this.canRerenderLayers)
        });
    }

    async addLayerFromGeoJsonFile($event: Event) {
        if (!event) {
            return;
        }

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            const geoJson: FeatureCollection = JSON.parse(await file.text());
            const layer = new MapLayer(
                file.name,
                geoJson.features.map(
                    (f, i) => new PolyphenyResult(i, f.geometry),
                ),
                new SingleColorVisualization('red', 5),
            );
            const newLayers = [...this.layers, layer];
            this.layerSettings.setLayers(newLayers);
        }
    }

    createInjector(visualization: Visualization): Injector {
        return Injector.create({
            providers: [{ provide: 'config', useValue: visualization }],
        });
    }
}
