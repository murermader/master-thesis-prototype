import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GeoPath, GeoPermissibleObjects } from 'd3';
import * as d3Geo from 'd3-geo';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerSettingsService } from '../../services/layersettings.service';
import { MapLayer } from '../../models/MapLayer.model';
import { RowResult } from '../../models/RowResult.model';
import { ButtonDirective, SpinnerComponent } from '@coreui/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [SpinnerComponent, NgIf, ButtonDirective],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
    currentBaseLayer: L.TileLayer | undefined;
    layers: MapLayer[] = [];
    isLoading: boolean = false;
    isLoadingMessage: string = 'TODO isLoadingMessage';
    canRerenderLayers: boolean = false;

    readonly MIN_ZOOM = 0;
    readonly MAX_ZOOM = 19;
    readonly INITIAL_ZOOM = 6;
    private map!: L.Map;
    private svg:
        | d3.Selection<SVGSVGElement, unknown, null, undefined>
        | undefined;
    private g: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
    private circles:
        | d3.Selection<SVGCircleElement, RowResult, SVGGElement, unknown>
        | undefined;
    private paths:
        | d3.Selection<SVGPathElement, RowResult, SVGGElement, unknown>
        | undefined;
    private pathGenerator!: GeoPath<any, GeoPermissibleObjects>;

    constructor(protected layerSettings: LayerSettingsService) {}

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

        this.layerSettings.layers$.subscribe((layers) => {
            if (!layers || !layers.length) {
                return;
            }

            this.layers = layers;
            this.renderLayersWithD3();
        });

        this.layerSettings.canRerenderLayers$.subscribe((canRerenderLayers) => {
            this.canRerenderLayers = canRerenderLayers;
        });

        this.layerSettings.toggleLayerVisibility$.subscribe((layer) => {
            this.toggleLayerVisibility(layer);
        });
    }

    ngAfterViewInit(): void {
        const leafletMap = L.map('map').setView([52, 10], this.INITIAL_ZOOM);
        this.map = leafletMap;
        this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
        this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');

        function projectPoint(this: any, x: number, y: number) {
            const point = leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

        const transform = d3Geo.geoTransform({ point: projectPoint });
        this.pathGenerator = d3Geo.geoPath().projection(transform);

        this.map.on('zoomend', () => {
            this.updateSvgPosition();
        });
        this.map.on('moveend', () => {
            if (!this.svg || !this.g) {
                return;
            }
            const bounds = this.map.getBounds();
            const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
            const bottomRight = this.map.latLngToLayerPoint(
                bounds.getSouthEast(),
            );
            this.svg
                .style('width', '999999px')
                .style('height', '999999px')
                .style('left', topLeft.x + 'px')
                .style('top', topLeft.y + 'px');
            this.g.attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);
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

    showLoadingSpinner(message: string) {
        this.isLoading = true;
        this.isLoadingMessage = message;
    }

    updateSvgPosition() {
        this.showLoadingSpinner('Reposition shapes on map');

        setTimeout(() => {
            try {
                if (!this.g || !this.svg) {
                    return;
                }

                if (this.paths) {
                    this.paths.attr('d', (d) => this.pathGenerator(d.geometry));
                }

                if (this.circles) {
                    this.circles
                        .each((d) => {
                            const layerPoint = this.map.latLngToLayerPoint([
                                d.getPoint()!.coordinates[1],
                                d.getPoint()!.coordinates[0],
                            ]);
                            d.cache['x'] = layerPoint.x;
                            d.cache['y'] = layerPoint.y;
                        })
                        .attr('cx', (d) => d.cache['x'])
                        .attr('cy', (d) => d.cache['y']);
                }

                const bounds = this.map.getBounds();
                const topLeft = this.map.latLngToLayerPoint(
                    bounds.getNorthWest(),
                );
                const bottomRight = this.map.latLngToLayerPoint(
                    bounds.getSouthEast(),
                );
                this.svg
                    .style('width', '999999px')
                    .style('height', '999999px')
                    .style('left', topLeft.x + 'px')
                    .style('top', topLeft.y + 'px');
                this.g.attr(
                    'transform',
                    `translate(${-topLeft.x}, ${-topLeft.y})`,
                );
            } finally {
                this.isLoading = false;
            }
        }, 0);
    }

    renderLayersWithD3() {
        this.showLoadingSpinner('Rendering layers');

        setTimeout(() => {
            try {
                if (!this.svg || !this.g) {
                    return;
                }

                // Remove all previously added elements
                this.g.selectAll('*').remove();

                const points: RowResult[] = [];
                const paths: RowResult[] = [];

                // Add shapes from each layer to array
                for (const layer of this.layers) {
                    points.push(
                        ...layer.data.filter(
                            (d) => d.geometry.type === 'Point',
                        ),
                    );
                    paths.push(
                        ...layer.data.filter(
                            (d) => d.geometry.type !== 'Point',
                        ),
                    );
                }

                // Render all points
                console.log('Create Points: ', points);
                this.circles = this.createPoints(points);

                console.log('Create Paths: ', paths);
                this.paths = this.createPaths(paths);

                // Set SVG position correctly
                this.updateSvgPosition();
            } finally {
                this.isLoading = false;
            }
        }, 0);
    }

    createPoints(points: RowResult[]) {
        if (!this.g) {
            return;
        }

        return this.g
            .selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('layer-name', (d) => d.layer!.name)
            .attr('r', (d) => d.layer!.visualization.getValueForAttribute('r'))
            .attr('fill', (d) =>
                d.layer!.visualization.getValueForAttribute('fill'),
            )
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

    createPaths(paths: RowResult[]) {
        if (!this.g) {
            return;
        }

        return this.g
            .selectAll('.paths')
            .data(paths)
            .enter()
            .append('path')
            .attr('layer-name', (d) => d.layer!.name)
            .attr('d', (d) => this.pathGenerator(d.geometry))
            .attr('stroke', 'black')
            .attr('stroke-width', (d) =>
                d.layer!.visualization.getValueForAttribute('r'),
            )
            .attr('fill', (d) =>
                d.layer!.visualization.getValueForAttribute('fill'),
            );
    }

    toggleLayerVisibility(layer: MapLayer) {
        if (!this.g?.node()) {
            throw new Error('SVG g does not exist.');
        }

        const layerElements = this.g
            .node()!
            .querySelectorAll(`[layer-name='${layer.name}']`);

        if (!layerElements.length) {
            // Nothing to do
            return;
        }

        layerElements.forEach((elem) => {
            if (layer.isActive) {
                elem.classList.remove('layer-hidden');
            } else {
                elem.classList.add('layer-hidden');
            }
        });
    }
}
