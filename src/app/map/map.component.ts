import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerSettingsService } from '../services/layersettings.service';
import { MapLayer } from '../models/MapLayer.model';
import { debounceTime, Subject } from 'rxjs';
import { PolyphenyResult } from '../models/PolyphenyResult.model';
import { Visualization } from '../models/visualization/Visualization.model';
import { Point } from 'geojson';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
    currentBaseLayer: L.TileLayer | undefined;
    layers: MapLayer[] = [];

    readonly MIN_ZOOM = 0;
    readonly MAX_ZOOM = 19;
    readonly INITIAL_ZOOM = 6;
    private map!: L.Map;
    private svg:
        | d3.Selection<SVGSVGElement, unknown, null, undefined>
        | undefined;
    private g: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;

    constructor(private layerSettings: LayerSettingsService) {}

    ngOnInit() {
        this.layerSettings.selectedBaseLayer$.subscribe((item) => {
            if (!item) {
                return;
            }

            if (this.currentBaseLayer) {
                this.map.removeLayer(this.currentBaseLayer);
            }

            if (item != 'EMPTY') {
                this.currentBaseLayer = L.tileLayer(item, {
                    maxZoom: this.MAX_ZOOM,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(this.map);
            }
        });

        this.layerSettings.layers$.subscribe((item) => {
            if (!item) {
                return;
            }

            this.layers = item;
            this.renderLayersWithD3();
        });
    }

    ngAfterViewInit(): void {
        this.map = L.map('map').setView([52, 10], this.INITIAL_ZOOM);
        this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
        // this.svg = d3.select("#d3")
        this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
        this.map.on('zoomend moveend', () => {
            this.updateSvgPosition();
        });

        this.currentBaseLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: this.MAX_ZOOM,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        ).addTo(this.map);
    }

    updatePositions() {
        if (!this.g) {
            return;
        }

        this.g
            .selectAll('circle')
            .each((d) => {
                if (!(d instanceof PolyphenyResult)) {
                    return;
                }
                const layerPoint = this.map.latLngToLayerPoint([
                    d.getPoint().coordinates[1],
                    d.getPoint().coordinates[0],
                ]);
                d.cache['x'] = layerPoint.x;
                d.cache['y'] = layerPoint.y;
            })
            .attr('cx', (d) =>
                d instanceof PolyphenyResult ? d.cache['x'] : null,
            )
            .attr('cy', (d) =>
                d instanceof PolyphenyResult ? d.cache['y'] : null,
            );
    }

    updateSvgPosition() {
        if (!this.svg || !this.g) {
            return;
        }

        this.updatePositions();

        const bounds = this.map.getBounds();
        const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        const bottomRight = this.map.latLngToLayerPoint(bounds.getSouthEast())
        this.svg
            .style('width', '999999px')
            .style('height', '999999px')
            .style('left', topLeft.x + 'px')
            .style('top', topLeft.y + 'px')
        this.g.attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);

        // const bounds = this.map.getBounds();
        // const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        // const bottomRight = this.map.latLngToLayerPoint(bounds.getSouthEast());
        // this.svg
        //     .style('width', bottomRight.x - topLeft.x + 'px')
        //     .style('height', bottomRight.y - topLeft.y + 'px')
        //     .style('left', topLeft.x + 'px')
        //     .style('top', topLeft.y + 'px')
        //     .attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);
    }

    renderLayersWithD3() {
        if (!this.svg || !this.g) {
            return;
        }

        // Set SVG position correctly
        this.updateSvgPosition();

        // 2. Remove all previously added elements
        this.g.selectAll('*').remove();

        // 3. Render each layer individually
        for (const layer of this.layers) {
            const points = layer.data.filter((d) => d.geometry.type == 'Point');
            this.createPoints(points, layer.visualization);
        }

        // Calc bounds of all shapes
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

// Iterate over all elements inside the SVG
//         this.svg.selectAll("*").each(function() {
//             let bbox = this.getBoundingClientRect();
//
//             // Update the overall bounds
//             minX = Math.min(minX, bbox.left);
//             minY = Math.min(minY, bbox.top);
//             maxX = Math.max(maxX, bbox.right);
//             maxY = Math.max(maxY, bbox.bottom);
//         });

        const bounds = this.map.getBounds();
        const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        const bottomRight = this.map.latLngToLayerPoint(bounds.getSouthEast())
        this.svg
            .style('width', '999999px')
            .style('height', '999999px')
            .style('left', topLeft.x + 'px')
            .style('top', topLeft.y + 'px')

        // 4. Update positions.
        // this.updatePositions();
    }

    createPoints(points: PolyphenyResult[], visualization: Visualization) {
        if (!this.g) {
            return;
        }

        this.g
            .selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('r', visualization.getValueForAttribute('r'))
            .attr('fill', visualization.getValueForAttribute('fill'))
            .each((d) => {
                const layerPoint = this.map.latLngToLayerPoint([
                    d.getPoint().coordinates[1],
                    d.getPoint().coordinates[0],
                ]);
                d.cache['x'] = layerPoint.x;
                d.cache['y'] = layerPoint.y;
            })
            .attr('cx', (d) => d.cache['x'])
            .attr('cy', (d) => d.cache['y']);
    }
}
