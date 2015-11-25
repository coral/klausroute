 var dialplan = {
        get: function(cb) {
            $.getJSON( "/dialplan.json", function( data ) {
                cb(data);
            });
        }
}