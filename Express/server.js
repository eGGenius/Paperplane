const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const serverPort = '8100';
const apiPrefix = '/api';

const defaultCollections = ['materials', 'customers', 'orders', 'models', 'account'];

mongoose.connect('mongodb://localhost:27017/paperplane', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
        if (err) return console.log(err);
        else {
            defaultCollections.forEach(element => {
                if (!collections.includes(element)) {
                    mongoose.connection.db.createCollection(element, function (err) {
                        if (err) return console.log(err);
                    });
                }
            });
            console.log('MongoDB is ready');
        }
    });
});


var materialSchema = new mongoose.Schema({
    materialId: String,
    stock: Number,
    pricePerUnit: Number
});

var customerSchema = new mongoose.Schema({
    customerId: String,
    name: String
});

var orderSchema = new mongoose.Schema({
    orderId: String,
    customerId: String,
    items: [{ model: String, number: Number }],
    status: String,
    totalPrice: Number
});

var modelSchema = new mongoose.Schema({
    identifier: String,
    materials: [{ materialId: String, number: Number }],
    sellingPrice: Number,
    stock: Number
});

var accountSchema = new mongoose.Schema({
    balance: Number
});

var Material = mongoose.model('Material', materialSchema);
var Customer = mongoose.model('Customer', customerSchema);
var Order = mongoose.model('Order', orderSchema);
var Model = mongoose.model('Model', modelSchema);
var Account = mongoose.model('Account', accountSchema);

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.listen(serverPort, () => {
    console.log('Server started!');
});

app.get(apiPrefix + "/materials/all", function (req, res) {

});

app.put(apiPrefix + "/materials/:id", function (req, res) {

    // public updateMaterialStock(type: String, number: Number) {
    //     return this.httpClient.put(this.url + 'materials/' + id, JSON.parse('{"number":"' + number + '"}'));
    // }

});

app.get(apiPrefix + "/products/all", function (req, res) {

});

app.put(apiPrefix + "/products/:model", function (req, res) {

    // public updateProductStock(model: String, number: Number) {
    //     return this.httpClient.put(this.url + 'products/' + model, JSON.parse('{"number":"' + number + '"}'));
    // }

});

app.get(apiPrefix + "/orders/:status", function (req, res) {
    switch (req.params.status) {
        case 'all':
            break;
        case 'progress':
            break;
        case 'done':
            break;
        case 'delivery':
            break;
    }
});

app.put(apiPrefix + "/order/:status", function (req, res) {

    // public updateOrderToDone(orderId: String) {
    //     return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"done"}'));
    // }

    // public UpdateOrderToDelivered(orderId: String) {
    //     return this.httpClient.put(this.url + 'order/' + orderId, JSON.parse('{"status":"delivered"}'));
    // }

});

app.post(apiPrefix + "/orders", function (req, res) {

    // public createNewOrder(customerId: String, items: [{ model: String, number: Number }]) {
    //     return this.httpClient.post(this.url + 'orders', JSON.parse('{"customerId":"' + customerId + '","items":"' + items + '"}'));
    // }

});

app.get(apiPrefix + "/balance", function (req, res) {

});

app.put(apiPrefix + "/balance", function (req, res) {

    // public updateAccountBalance(value: Number) {
    //     return this.httpClient.put(this.url + 'balance', JSON.parse('{"value":"' + value + '"}'));
    // }

});