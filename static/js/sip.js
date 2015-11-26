var session;
var ua;

var call = function(extension)
{

  var config = {
    uri: '666@tele.event.dreamhack.se',
    ws_servers: 'wss://tele.event.dreamhack.se:8080/ws',
    authorizationUser: '666',
    password: 'kao23jkrtpaj4tg8i4hg89ao0p',
    hackIpInContact: true,
    displayName: "KLAUS"   

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


  session = ua.invite(extension, options, function(lol) {
    console.log("CALLING");
  });


}

var hangup = function()
{
  ua.stop();
}