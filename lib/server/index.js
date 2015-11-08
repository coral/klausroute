'use strict'
/**
 * Module dependencies.
 */

var express = require('express');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var app = express();
var io = null;
var server = null;

/**
 * Internal deps.
 */

var config = require('../../config/server.json');
/**
 * Setup
 */

exports = new EventEmitter();

exports.start = function() {

    app.use(bodyParser.json());
    app.use('/', express.static(config.server.static_folder));
    app.use('/bower_components', express.static(config.server.bower));

    if (config.server.ssl.enabled) {
      var sslOpts = {
            key: fs.readFileSync("secure/" + config.server.ssl.keyPath),
            cert: fs.readFileSync("secure/" + config.server.ssl.certificatePath)
      };

      // If we allow HTTP on the same port, use httpolyglot
      // otherwise, standard https server
      server = require('httpolyglot').createServer(sslOpts, app);
      //logger.info("Server is up with HTTPS");

    } else {
      server = require('http').createServer(app);
      //logger.info("Server is up with HTTP");
    }

    server.listen(config.server.port);

    io = require('socket.io')(server);


    io.on('connection', function (socket) {
        router.Socket(socket);
    });



}

exports.getIO = function() {
  return io; 
}


module.exports = exports;