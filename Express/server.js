const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');

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
                    // Read data file and put it into MongoDB table
                }
                else {
                    // Merge existing MongoDB table with data file
                }
            });
            console.log('MongoDB is ready');
        }
    });
});

var materialSchema = new mongoose.Schema({
    materialId: String,
    identifier: String,
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
    identifier: String,
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

app.get(apiPrefix + "/customers/:id", function (req, res) {
    switch (req.params.id) {
        case 'all':
            Customer.find(function (err, customers) {
                if (err) return console.log(err);
                else res.status(200).send(customers);
            });
            break;
        default:
            Customer.find({ status: req.params.id }, function (err, customers) {
                if (err) return console.log(err);
                else res.send(customers);
            });
            break;
    }
});

app.get(apiPrefix + "/materials/all", function (req, res) {
    Material.find(function (err, materials) {
        if (err) return console.log(err);
        else res.status(200).send(materials);
    });
});

app.put(apiPrefix + "/materials/:id", function (req, res) {
    Material.findOneAndUpdate({ materialId: req.params.id }, { $inc: { stock: req.body.number } }, function (err, material) {
        if (err) return console.log(err);
        else return res.status(200).send(material);
    });
});

app.get(apiPrefix + "/products/all", function (req, res) {
    Model.find({ stock: { $gt: 1 } }, function (err, products) {
        if (err) return console.log(err);
        else return res.status(200).send(products);
    });
});

app.put(apiPrefix + "/products/:model", function (req, res) {
    Model.findOneAndUpdate({ identifier: req.params.model }, { $inc: { stock: req.body.number } }, function (err, model) {
        if (err) return console.log(err);
        else return res.status(200).send(model);
    });
});

app.get(apiPrefix + "/orders/:status", function (req, res) {
    switch (req.params.status) {
        case 'all':
            Order.find(function (err, orders) {
                if (err) return console.log(err);
                else res.status(200).send(orders);
            });
            break;
        default:
            Order.find({ status: req.params.status }, function (err, orders) {
                if (err) return console.log(err);
                else res.send(orders);
            });
            break;
    }
});

app.put(apiPrefix + "/order/:id", function (req, res) {
    Order.findOneAndUpdate({ orderId: req.params.id }, { $set: { status: req.body.status } }, function (err, order) {
        if (err) return console.log(err);
        else res.status(200).send(order);
    });
});

app.post(apiPrefix + "/order", function (req, res) {
    var items = req.body.items;
    Order.create(
        { orderId: uuidv1() },
        { customerId: req.body.customerId },
        { items: items },
        { status: 'progress' },
        {
            totalPrice: function (items) {
                var totalPrice = 0;
                items.forEach(item => {
                    Model.find({ identifier: item.model }, function (err, model) {
                        if (err) console.log(err);
                        else totalPrice += model.sellingPrice * item.number;
                    });
                });
            }
        }, function (err) {
            if (err) console.log(err);
            else res.status(200);
        });
});

app.get(apiPrefix + "/balance", function (req, res) {
    Account.findOne({ identifier: "main-account" }, function (err, account) {
        if (err) return console.log(err);
        else res.status(200).send(account);
    })
});

app.put(apiPrefix + "/balance", function (req, res) {
    Account.findOneAndUpdate({ identifier: "main-account" }, { $inc: { balance: req.body.value } }, function (err, balance) {
        if (err) return console.log(err);
        else res.status(200).send(balance);
    });
});