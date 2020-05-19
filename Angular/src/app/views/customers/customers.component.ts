import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: any;
  
  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getAllCustomers().subscribe((data) => {
      this.customers = data
    });
  }

}

//     public getAllCustomers() {
//   return this.httpClient.get(this.url + 'customers/all');
// }
