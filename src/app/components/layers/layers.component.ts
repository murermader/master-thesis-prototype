import { Component, OnInit } from '@angular/core';
import { LayerContext } from '../../models/LayerContext.model';
import { LayerSettingsService } from '../../services/layersettings.service';
import {
    ButtonCloseDirective,
    ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    InputGroupComponent,
    InputGroupTextDirective,
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
import { AsyncPipe, NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import isEqual from 'lodash/isEqual';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { getSampleMapLayers } from '../../models/get-sample-maplayers';
import { FormsModule } from '@angular/forms';
import { Visualization } from '../../models/visualization.interface';

type BaseLayer = { name: string; value: string };

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
        InputGroupComponent,
        InputGroupTextDirective,
        FormSelectDirective,
        FormsModule,
        NgForOf,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
    ],
    templateUrl: './layers.component.html',
    styleUrl: './layers.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayersComponent implements OnInit {
    protected baseLayers: BaseLayer[] = [
        {
            name: 'OSM',
            value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
            name: 'OSM Hot',
            value: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        },
        {
            name: 'Grey Background',
            value: 'EMPTY',
        },
    ];
    protected selectedBaseLayer: BaseLayer = this.baseLayers[0];
    protected layers: MapLayer[] = [];
    protected renderedLayers: MapLayer[] = [];
    protected isAddLayerModalVisible = false;
    protected loadedGeoJsonFile?: GeoJSON.FeatureCollection = undefined;
    protected loadedGeoJsonFileName: string = '';
    protected addLayerContext: LayerContext = LayerContext.External;
    protected anyLayersVisible = false;

    constructor(
        protected layerSettings: LayerSettingsService,
        // private cdRef: ChangeDetectorRef,
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
            // this.cdRef.markForCheck();
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

        // this.updateLayers(getSampleMapLayers());
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
            this.updateLayerUi();
        }
    }

    onBaseLayerChange(selectedLayer: BaseLayer): void {
        this.layerSettings.setBaseLayer(selectedLayer.value);
    }

    onLayerVisualizationChange(
        selectedLayer: MapLayer,
        selectedVisualization: Visualization,
    ) {
        selectedLayer.updateConfigInjector();
        this.layerSettings.visualizationConfigurationChanged(
            selectedLayer.visualization,
        );
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
                    ).addData(
                        this.loadedGeoJsonFile.features.map(
                            (f, i) => new RowResult(i, f.geometry, f),
                        ),
                    );
                    console.log('Added GeoJSON layer: ', layer);
                    const newLayers = [
                        ...this.layers.filter((l) => !l.isRemoved),
                        layer,
                    ].map((v, i) => {
                        v.index = i + 1;
                        return v;
                    });
                    this.updateLayers(newLayers);
                } else {
                    alert(`No file selected / File could not be loaded.`);
                }
                break;
        }
        this.isAddLayerModalVisible = false;
    }

    dropLayer(event: CdkDragDrop<MapLayer[]>) {
        // TODO: After dropping a layer, the UI is very buggy
        moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
        this.updateLayers(this.layers);
    }

    updateLayers(newLayers: MapLayer[]) {
        this.layerSettings.setLayers(newLayers);
        this.updateLayerUi();
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

    updateLayerUi() {
        // Layers which are first in the array are rendered first, and will be drawn over by other layers.
        // Layers: BOTTOM -> TOP
        const visibleLayers = this.layers.filter((d) => !d.isRemoved);
        for (let i = 0; i < visibleLayers.length; i++) {
            visibleLayers[visibleLayers.length - 1 - i].index = i + 1;
        }
        this.anyLayersVisible =
            this.layers.filter((d) => !d.isRemoved).length > 0;
    }
}
