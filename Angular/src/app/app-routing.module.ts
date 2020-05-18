import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MaterialsComponent } from './views/materials/materials.component';
import { OrdersComponent } from './views/orders/orders.component';
import { CustomersComponent } from './views/customers/customers.component';
import { ModelsComponent } from './views/models/models.component';
import { ProductsComponent } from './views/products/products.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'models', component: ModelsComponent },
  { path: 'products', component: ProductsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
