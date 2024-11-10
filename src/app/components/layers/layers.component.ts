import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { LayerContext } from '../../models/LayerContext.model';
import { LayerSettingsService } from '../../services/layersettings.service';
import {
    ButtonCloseDirective,
    ButtonDirective,
    FormControlDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
} from '@coreui/angular';
import { RowResult } from '../../models/RowResult.model';
import * as GeoJSON from 'geojson';
import { MapLayer } from '../../models/MapLayer.model';
import { SingleColorVisualization } from '../visualization/single-color-visualization.model';
import { AsyncPipe, NgComponentOutlet, NgIf } from '@angular/common';
import isEqual from 'lodash/isEqual';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-layers',
    standalone: true,
    imports: [
        FormLabelDirective,
        FormControlDirective,
        AsyncPipe,
        NgComponentOutlet,
        NgIf,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ButtonDirective,
        CdkDropList,
        CdkDrag,
        CdkDragPlaceholder,
        CdkDragHandle,
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
    protected isAddLayerModalVisible = false;
    protected loadedGeoJsonFile?: GeoJSON.FeatureCollection = undefined;
    protected loadedGeoJsonFileName: string = '';
    protected addLayerContext: LayerContext = LayerContext.External;
    protected anyLayersVisible = false;

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
            this.updateLayers(this.layers);
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
        const data3 = `
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "source": "© GeoBasis-DE / BKG 2013 (Daten verändert)",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "ADE": 4,
        "GF": 4,
        "BSG": 1,
        "RS": "01001",
        "AGS": "01001",
        "SDV_RS": "010010000000",
        "GEN": "Flensburg",
        "BEZ": "Kreisfreie Stadt",
        "IBZ": 40,
        "BEM": "--",
        "NBD": "ja",
        "SN_L": "01",
        "SN_R": "0",
        "SN_K": "01",
        "SN_V1": "00",
        "SN_V2": "00",
        "SN_G": "000",
        "FK_S3": "R",
        "NUTS": "DEF01",
        "RS_0": "010010000000",
        "AGS_0": "01001000",
        "WSK": "2008/01/01",
        "DEBKG_ID": "DEBKGDL20000002R",
        "destatis": {
          "population": 89504,
          "population_m": 44599,
          "population_w": 44905
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              9.412664108896104,
              54.8226409083269
            ],
            [
              9.42293404920774,
              54.82322297871825
            ],
            [
              9.437558196380342,
              54.80891340493068
            ],
            [
              9.428511475527905,
              54.800088026152174
            ],
            [
              9.436697178516075,
              54.78874409302239
            ],
            [
              9.438340826643119,
              54.803003371483264
            ],
            [
              9.442017460283664,
              54.8045726244278
            ],
            [
              9.440602675507414,
              54.800542052052265
            ],
            [
              9.44377911558914,
              54.805138125360195
            ],
            [
              9.45272991922579,
              54.80754852411532
            ],
            [
              9.457996005091418,
              54.81748018625207
            ],
            [
              9.467334502006006,
              54.82363231794173
            ],
            [
              9.490818773428426,
              54.82360740385943
            ],
            [
              9.492051905584956,
              54.81484953235985
            ],
            [
              9.505431081139028,
              54.81020748745684
            ],
            [
              9.503832434139722,
              54.804173364192415
            ],
            [
              9.499697545164823,
              54.803620434251044
            ],
            [
              9.505415377819059,
              54.799599946181225
            ],
            [
              9.49897574907422,
              54.79865203655195
            ],
            [
              9.506569452474432,
              54.79209752788728
            ],
            [
              9.502180299595505,
              54.77927472276625
            ],
            [
              9.505817873713303,
              54.77311082549625
            ],
            [
              9.49333489486901,
              54.76925229907075
            ],
            [
              9.474710042387382,
              54.7723792229719
            ],
            [
              9.47224934519076,
              54.76692973048646
            ],
            [
              9.460273736377953,
              54.76028982884087
            ],
            [
              9.460965252316052,
              54.75421956913382
            ],
            [
              9.453087744581662,
              54.75211765297414
            ],
            [
              9.379014517860757,
              54.75320021546097
            ],
            [
              9.35722059154765,
              54.77948194407854
            ],
            [
              9.405606646774057,
              54.79555897805081
            ],
            [
              9.402263643524694,
              54.808318620169885
            ],
            [
              9.411513078436418,
              54.816008174158625
            ],
            [
              9.404694993761636,
              54.82248286917383
            ],
            [
              9.412664108896104,
              54.8226409083269
            ]
          ]
        ]
      }
    }
  ]
}
`;
        const geoJson: GeoJSON.FeatureCollection = JSON.parse(data);
        const geoJson2: GeoJSON.FeatureCollection = JSON.parse(data2);
        const geoJson3: GeoJSON.FeatureCollection = JSON.parse(data3);

        this.updateLayers([
            new MapLayer(
                'a',
                1,
                new SingleColorVisualization('red', 5),
            ).addData(
                geoJson.features.map((f, i) => new RowResult(i, f.geometry)),
            ),
            new MapLayer(
                'b',
                2,
                new SingleColorVisualization('green', 5),
            ).addData(
                geoJson2.features.map((f, i) => new RowResult(i, f.geometry)),
            ),
            new MapLayer(
                'Landkreise',
                3,
                new SingleColorVisualization('pink', 2),
            ).addData(
                geoJson3.features.map((f, i) => new RowResult(i, f.geometry)),
            ),
        ]);
    }

    deepCopyLayers(layers: MapLayer[]) {
        return layers.map((layer) => layer.copy());
    }

    async loadGeoJsonFile($event: Event) {
        if (!event) {
            return;
        }
        try {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length) {
                const file = input.files[0];
                this.loadedGeoJsonFileName = file.name;
                this.loadedGeoJsonFile = JSON.parse(await file.text());
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(`Failed to load file: ${error.message}`);
            }
            this.loadedGeoJsonFile = undefined;
        }
    }

    removeLayer(layer: MapLayer) {
        layer.isRemoved = true;
        if (layer.isActive) {
            this.toggleLayerVisibility(layer);
            this.updateIsAnyLayerVisible()
        }
    }

    addLayer() {
        switch (this.addLayerContext) {
            case LayerContext.Results:
                alert('TODO');
                break;
            case LayerContext.Query:
                alert('TODO');
                break;
            case LayerContext.DB:
                alert('TODO');
                break;
            case LayerContext.External:
                if (this.loadedGeoJsonFile) {
                    const layer = new MapLayer(
                        this.loadedGeoJsonFileName,
                        this.layers.length + 1,
                        new SingleColorVisualization('red', 5),
                    ).addData(
                        this.loadedGeoJsonFile.features.map(
                            (f, i) => new RowResult(i, f.geometry),
                        ),
                    );
                    const newLayers = [
                        ...this.layers.filter((l) => !l.isRemoved),
                        layer,
                    ].map((v, i) => {
                        v.index = i + 1;
                        return v;
                    });
                    this.updateLayers(newLayers)
                } else {
                    alert(`No file selected / File could not be loaded.`);
                }
                break;
        }
        this.isAddLayerModalVisible = false;
    }

    dropLayer(event: CdkDragDrop<MapLayer[]>) {
        console.log(event);
        moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
        this.updateLayers(this.layers);
    }

    updateLayers(newLayers: MapLayer[]) {
        this.layerSettings.setLayers(newLayers);
        this.updateIsAnyLayerVisible();
    }

    toggleLayerVisibility(layer: MapLayer) {
        layer.isActive = !layer.isActive;
        this.layerSettings.toggleLayerVisibility(layer);
    }

    toggleAddLayerModalVisibility() {
        this.isAddLayerModalVisible = !this.isAddLayerModalVisible;
    }

    addLayerModalVisibilityChanged(event: any) {
        this.isAddLayerModalVisible = event;
    }

    updateIsAnyLayerVisible(){
        this.anyLayersVisible = this.layers.filter((d) => !d.isRemoved).length > 0;
        console.log("AnyLayerVisible: ", this.anyLayersVisible, this.layers);
    }
}
