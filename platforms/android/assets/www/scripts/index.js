// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        var data = window.localStorage.getItem("asollc_app_credentials");
        if( data !== null ){
            window.location = "index.html";
        }
        if( mytab.getActiveTabIndex() == 0 ){
            geo.init();
        }
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 0){
                geo.init();
            }
        });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();