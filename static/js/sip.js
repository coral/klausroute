var session;
var ua;

var call = function(extension)
{

  var config = {
    uri: '1060@77.80.229.88',
    ws_servers: 'wss://77.80.229.88:8080/ws',
    authorizationUser: '1060',
    password: 'password',
    hackIpInContact: true,

  };

  ua = new SIP.UA(config);

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

  var aud = document.getElementById("remoteAudio");
  aud.volume = 1;

  session = ua.invite('1062', options, function(lol) {
    console.log("CALLING");
  });


}

var hangup = function()
{
  ua.stop();
}