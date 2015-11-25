
var call = function(extension)
{

  var config = {
    // Replace this IP address with your Asterisk IP address
    uri: '1060@tele.event.dreamhack.se',

    // Replace this IP address with your Asterisk IP address,
    // and replace the port with your Asterisk port from the http.conf file
    ws_servers: 'wss://tele.event.dreamhack.se:9000/ws',

    // Replace this with the username from your sip.conf file
    authorizationUser: '1060',

    // Replace this with the password from your sip.conf file
    password: 'mnbgafARAjSdCo6VjJ1V',

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

  session = ua.invite(extension, options, function(lol) {
    console.log("CALLING");
  });


}