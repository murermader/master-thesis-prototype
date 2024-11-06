import {ChangeDetectionStrategy, Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { LayerSettingsService } from '../../services/layersettings.service';
import { FormControlDirective, FormLabelDirective } from '@coreui/angular';
import { RowResult } from '../../models/RowResult.model';
import { FeatureCollection } from 'geojson';
import { MapLayer } from '../../models/MapLayer.model';
import { SingleColorVisualization } from '../visualization/single-color-visualization.model';
import {AsyncPipe, NgComponentOutlet, NgIf} from '@angular/common';
import {Visualization} from "../../models/visualization.interface";
import isEqual from 'lodash/isEqual';

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
    protected renderedLayers: MapLayer[] = []

    constructor(protected layerSettings: LayerSettingsService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.layerSettings.layers$.subscribe((layers) => {
            if (!layers) {
                return;
            }

            this.layers = layers;
            this.renderedLayers = this.deepCopyLayers(layers);
            this.layerSettings.setCanRerenderLayers(false);

            // Disable Change Detection and manually trigger to prevent rerenders when mouse moves
            this.cdRef.markForCheck();
        });

        this.layerSettings.modifiedVisualization$.subscribe((config) => {
            if (!config) {
                return;
            }

            const canRerenderLayers = !isEqual(this.deepCopyLayers(this.layers), this.renderedLayers)
            console.log("Config changed. Rerender layers?", canRerenderLayers)
            this.layerSettings.setCanRerenderLayers(canRerenderLayers);
        });

        this.layerSettings.rerenderButtonClicked$.subscribe(() => {
            this.layerSettings.setLayers(this.layers);
        });
    }

    deepCopyLayers(layers: MapLayer[]){
        return layers.map(layer => layer.copy());
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
                    (f, i) => new RowResult(i, f.geometry),
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
