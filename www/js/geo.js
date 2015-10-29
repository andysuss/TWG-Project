/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.geo = {
    init:function(){
        this.get();
    },
    options:{
        maximumAge: 90000,
        timeout: 90000,
        enableHighAccuracy: false
    },
    get:function(){
        navigator.geolocation.getCurrentPosition( geo.success, geo.error, geo.options);
    },
    success:function(position){
        $("#lat").text( position.coords.latitude );
        window.localStorage.setItem("asollc_app_lat", position.coords.latitude);
        window.localStorage.setItem("asollc_app_long", position.coords.longitude);
        $("#lng").text( position.coords.longitude);
    },
    error:function(er){
        ons.notification.alert({
            message: "Ooops !, we can't get your position",
            title: 'Error',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function() {}
        });
    }
};