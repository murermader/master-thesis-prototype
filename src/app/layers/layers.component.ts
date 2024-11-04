import { Component } from '@angular/core';
import { LayerSettingsService } from '../services/layersettings.service';

@Component({
  selector: 'app-layers',
  standalone: true,
  imports: [],
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
}
