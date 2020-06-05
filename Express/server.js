const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');

const app = express();

const serverPort = '8100';
const apiPrefix = '/api';

const defaultCollections = ['materials', 'customers', 'orders', 'models', 'accounts'];

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
    items: [{ identifier: String, number: Number }],
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
app.use(bodyParser.urlencoded({ extended: true }));
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
    var number = req.body.number;
    var id = req.params.id;
    if (number > 0) {

        var result = 0;
        Material.findOne({ materialId: id }, function (err, material) {
            console.log(material);
            console.log('PricePerUnit: ', material.pricePerUnit);
            result = (material.pricePerUnit * number * (-1));
            console.log(result);
            updateAccountBalance(result);

        });



    }
    Material.findOneAndUpdate({ materialId: id }, { $inc: { stock: number } }, function (err, material) {
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

// app.put(apiPrefix + "/products/:model", function (req, res) {
//     Model.findOneAndUpdate({ identifier: req.params.model }, { $inc: { stock: req.body.number } }, function (err, model) {
//         if (err) return console.log(err);
//         else return res.status(200).send(model);
//     });
// });

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
    var status = req.body.status;
    Order.findOneAndUpdate({ orderId: req.params.id }, { $set: { status: status } }, function (err, order) {
        if (err) return console.log(err);
        else {
            switch (status) {
                case 'progress':
                    order.items.forEach(item => {
                        updateProductStock(item.identifier, (item.number * (-1)));
                    });
                    break;
                case 'done':
                    order.items.forEach(item => {
                        updateProductStock(item.identifier, item.number);
                    });
                    break;
                case 'delivered':
                    order.items.forEach(item => {
                        updateProductStock(item.identifier, (item.number * (-1)));
                    });
                    updateAccountBalance(order.totalPrice);
                    break;

            }
            res.status(200).send(order);
        }
    });
});

function updateProductStock(model, number) {
    Model.findOneAndUpdate({ identifier: model }, { $inc: { stock: number } }, function (err, model) {
        if (err) return console.log(err);
    });
}

app.post(apiPrefix + "/order", function (req, res) {
    var items = req.body.items;

    (async () => {
        async function getTotalPrice(items) {
            let totalPrice = 0;
            for (let i = 0; i < items.length; i++) {
                await Model.find({ identifier: items[i].identifier }, function(err, model) {
                    if (err) console.log(err);
                    else {
                        totalPrice += (model[0].sellingPrice * items[i].number);
                        model[0].materials.forEach(material => {
                            updateMaterialStock(material.materialId, (material.number * (-1)));
                        });
                    }
                });
            }
            return totalPrice;
        }
        var totalPrice = Number(await getTotalPrice(items));
        
        var newOrder = new Order({ orderId: uuidv1(), customerId: req.body.customerId, items: items, status: 'progress', totalPrice: totalPrice});
 
        newOrder.save(function (err, result) {
            if (err) console.log(err);
            else res.send(result);
        });
    })();
});

function updateMaterialStock(identifier, number) {
    Material.findOneAndUpdate({ identifier: identifier }, { $inc: { stock: number } }, function (err, material) {
        if (err) return console.log(err);
    });
}

app.get(apiPrefix + "/models/:query", function (req, res) {
    switch (req.params.query) {
        case 'all':
            Model.find(function (err, models) {
                if (err) console.log(err);
                else res.status(200).send(models);
            });
            break;
    }
});

app.get(apiPrefix + "/balance", function (req, res) {
    var query = 'main-account';
    Account.findOne({ identifier: query }, function (err, account) {
        if (err) console.log(err);
        else res.status(200).send(account);
    });
});

function updateAccountBalance(value) {
    Account.findOneAndUpdate({ identifier: 'main-account' }, { $inc: { balance: value } }, function (err, account) {
        if (err) return console.log(err);
        else console.log(account);
    });
}

app.get(apiPrefix + '/image/:model', function (req, res) {
    var path = './assets/images/' + req.params.model;
    if (fs.existsSync(path)) {
        fs.readFile(path, function (err, file) {
            if (err) return console.log(err);
            else {
                res.contentType("image/jpeg");
                res.send(file);
            }
        });
    }
    else {
        fs.readFile('./assets/images/default.png', function (err, file) {
            if (err) return console.log(err);
            else {
                res.contentType("image/png");
                res.send(file);
            }
        });
    }
});