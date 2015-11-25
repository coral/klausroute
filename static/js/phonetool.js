$( document ).ready(function() {


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


