import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Model } from 'src/assets/interfaces/Model';
import { ChartComponent, ApexAxisChartSeries } from "ng-apexcharts";
import { Material } from 'src/assets/interfaces/Material';
import { ApexTitleSubtitle, ApexXAxis, ApexResponsive, ApexChart } from "ng-apexcharts";
import { Order } from 'src/assets/interfaces/Order';
import { Account } from 'src/assets/interfaces/Account';

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
  productStock: any;
  matChartOptions: {
    series: {
      name: string; data: number[];
    }[]; chart: {
      height: number; type: string;
    }; title: {
      text: string;
    }; xaxis: {
      categories: number[];
    };
  };
  prodChartOptions: {
    series: {
      name: string; data: number[];
    }[]; chart: {
      height: number; type: string;
    }; title: {
      text: string;
    }; xaxis: {
      categories: number[];
    };
  };

  orders: Order[] = [];
  ordersDone: Order[] = [];

  wareneinsatz: number = 0;
  amount: any;

  positive: Boolean = false;
  neutral: Boolean = false;
  negative: Boolean = false;


  constructor(private http: HttpService) {
    this.http.getAllMaterialStock().subscribe((data: Material[]) => {
      this.materialStock = data;
      var mat_names: number[] = new Array(Object.keys(this.materialStock).length)
      var mat_val: number[] = new Array(Object.keys(this.materialStock).length)
      for (var i = 0; i < mat_val.length; i++) {
        mat_val[i] = this.materialStock[i].stock;
        mat_names[i] = this.materialStock[i].identifier;
        this.wareneinsatz = this.wareneinsatz + this.materialStock[i].stock * this.materialStock[i].pricePerUnit;
      }

      this.http.getAccountBalance().subscribe((data: Account) => {
        if (data.balance > 0) {
          this.positive = true;
          this.neutral = false;
          this.negative = false;
        }
        else if (data.balance === 0) {
          this.positive = false;
          this.neutral = true;
          this.negative = false;
        }
        else if (data.balance < 0) {
          this.positive = false;
          this.neutral = false;
          this.negative = true;
        }
        this.amount = Number(data.balance).toLocaleString('de');
      });

      this.http.getAllOrders().subscribe((data: Order[]) => {
        data.forEach(order => {
          switch (order.status) {
            case 'progress':
              this.orders.push(order);
              break;
            case 'done':
              this.orders.push(order);
              break;
            case 'delivered':
              this.ordersDone.push(order);
              break;
          }
        });
      });

      this.http.getAllProductStock().subscribe((data: Model[]) => {
        this.productStock = data;
        var prod_names: number[] = new Array(Object.keys(this.productStock).length)
        var prod_val: number[] = new Array(Object.keys(this.productStock).length)

        for (var i = 0; i < prod_val.length; i++) {
          prod_val[i] = this.productStock[i].stock;
        }
        for (var i = 0; i < prod_names.length; i++) {
          prod_names[i] = this.productStock[i].identifier;
        }

        this.matChartOptions = {

          series: [{
            name: "Series",
            data: mat_val
          }],
          chart: {
            height: 400,
            type: "radar"
          },
          title: {
            text: "Basic Radar Chart"
          },
          xaxis: {
            categories: mat_names,
          }
        };
        this.prodChartOptions = {
          series: [{
            name: "Series",
            data: prod_val
          }],
          chart: {
            height: 400,
            type: "radar"
          },
          title: {
            text: "Basic Radar Chart"
          },
          xaxis: {
            categories: prod_names
          }
        };
      });
    });
  }
}