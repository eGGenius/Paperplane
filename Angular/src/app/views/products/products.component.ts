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
  
  onSubmit(data: any) {
    // console.log('Amount: ' + data.amount);
    this.http.updateProductStock(data.modelIdentifier, data.amount).subscribe(data => {
      this.http.getAllProductStock().subscribe((data: Model[]) => {
        this.products = data;
      });
    });
  }

}


//  updateProductStock(model: String, number: Number) {
// }

// export interface Model {
//   "identifier": String;
//   "materials": [{ "materialId": String, "number": Number }];
//   "sellingPrice": Number;
//   "stock": Number;
// }