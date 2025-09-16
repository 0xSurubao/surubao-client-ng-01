// base libs
// import { Component } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import 'flowbite';

// third
import { NgxEchartsModule, NGX_ECHARTS_CONFIG, provideEchartsCore, NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([BarChart, GridComponent, CanvasRenderer]);

// from project
import { AppEnvironmentHandler, environment } from '../../environments/environment';
import { EnviromentData } from '../../environments/environment';
import { AppVersionPanelComponent } from "../_jovdk-web/features/app-version-panel/app-version-panel.component";
import { ThreeJsBaseSceneComponent } from './../_jovdk-web-threejs/features/base-scene/threejs-base-scene.component';
import { NgFor, NgIf } from '@angular/common';
import { NavBarComponent } from "../_app/features/home/nav-bar/nav-bar.component";


import { Component, VERSION, ViewChildren, QueryList, AfterViewInit, OnDestroy, ContentChildren, inject, ViewChild } from '@angular/core';
import { ImgLoadingDirective } from '../_app/features/custom-directives/img-loading.directive';
import { forkJoin, Subscription } from 'rxjs';
import { ImageService } from './ImageService';
import { LocalizationService } from '../_jovdk-web/features/localization-service/localization-service.service';
import { EChartsOption } from 'echarts';

import { LegendComponent } from 'echarts/components';
echarts.use([LegendComponent]);
import { TooltipComponent } from 'echarts/components';
echarts.use([TooltipComponent]);
import { DataZoomComponent } from 'echarts/components';
echarts.use([DataZoomComponent]);
import { ToolboxComponent } from 'echarts/components';
echarts.use([ToolboxComponent])
import { BrushComponent } from 'echarts/components';
echarts.use([BrushComponent]);
import { CandlestickChart } from 'echarts/charts';
echarts.use([CandlestickChart]);
import { LineChart } from 'echarts/charts';
echarts.use([LineChart]);

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [
        // NgIf,
        // NgFor,
        AppVersionPanelComponent,
        // ThreeJsBaseSceneComponent,
        NavBarComponent,
        // ImgLoadingDirective,
        NgxEchartsModule,
        NgxEchartsDirective,
    ],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css',
    // providers: [
    //     { provide: NGX_ECHARTS_CONFIG, useValue: { echarts: () => import('echarts') } },
    // ],
    providers: [
        provideEchartsCore({ echarts }),
    ]
})
export class FullAppComponent
{
    // dependencies
    _environmentData: EnviromentData = environment;
    _localizationService: LocalizationService = inject(LocalizationService);
    _imageService: ImageService = inject(ImageService);

    // state
    _isLoadingContent = true;
    _isProd = AppEnvironmentHandler.IsProd();
    _isLocal = AppEnvironmentHandler.IsLocal();

    // parts
    @ViewChild('_threeJsBaseScene') _threeJsBaseScene!: ThreeJsBaseSceneComponent;

    // options: EChartsOption | null = null;


