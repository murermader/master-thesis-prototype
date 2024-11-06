import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { LayersComponent } from './components/layers/layers.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MapComponent, LayersComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {}
