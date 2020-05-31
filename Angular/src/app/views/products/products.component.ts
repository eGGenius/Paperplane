import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Model } from 'src/assets/interfaces/Model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Model[];

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getAllProductStock().subscribe((data: Model[]) => {
      this.products = data;
    });
  }
}