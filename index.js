const express = require('express');
const bodyParser = require('body-parser');
var dao = require("./data_access");

// server app
var app = express();

//Parse JSON body
app.use(bodyParser.json());

// initBooks
app.get("/init", (req, res) => {
    dao.call('initbooks',{}, (result)=>{
        console.log("result: " + result.status);
        res.send('done with init');
    })
});

// clearBooks
app.get("/clear", (req, res) => {
    dao.call('clearBooks',{}, (result)=>{
        console.log("result: " + (result.status));
        res.send('done with clear');
    })
});

// findAllBooks
app.get("/books", (req, res) => {
    dao.call('findAllBooks', {}, (result) => {
        if (result.books !== undefined) {
            res.send(result.books);
        } else {
            res.statusCode = 404;
            res.end();
        }
    });
});

// findOneBook
app.get("/books/:isbn", (req, res) => {
    dao.call('findBook', { isbn: req.params.isbn }, (result) => {
        if (result.book !== undefined) {
            res.send(result.book);
        } else {
            res.statusCode = 404;
            res.end();
        }
    });
});

// updateBook
app.put("/books/:isbn", (req, res) => {
    if (req.params.isbn === undefined || req.body === undefined) {
        res.statusCode = 500;
        res.end();
        return;
    }
    // use isbn from path if available
    let isbn = req.params.isbn;
    if (isbn != undefined) {
        req.body.isbn = isbn;                                                         
    }
    // make call to db
    dao.call('updateBook', { book: req.body, isbn: isbn }, (result) => {
        if (result.status !== undefined) {
            res.send(result.status);
        } else {
            res.statusCode = 404;
            res.end();
        }
    });
});

// start the rest service
var port = 3000;
console.log('service opening on port: ' + port)
app.listen(port);