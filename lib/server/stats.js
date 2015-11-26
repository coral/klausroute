'use strict'

/**
 * Module dependencies.
 */

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var _ = require('lodash');
var config = require('../../config/internal.json');

var active_phones = {};

exports.start = function() 
{

    var ami = new require('asterisk-manager')(config.asterisk.ami.port, config.asterisk.host,config.asterisk.ami.username,config.asterisk.ami.password, true); 

    ami.keepConnected();

        // Listen for any/all AMI events.
    ami.on('managerevent', function(evt) {
        //console.log(evt);
    });

    ami.on('peerentry', function(res) {

        if(res.event == "PeerEntry")
        {
            if(res.ipaddress != '-none-')
            {
                active_phones[res.objectname] = true;
            }

        }
    });

    // Listen for specific AMI events. A list of event names can be found at
    // https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
    ami.on('hangup', function(evt) {
        console.log(evt);
    });
    ami.on('confbridgejoin', function(evt) {
        console.log(evt);
    });

    // Listen for Action responses.
    ami.on('response', function(evt) {
        console.log(evt);
    });

    setInterval(function(){ 
            ami.action({
                'action':'SIPpeers'
            }, function(err, res) {});
    }, 60000);

    ami.action({
        'action':'SIPpeers'
    }, function(err, res) {});



}

exports.getActive = function()
{
    return active_phones;
}