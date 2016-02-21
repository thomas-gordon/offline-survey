"use strict"

let express = require('express');
let path = require('path');
let fs = require('fs');
let moment = require('moment');
let bodyParser = require('body-parser');
let app = module.exports.app = exports.app = express();

app.use(express.static('build'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../build/') });
});

app.get('/llew', function (req, res) {
    res.sendFile('admin.html', { root: path.join(__dirname, '../build/') });
});

app.post('/finalise', function (req, res) {
    fs.appendFile(path.join(__dirname, '../data/output-data.txt'), `\n\n====FINALISE RESULTS WAS PRESSED====\n\n`, function(err) {
        if(err) {
            return console.log(err);
        }
        res.end();
    });
});

app.post('/save', function (req, res) {
    var json = JSON.stringify(req.body);
    var timestamp = moment().format("Do YYYY, h:mm:ss a");
    var resultString = `${timestamp}: ${req.body.unhappy} | ${req.body.neutral} | ${req.body.happy}`;

    fs.appendFile(path.join(__dirname, '../data/output-data.txt'), `${resultString}\n`, function(err) {
        if(err) {
            return console.log(err);
        }
        res.end();
    });
});

var port = process.env.PORT || 3000;
app.listen(port,function () {
    console.log('Example app is a runnin');
});
