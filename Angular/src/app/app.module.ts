import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MaterialsComponent } from './views/materials/materials.component';
import { OrdersComponent } from './views/orders/orders.component';
import { CustomersComponent } from './views/customers/customers.component';
import { ModelsComponent } from './views/models/models.component';
import { ProductsComponent } from './views/products/products.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MaterialsComponent,
    OrdersComponent,
    CustomersComponent,
    ModelsComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpService,
    { provide: 'BACKEND_API_URL', useValue: environment.backendApiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }