export interface Order {
    "orderId": String;
    "customerId": String;
    "items": [{ "model": String, "number": Number }];
    "status": String;
    "totalPrice": Number;
}