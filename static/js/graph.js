var dialplan;
var socket;

$( document ).ready(function() {


    dialplan.get(render)
    socket = io();


});

var render = function(dialplan)
{

    dialplan = dialplan.phones;

    s = new sigma({
    renderer: {
      container: document.getElementById('graph-container'),
      type: 'webgl'
    },
    settings: {
      autoRescale: false,
      mouseEnabled: false,
      touchEnabled: false,
      nodesPowRatio: 1,
      edgesPowRatio: 1,
      defaultEdgeColor: '#FF0000',
      defaultNodeColor: '#333',
      edgeColor: 'default'
    }
  });

    var nodes = dialplan.length;

    _.forEach(dialplan, function(n, key) {
        
        s.graph.addNode({
            id: String(n.extension) ,
            label: n.name,
            size: 20,
            x: 250 * Math.cos(Math.PI * 2 * key / nodes - Math.PI / 2),
            y: 250  * Math.sin(Math.PI * 2 * key / nodes - Math.PI / 2),
            dX: 0,
            dY: 0,
            type: 'goo'
        });

    });


    socket.on('call', function (data) {
        console.log(data);
        s.graph.addEdge(
        {
            source: String(data.source),
            target: String(data.target),
            id: String(data.id),
            type: "arrow",
            arrowSizeRatio: 20

        });

        s.refresh();
    });

    socket.on('hangup', function (data) {
        s.graph.dropEdge(data);
        s.refresh();

    });

s.refresh();

    // s.graph.startForceAtlas2(
    // {
    //     outboundAttractionDistribution: true,
    //     adjustSizes: true
    // });
      

}