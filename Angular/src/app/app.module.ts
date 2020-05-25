import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { DetailViewComponent } from './views/detail-view/detail-view.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MaterialsComponent,
    OrdersComponent,
    CustomersComponent,
    ModelsComponent,
    ProductsComponent,
    DetailViewComponent
    // BrowserAnimationsModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    HttpService,
    { provide: 'BACKEND_API_URL', useValue: environment.backendApiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }