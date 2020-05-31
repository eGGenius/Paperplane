import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { CartItem } from 'src/assets/interfaces/CartItem';

@Injectable()
export class HttpService {

    url: string;

    constructor(private httpClient: HttpClient, @Inject('BACKEND_API_URL') private apiUrl: string) {
        this.url = apiUrl;
    }

    public getAllCustomers() {
        return this.httpClient.get(this.url + 'customers/all');
    }

    public getAllMaterialStock() {
        return this.httpClient.get(this.url + 'materials/all');
    }

    public updateMaterialStock(materialId: String, number: Number) {
        return this.httpClient.put(this.url + 'materials/' + materialId, JSON.parse('{"number":"' + number + '"}'));
    }

    public getAllProductStock() {
        return this.httpClient.get(this.url + 'products/all');
    }

    public updateProductStock(model: String, number: Number) {
        return this.httpClient.put(this.url + 'products/' + model, JSON.parse('{"number":"' + number + '"}'));
    }

    public createNewOrder(customerId: String, items: CartItem[]) {
        let itemsAsString = '[';
        for (let i = 0; i < items.length - 1; i++) {
            itemsAsString += '{"identifier":"' + items[i].identifier + '","number":' + items[i].number + '},';
        }
        itemsAsString += '{"identifier":"' + items[items.length - 1].identifier + '","number":' + items[items.length - 1].number + '}]';
        return this.httpClient.post(this.url + 'order', JSON.parse('{"customerId":"' + customerId + '","items":' + itemsAsString + '}'));
    }

    public getAllOrders() {
        return this.httpClient.get(this.url + 'orders/all');
    }

    public getAllOrdersInProgress() {
        return this.httpClient.get(this.url + 'orders/progress');
    }

    public getAllOrdersDone() {
        return this.httpClient.get(this.url + 'orders/done');
    }

    public getAllOrdersInDelivery() {
        return this.httpClient.get(this.url + 'orders/delivery');
    }

    public updateOrderToProgress(orderId: String) {
        return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"progress"}'));
    }

    public updateOrderToDone(orderId: String) {
        return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"done"}'));
    }

    public UpdateOrderToDelivered(orderId: String) {
        return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"delivered"}'));
    }

    public getAllModels() {
        return this.httpClient.get(this.url + 'models/all');
    }

    public getAccountBalance() {
        return this.httpClient.get(this.url + 'balance');
    }
}