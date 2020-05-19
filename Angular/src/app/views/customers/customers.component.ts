import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Customer } from 'src/assets/interfaces/Customer';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: Customer[];
  
  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getAllCustomers().subscribe((data: Customer[]) => {
      this.customers = data;
    });
  }

}