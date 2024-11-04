import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerSettingsService } from '../services/layersettings.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  currentTileLayer: L.TileLayer | undefined;

  readonly MIN_ZOOM = 0;
  readonly MAX_ZOOM = 19;
  readonly INITIAL_ZOOM = 6;
  private map!: L.Map;

  constructor(private layerSettings: LayerSettingsService) {}

  ngOnInit() {
    this.layerSettings.selectedBaseLayer$.subscribe((item) => {
      if (!item) {
        // Do not overwrite Layer with null. For some reason this runs with item = null,
        // although no one called it.
        return;
      }

      console.log('Change base layer to', item);

      if (this.currentTileLayer) {
        this.map.removeLayer(this.currentTileLayer);
      }

      if (item != "EMPTY"){
        this.currentTileLayer = L.tileLayer(item, {
          maxZoom: this.MAX_ZOOM,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([52, 10], this.INITIAL_ZOOM);
    this.currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.MAX_ZOOM,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    console.log(this.currentTileLayer);
  }
}
