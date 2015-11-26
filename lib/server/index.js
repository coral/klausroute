'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var httpApp = express();
var EventEmitter = require('events').EventEmitter;
var ws = require('ws');
var http = require('http');
var https = require('https');
var path = require('path');
var httpProxy = require('http-proxy');
var server = null;

/**
 * Internal deps.
 */

var config = require('../../config/server.json');

var privateKey = fs.readFileSync('secure/tele.event.dreamhack.se.key');
var certificate = fs.readFileSync('secure/tele.event.dreamhack.se.crt');
var ca1 = fs.readFileSync('secure/AddTrustExternalCARoot.crt');
var ca2 = fs.readFileSync('secure/COMODORSAAddTrustCA.crt');
var ca3 = fs.readFileSync('secure/COMODORSADomainValidationSecureServerCA.crt');

var credentials = {key: privateKey, cert: certificate, passphrase: "secret", ca: [ ca1, ca2, ca3 ]};

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

     httpApp.set('port', 80);
      httpApp.get("*", function (req, res, next) {
          res.redirect("https://" + req.headers.host + "/" + req.path);
      });

      http.createServer(httpApp).listen(httpApp.get('port'), function() {
        console.log('Express HTTP server listening on port ' + httpApp.get('port'));
    });



    var asterisk_proxy = httpProxy.createServer({
      target: {
        host: '77.80.231.180',
        port: 8088
      },
      ssl: {
        key: privateKey,
        cert: certificate,
        passphrase: "secret",
        ca: [ ca1, ca2, ca3 ]
      },
      ws: true
    }).listen(8080);


    server = require('https').createServer(credentials, app);

    server.listen(443, "::0");



}


module.exports = exports;
