$( document ).ready(function() {

    var socket = io();


    $( ".hangup" ).click(function() {
        hangup();
        $('.ui.basic.modal')
          .modal('hide')
        ;
    });

    $(".extensions").on('click', '.callbutton', function(data){
        var extension = $(data.target).attr("data-extension");
        var destination = $(data.target).attr("data-destination");
        $("#destination").text("CALLING: " + destination);
        call(extension);
        $('.ui.basic.modal')
          .modal('show')
        ;
    })




    var PhoneModel = function() {
        var self = this;

        self.Extensions = ko.observableArray([]);

        self.getExtensions = function () {
            dialplan.get(function(data) {

                self.Extensions(data.phones);
            })
        };

        self.getExtensions();

    };



    var viewModel = new PhoneModel();
    ko.applyBindings(viewModel);

});


