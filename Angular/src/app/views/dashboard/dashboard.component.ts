import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  materialStock: any;

  constructor(private http: HttpService) {

  }

  ngOnInit(): void {
    this.http.getAllMaterialStock().subscribe((data) => {
      this.materialStock = data;
    });
  }
}