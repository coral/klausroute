'use strict'

var fs = require('fs');
var express = require('express');
var app = express();
var _ = require('lodash');
var xml2js = require('xml2js');
var o2x = require('object-to-xml');

var stats = require('./stats');

var dialplan = require('../../dialplan.json');

exports.get = function (req, res, next) {

    var parser = new xml2js.Parser();

    fs.readFile('config/phones/3950.xml', function(err, data) {
        parser.parseString(data, function (err, result) {

            var out = o2x(result);
            res.send(out);
            res.end();
        });
    });


    // _.forEach(dialplan.phones, function(n, key) {


    // });



}

