'use strict'

var fs = require('fs');
var express = require('express');
var app = express();
var _ = require('lodash');

var stats = require('./stats');

var dialplan = require('../../dialplan.json');

exports.get = function (req, res, next) {


    var active = stats.getActive();

    _.forEach(dialplan.phones, function(n, key) {

        if(_.get(active, n.extension))
        {
            n.active = true;
        } else
        {
            n.active = false;
        }

        if(n.extension < 200)
        {
            n.active = true;
        }

    });

    res.send(dialplan);
    res.end();

}

