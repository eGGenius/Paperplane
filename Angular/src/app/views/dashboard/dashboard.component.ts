import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Model } from 'src/assets/interfaces/Model';
import { ChartComponent, ApexAxisChartSeries} from "ng-apexcharts";
import { Material } from 'src/assets/interfaces/Material';

import {ApexNonAxisChartSeries, ApexTitleSubtitle, ApexXAxis, ApexResponsive, ApexChart} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  materialStock: any;


  constructor(private http: HttpService) {
    var arr_names:number[] = new Array(4)
    var arr_val:number[] = new Array(4)
    this.http.getAllMaterialStock().subscribe((data: Material[]) => {
      this.materialStock = data;

      for(var i = 0;i<arr_val.length;i++) { 
        arr_val[i] = this.materialStock[i].stock;
     }
     for(var i = 0;i<arr_names.length;i++) { 
      arr_names[i] = this.materialStock[i].materialId;
     }

    this.chartOptions = {
      series: [
        {
          name: "Series",
          data: arr_val
        }
      ],
      chart: {
        height: 300,
        width: 300,
        type: "radar"
      },
      title: {
        text: "Basic Radar Chart"
      },
      xaxis: {
        categories: arr_names
      }
    };
  });
  }
}