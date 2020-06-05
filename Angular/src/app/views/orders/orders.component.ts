import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Order } from 'src/assets/interfaces/Order';
import { Customer } from 'src/assets/interfaces/Customer';
import { CartItem } from 'src/assets/interfaces/CartItem';
import { Model } from 'src/assets/interfaces/Model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  
  orders: Order[];
  orderStatusFilter: String = 'showAll';

  shoppingCart: CartItem[] = [];
  customers: Customer[];
  models: Model[];

  sourceUrl: any;
  backendApi: string = 'http://localhost:8100/api/';

  constructor(private http: HttpService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.http.getAllOrders().subscribe((data: Order[]) => {
      this.orders = data;
    });
    
    this.http.getAllCustomers().subscribe((data: Customer[]) => {
      this.customers = data;
    });
    this.http.getAllModels().subscribe((data: Model[]) => {
      this.models = data;
    });
  }

  onStatusFilterChange(newStatusFilter) {
    this.orderStatusFilter = newStatusFilter;
    if(newStatusFilter === 'showInProgress') {
      this.http.getAllOrdersInProgress().subscribe((data: Order[]) => {
        this.orders = data;
      });
    } else if(newStatusFilter === 'showDone') {
      this.http.getAllOrdersDone().subscribe((data: Order[]) => {
        this.orders = data;
      });
    } else if(newStatusFilter === 'showDelivered') {
      this.http.getAllOrdersInDelivery().subscribe((data: Order[]) => {
        this.orders = data;
      }); 
    } else {
      this.http.getAllOrders().subscribe((data: Order[]) => {
        this.orders = data;
      })
    }
  }

  onUpdateOrderToProgress(order: Order) {
    if (order.status !== 'progress') {
      this.http.updateOrderToProgress(order.orderId).subscribe(data => {
        this.http.getAllOrders().subscribe((data: Order[]) => {
          this.orders = data;
        });
      });
    }
  }

  onUpdateOrderToDone(order: Order) {
    if (order.status !== 'done') {
      this.http.updateOrderToDone(order.orderId).subscribe(data => {
        this.http.getAllOrders().subscribe((data: Order[]) => {
          this.orders = data;
        });
      });
    }
  }

  onUpdateOrderToDelivered(order: Order) {
    if (order.status !== 'delivered') {
      this.http.UpdateOrderToDelivered(order.orderId).subscribe(data => {
        this.http.getAllOrders().subscribe((data: Order[]) => {
          this.orders = data;
        });
      });
    }
  }

  onAddToShoppingCart(item: CartItem) {
    this.shoppingCart.push(item);
  }

  onSubmit(data: any) {
    this.http.createNewOrder(data.customerId, this.shoppingCart).subscribe(data => {
      this.shoppingCart = [];
      this.http.getAllOrders().subscribe((data: Order[]) => {
        this.orders = data;
      });
    });
  }

  generateSourcePath(input: String) {
    var splitInput = input.split(/ |-/);
    let result: string = this.backendApi + "image/";
    for (let i = 0; i < splitInput.length; i++) {
      result += splitInput[i];
    }
    result += ".jpg";
    return this.domSanitizer.bypassSecurityTrustUrl(result);
  }
}