import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class HttpService {

    url: string;

    constructor(private httpClient: HttpClient, @Inject('BACKEND_API_URL') private apiUrl: string) {
        this.url = apiUrl;
    }

    public getAllMaterialStock() {
        return this.httpClient.get(this.url + 'materials/all');
    }

    public updateMaterialStock(type: String, number: Number) {
        return this.httpClient.put(this.url + 'materials/' + type, JSON.parse('{"number":"' + number + '"}'));
    }

    public getAllProductStock() {
        return this.httpClient.get(this.url + 'products/all');
    }

    public updateProductStock(model: String, number: Number) {
        return this.httpClient.put(this.url + 'products/' + model, JSON.parse('{"number":"' + number + '"}'));
    }

    public createNewOrder(customerId: String, items: [{ model: String, number: Number }]) {
        return this.httpClient.post(this.url + 'orders', JSON.parse('{"customerId":"' + customerId + '","items":"' + items + '"}'));
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

    public updateOrderToDone(orderId: String) {
        return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"done"}'));
    }

    public UpdateOrderToDelivered(orderId: String) {
        return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"delivered"}'));
    }

    public getAccountBalance() {
        return this.httpClient.get(this.url + 'balance');
    }

    public updateAccountBalance(value: Number) {
        return this.httpClient.put(this.url + 'balance', JSON.parse('{"value":"' + value + '"}'));
    }
}