    options: EChartsOption | null = {
        animation: false,
        backgroundColor: '#111',
        textStyle: {
            color: '#ddd',
            fontFamily: 'monospace',
        },
        legend: {
            bottom: 10,
            left: 'center',
            data: ['Candles', 'MA5', 'MA10', 'Volume'],
            textStyle: { color: '#ccc' },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }],
        },
        grid: [
            { left: '10%', right: '8%', top: 30, height: '60%' },   // candles
            { left: '10%', right: '8%', top: '75%', height: '15%' } // volume
        ],
        xAxis: [
            {
                type: 'category',
                gridIndex: 0,
                data: [], // timestamps
                boundaryGap: false,
                axisLine: { lineStyle: { color: '#888' } },
            },
            {
                type: 'category',
                gridIndex: 1,
                data: [], // timestamps
                boundaryGap: false,
                axisLine: { lineStyle: { color: '#888' } },
            },
        ],
        yAxis: [
            {
                scale: true,
                gridIndex: 0,
                splitLine: { show: true, lineStyle: { color: '#333' } },
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                splitLine: { show: false },
            },
        ],
        dataZoom: [
            { type: 'inside', xAxisIndex: [0, 1] },
            { type: 'slider', xAxisIndex: [0, 1], height: 20, bottom: 0 },
        ],
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: false },
                restore: {},
                saveAsImage: {},
                brush: { type: ['lineX', 'lineY', 'rect', 'polygon', 'keep', 'clear'] },
            },
        },
        brush: {
            toolbox: ['rect', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: [0, 1],
            throttleType: 'debounce',
            throttleDelay: 200,
        },
        series: [
            {
                name: 'Candles',
                type: 'candlestick',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [], // [[open, close, low, high], ...]
                itemStyle: {
                    color: '#0f0',      // candle up
                    color0: '#f00',     // candle down
                    borderColor: '#0f0',
                    borderColor0: '#f00',
                },
                markLine: {
                    symbol: ['none', 'none'],
                    data: [
                        { yAxis: 100, name: 'Support' },
                        { yAxis: 120, name: 'Resistance' },
                    ],
                    lineStyle: { type: 'dashed', color: '#ff0' },
                },
            },
            {
                name: 'MA5',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [], // array de médias móveis
                smooth: true,
                lineStyle: { color: '#FFD700' },
            },
            {
                name: 'MA10',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [],
                smooth: true,
                lineStyle: { color: '#00BFFF' },
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [], // volumes
                itemStyle: { color: '#888' },
            },
        ],
    };

    // source for x-axis labels
    // timestamps: (string | number)[] = [];



    constructor()
    {
        this._imageService.imagesLoading$.subscribe(
            (value) =>
            {
                // console.log('>>>>>> images.length = ' + value);

                if (value == 0)
                    this._isLoadingContent = false;
            });
    }

    ngOnInit()
    {
        // aqui você injeta dados reais
        // this.options.xAxis[0].data = this.timestamps
        // this.options.series[0].data = candleOHLC
        // this.options.series[3].data = volumes
        // this.options.series[0].data = candleOHLC
        // this.options.series[3].data = volumes


        if (this.options)
        {
            // xAxis is typed as XAXisOption | XAXisOption[] | undefined, so guard and work with array shape
            const xAxis = this.options.xAxis;
            if (Array.isArray(xAxis))
            {
                // Cast to category axis when setting data to satisfy TS (only category axes have 'data')
                if (xAxis[0]) (xAxis[0] as any).data = timestamps;
                if (xAxis[1]) (xAxis[1] as any).data = timestamps;
            }

            // series is typed as SeriesOption | SeriesOption[] | undefined, so guard and work with array shape
            const series = this.options.series;
            if (Array.isArray(series))
            {
                if (series[0]) series[0].data = candleData;  // candles
                if (series[1]) series[1].data = ma5;         // MA5
                if (series[2]) series[2].data = ma10;        // MA10
                if (series[3]) series[3].data = volumeData;  // volume
            }
        }
    }

}


// timestamps (categorias no eixo X)
const timestamps = [
    '2025-09-01', '2025-09-02', '2025-09-03',
    '2025-09-04', '2025-09-05', '2025-09-06',
    '2025-09-07', '2025-09-08', '2025-09-09',
    '2025-09-10',
];

// candles OHLC [open, close, low, high]
const candleData = [
    [100, 105, 98, 108],
    [105, 102, 100, 107],
    [102, 110, 101, 112],
    [110, 115, 109, 118],
    [115, 112, 111, 116],
    [112, 118, 110, 120],
    [118, 125, 117, 127],
    [125, 122, 120, 126],
    [122, 130, 121, 132],
    [130, 128, 127, 133],
];

// volumes
const volumeData = [1500, 1200, 2000, 2500, 1800, 3000, 3500, 2200, 2800, 2600];

// médias móveis (MA5 e MA10 de exemplo)
const ma5 = [null, null, null, null, 107, 111, 116, 118, 122, 125];
const ma10 = [null, null, null, null, null, null, null, null, null, 114];
