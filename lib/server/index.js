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
var io = null;

/**
 * Internal deps.
 */

var config = require('../../config/internal.json');
var stats = require('./stats');
var dialplan = require('./dialplan');

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
    app.use('/dialplan.json', dialplan.get);
    //app.use('/dialplan.json', express.static("dialplan.json"));

    /**
     * Setup the port 80 redirection to 443 to force HTTPS
     */

     httpApp.set('port', 80);
      httpApp.get("*", function (req, res, next) {
          res.redirect("https://" + req.headers.host + "/" + req.path);
      });

      http.createServer(httpApp).listen(httpApp.get('port'), function() {
        console.log('Express HTTP server listening on port ' + httpApp.get('port'));
    });


    /**
     * Create the Asterisk proxy to pipe the encrypted traffic to unencrypt.
     */

    var asterisk_proxy = httpProxy.createServer({
      target: {
        host: config.asterisk.host,
        port: config.asterisk.port
      },
      ssl: {
        key: privateKey,
        cert: certificate,
        passphrase: "secret",
        ca: [ ca1, ca2, ca3 ]
      },
      ws: true
    }).listen(config.asterisk.proxy_port);

    /**
     * Start the main HTTP server
     */

    server = require('https').createServer(credentials, app);
    server.listen(config.server.port, "::0");

    /**
    * BIND SOCKET IO
    */

    io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.emit("activePhones", stats.getActive());
    });


    stats.start();


}


module.exports = exports;
