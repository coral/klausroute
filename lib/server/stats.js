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

var events;
var calls = [];

exports.start = function(event_h) 
{
    events = event_h;

    var ami = new require('asterisk-manager')(config.asterisk.ami.port, config.asterisk.host,config.asterisk.ami.username,config.asterisk.ami.password, true); 

    ami.keepConnected();

        // Listen for any/all AMI events.
    ami.on('managerevent', function(evt) {

    });

    ami.on('newchannel', function(evt)
    {
        var call =
        {
            source: evt.calleridnum,
            target: evt.exten,
            id: evt.uniqueid
        };

        calls.push(call);
        events.emit("call", call);
    });

    ami.on('hangup', function(evt) {

        _.forEach(calls, function(n, key) {
            if(evt.uniqueid == n.id)
            {
                calls.splice(key, 1);
            }
        });
        events.emit("hangup", evt.uniqueid)

        console.log(calls);
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

    // ami.action({
    //     'action':'SIPpeers'
    // }, function(err, res) {});



}

exports.getCalls = function()
{
    return calls;
}

exports.getActive = function()
{
    return active_phones;
}