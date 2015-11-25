$( document ).ready(function() {
  var config = {
    // Replace this IP address with your Asterisk IP address
    uri: '1060@77.80.228.235',

    // Replace this IP address with your Asterisk IP address,
    // and replace the port with your Asterisk port from the http.conf file
    ws_servers: 'wss://77.80.228.235:9000/ws',

    // Replace this with the username from your sip.conf file
    authorizationUser: '1060',

    // Replace this with the password from your sip.conf file
    password: 'password',

    // HackIpInContact for Asterisk
    hackIpInContact: true,

  };

  var ua = new SIP.UA(config);

  // Invite with audio only
  var options = {
          media: {
              constraints: {
                  audio: true,
                  video: false
              },
              render: {
                  remote: document.getElementById('remoteAudio'),
                  local: document.getElementById('localAudio')
              }
          }
      };

  session = ua.invite('1062', options, function(lol) {
    console.log("HEHEHEHE");
  });




  ua.on('invite', function (session) {
      session.accept({
          media: {
              render: {
                  remote: document.getElementById('remoteVideo'),
                  local: document.getElementById('localVideo')
              }
          }
      });
  });
});