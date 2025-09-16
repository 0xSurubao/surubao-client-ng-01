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

}
