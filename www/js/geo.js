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
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    },
    get:function(){
        navigator.geolocation.getCurrentPosition( geo.success, geo.error, geo.options);
    },
    success:function(position){
        $("#lat").text( position.coords.latitude );
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