import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { LayerSettingsService } from '../../services/layersettings.service';
import { FormControlDirective, FormLabelDirective } from '@coreui/angular';
import { RowResult } from '../../models/RowResult.model';
import * as GeoJSON from 'geojson';
import { MapLayer } from '../../models/MapLayer.model';
import { SingleColorVisualization } from '../visualization/single-color-visualization.model';
import { AsyncPipe, NgComponentOutlet, NgIf } from '@angular/common';
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
    styleUrl: './layers.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    protected renderedLayers: MapLayer[] = [];

    constructor(
        protected layerSettings: LayerSettingsService,
        private cdRef: ChangeDetectorRef,
    ) {}

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

            const canRerenderLayers = !isEqual(
                this.deepCopyLayers(this.layers),
                this.renderedLayers,
            );
            console.log('Config changed. Rerender layers?', canRerenderLayers);
            this.layerSettings.setCanRerenderLayers(canRerenderLayers);
        });

        this.layerSettings.rerenderButtonClicked$.subscribe(() => {
            this.layerSettings.setLayers(this.layers);
        });

        const data = `
        {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.554898,
          52.333956
        ]
      },
      "properties": {
        "PLAC": "Kiekebusch,,Dahme-Spreewald,BRANDENBURG,DEUTSCHLAND,"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.983899,
          52.027206
        ]
      },
      "properties": {
        "PLAC": "Krugau,,Dahme-Spreewald,BRANDENBURG,DEUTSCHLAND,"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.958323,
          52.059514
        ]
      },
      "properties": {
        "PLAC": "Kuschkow,,Dahme-Spreewald,BRANDENBURG,DEUTSCHLAND,"
      }
    }
  ]
}`;
        const geoJson: GeoJSON.FeatureCollection = JSON.parse(data);
        console.log(geoJson)

        const data2 = `
        {
  "type": "FeatureCollection",
  "features": [
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.82575,
                52.56049
            ]
        },
        "properties": {
            "PLAC": "Dahlen,,,SACHSEN-ANHALT,DEUTSCHLAND,"
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.61667,
                51.63333
            ]
        },
        "properties": {
            "PLAC": "Gerbstedt,,,SACHSEN-ANHALT,DEUTSCHLAND,"
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.67008,
                52.077432
            ]
        },
        "properties": {
            "PLAC": "Salbke,39122,Magdeburg,SACHSEN-ANHALT,DEUTSCHLAND,"
        }
    }
  ]
}`;
        const geoJson2: GeoJSON.FeatureCollection = JSON.parse(data2);
        console.log(geoJson2)

        this.layerSettings.setLayers([
            new MapLayer(
                's',
                1,
                geoJson.features.map((f, i) => new RowResult(i, f.geometry)),
                new SingleColorVisualization('red', 5),
            ),
            new MapLayer(
                'b',
                2,
                geoJson2.features.map((f, i) => new RowResult(i, f.geometry)),
                new SingleColorVisualization('green', 10),
            ),
        ]);
    }

    deepCopyLayers(layers: MapLayer[]) {
        return layers.map((layer) => layer.copy());
    }

    async addLayerFromGeoJsonFile($event: Event) {
        if (!event) {
            return;
        }

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];

            const geoJson: GeoJSON.FeatureCollection = JSON.parse(
                await file.text(),
            );
            const layer = new MapLayer(
                file.name,
                this.layers.length + 1,
                geoJson.features.map((f, i) => new RowResult(i, f.geometry)),
                new SingleColorVisualization('red', 5),
            );
            const newLayers = [...this.layers, layer];
            this.layerSettings.setLayers(newLayers);
        }
    }

    removeLayer(layer: MapLayer) {
        layer.isRemoved = true;
        if (layer.isActive) {
            this.toggleLayerVisibility(layer);
        }
    }

    toggleLayerVisibility(layer: MapLayer) {
        layer.isActive = !layer.isActive;
        this.layerSettings.toggleLayerVisibility(layer);
    }
}
