import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';

import { AppVersionPanelComponent } from '../_jovdk-web/features/app-version-panel/app-version-panel.component';
import { NavBarComponent } from '../_app/features/home/nav-bar/nav-bar.component';
import { OracleService, OraclePricePoint } from '../core/oracle/oracle.service';

import { environment } from '../../environments/environment';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [
        CommonModule,
        DecimalPipe,
        NgIf,
        NavBarComponent,
        AppVersionPanelComponent,
        NgxEchartsModule,
        NgxEchartsDirective,
    ],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css',
    providers: [provideEchartsCore({ echarts })],
})
export class FullAppComponent implements OnInit {
    private readonly oracleService = inject(OracleService);

    readonly networkName = environment.name;
    readonly contractId = environment.oracle.reflector.contractIdXlmUsdc ?? environment.oracle.reflector.contractIdXlmUsdt ?? 'N/A';
    readonly priceHistory: OraclePricePoint[] = [];

    chartOptions: EChartsOption | null = null;
    latestPoint: OraclePricePoint | null = null;
    isLoading = false;
    errorMessage: string | null = null;

    async ngOnInit(): Promise<void> {
        await this.refreshPrice();
    }

    async refreshPrice(): Promise<void> {
        this.isLoading = true;
        try {
            const point = await this.oracleService.fetchLatestPrice();
            this.pushPoint(point);
            this.latestPoint = point;
            this.errorMessage = null;
            this.updateChartOptions();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load oracle price.';
            this.errorMessage = message;
        } finally {
            this.isLoading = false;
        }
    }

    private pushPoint(point: OraclePricePoint): void {
        const alreadyExists =
            this.priceHistory.length > 0 &&
            this.priceHistory[this.priceHistory.length - 1].rawTimestamp === point.rawTimestamp;

        if (!alreadyExists) {
            this.priceHistory.push(point);
        }

        if (this.priceHistory.length > 50) {
            this.priceHistory.shift();
        }
    }

    private updateChartOptions(): void {
        const categories = this.priceHistory.map((point) =>
            new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        );
        const values = this.priceHistory.map((point) => Number(point.price.toFixed(6)));

        this.chartOptions = {
            animation: true,
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: '#1e293b',
                textStyle: { color: '#e2e8f0' },
            },
            grid: {
                left: '2%',
                right: '2%',
                top: 30,
                bottom: 40,
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: categories,
                axisLine: { lineStyle: { color: '#1e293b' } },
                axisLabel: { color: '#94a3b8' },
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisLabel: { color: '#94a3b8' },
                splitLine: {
                    show: true,
                    lineStyle: { color: 'rgba(148, 163, 184, 0.15)' },
                },
            },
            series: [
                {
                    type: 'line',
                    name: 'Price',
                    smooth: true,
                    showSymbol: false,
                    symbolSize: 6,
                    data: values,
                    lineStyle: { width: 3 },
                    areaStyle: {
                        color: 'rgba(14, 165, 233, 0.1)',
                    },
                },
            ],
        } satisfies EChartsOption;
    }
}
