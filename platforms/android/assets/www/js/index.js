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
        //app.receivedEvent('deviceready');
        if( mytab.getActiveTabIndex() === 0 ){
            geo.init();
        }
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 0){
                geo.init();
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
