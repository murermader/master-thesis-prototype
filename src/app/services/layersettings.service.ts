import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapLayer } from '../models/MapLayer.model';
import {Visualization} from "../models/visualization.interface";

@Injectable({
    providedIn: 'root',
})
export class LayerSettingsService {
    private selectedBaseLayer = new BehaviorSubject<string>('EMPTY');
    selectedBaseLayer$ = this.selectedBaseLayer.asObservable();
    setBaseLayer(item: string) {
        this.selectedBaseLayer.next(item);
    }

    private layers = new BehaviorSubject<MapLayer[]>([]);
    layers$ = this.layers.asObservable();
    setLayers(layers: MapLayer[]) {
        this.layers.next(layers);
    }

    private modifiedVisualization = new BehaviorSubject<Visualization | null>(null);
    modifiedVisualization$ = this.modifiedVisualization.asObservable();
    visualizationConfigurationChanged(visualization: Visualization): void {
        this.modifiedVisualization.next(visualization);
    }
}
