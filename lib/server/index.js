'use strict'
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var EventEmitter = require('events').EventEmitter;
var ws = require('ws');
var http = require('http');
var https = require('https');
var path = require('path');
var httpProxy = require('http-proxy');
var io = null;
var server = null;
/**
 * Internal deps.
 */

var config = require('../../config/server.json');

var privateKey = fs.readFileSync('secure/ca.key');
var certificate = fs.readFileSync('secure/ca.crt');

var credentials = {key: privateKey, cert: certificate, passphrase: "secret"};

/**
 * Setup
 */

exports = new EventEmitter();

exports.start = function() {

    app.use(bodyParser.json());
    app.use('/', express.static(config.server.static_folder));
    app.use('/bower_components', express.static(config.server.bower));
    app.use('/semantic', express.static(config.server.ui));
    app.use('/dialplan.json', express.static("dialplan.json"));


    /**
     * Create the Asterisk proxy to pipe the encrypted traffic to unencrypt.
     */

    var asterisk_proxy = httpProxy.createServer({
      target: {
        host: 'localhost',
        port: 8088
      },
      ssl: {
        key: privateKey,
        cert: certificate,
        passphrase: "secret"
      },
      ws: true
    }).listen(9000);


    server = require('https').createServer(credentials, app);

    server.listen(8080);


}

exports.getIO = function() {
  return io; 
}


module.exports = exports;