// Create our JsSIP instance and run it:

var configuration = {
  'ws_servers': 'ws://10.0.1.43:8088/ws',
  'uri': 'sip:alice@example.com',
  'password': 'superpassword'
};

var ua = new JsSIP.UA(configuration);

ua.start();


// Make an audio/video call:
var session = null;

// HTML5 <video> elements in which local and remote video will be shown
var selfView =   document.getElementById('my-video');
var remoteView =  document.getElementById('peer-video');

// Register callbacks to desired call events
var eventHandlers = {
  'progress': function(e){
    console.log('call is in progress');
  },
  'failed': function(e){
    console.log('call failed with cause: '+ e.data.cause);
  },
  'ended': function(e){
    console.log('call ended with cause: '+ e.data.cause);
  },
  'confirmed': function(e){
    var local_stream = session.connection.getLocalStreams()[0];

    console.log('call confirmed');

    // Attach local stream to selfView
    selfView = JsSIP.rtcninja.attachMediaStream(selfView, local_stream);
  },
  'addstream': function(e){
    var stream = e.stream;

    console.log('remote stream added');

    // Attach remote stream to remoteView
    remoteView = JsSIP.rtcninja.attachMediaStream(remoteView, stream);
  }
};

var options = {
  'eventHandlers': eventHandlers,
  'mediaConstraints': {'audio': true, 'video': true}
};


session = ua.call('sip:bob@example.com', options);