var app = {
    initialize: function() {
        //window.localStorage.removeItem("asollc_app_credentials");
        var data = window.localStorage.getItem("asollc_app_credentials");
        if( data === null ){
            window.location = "login.html";
        }
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        if( mytab.getActiveTabIndex() === 0 ){
            geo.init();
        }
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 1){
                geo.init();
            } else if( mytab.getActiveTabIndex() === 3){
                window.open("http://www.google.com/","_system");
            } else if( mytab.getActiveTabIndex() === 0){
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,                   
                    url: 'http://twgverify.asolllc.net/api/visitdata',
                    success: function (data)
                    {
                        console.log(data);
                    },
                    error: function (data)
                    {
                        ons.notification.alert({
                            message: 'An error occured, please try again later',
                            title: 'Error',
                            buttonLabel: 'OK',
                            animation: 'default',
                            callback: function() {}
                        });                        
                    }
                });                
            }
        });
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};
