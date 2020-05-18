import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit {

  materialStock: any;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getAllMaterialStock().subscribe((data) => {
      this.materialStock = data;
    });
  }

  onSubmit(data: any) {
    // console.log('Amount: ' + data.amount);
    this.http.updateMaterialStock(data.materialId, data.amount);
  }
}