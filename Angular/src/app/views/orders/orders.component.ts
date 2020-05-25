import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Order } from 'src/assets/interfaces/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  
  orders: Order[];

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getAllOrders().subscribe((data: Order[]) => {
      this.orders = data;  
        // Folgende Funktion filtert alle Aufträge die den Status "progress" und "delivery" haben
        // kann für eine Frontend Filterung so übernommen werden
        
      let filters = {
        status: ["progress", "delivery"]
      }
      this.orders = this.orders.filter(({
        status
      }) => filters.status.some(n => status.includes(n)));
    });
  }
}

// Order HTTP Requests in http-Service:

// POST createNewOrder(customerId: String, items: [{ model: String, number: Number }]) {
//       {"customerId":"' + customerId + '",
//       "items":"' + items + '"}

  // GET getAllOrders()

  // GET getAllOrdersInProgress()

  // GET getAllOrdersDone()
  
  // GET getAllOrdersInDelivery()

  // PUT updateOrderToDone(orderId: String) 
    // '{"status":"done"}'));