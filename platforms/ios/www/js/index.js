var app = {
    initialize: function() {
        //window.localStorage.removeItem("asollc_app_credentials");
        var data = window.localStorage.getItem("asollc_app_credentials");
        if( data === null ){
            //window.location = "login.html";
        }
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        window.open = cordova.InAppBrowser.open;
        var plot = cordova.require("cordova/plugin/plot");
        plot.init({});
        plot.enable();        
        if( mytab.getActiveTabIndex() === 0 ){
            geo.init();
        }
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 1){
                
                geo.init();
                $("#pictk").click(function(){app.pictk();});
                
            } else if( mytab.getActiveTabIndex() === 3){
                
                // Survey URL goes here
                // var url = "http://www.google.com/";
                // var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
               
                
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
    pictk:function(){
        cameraOptions = { 
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false 
        };
        navigator.camera.getPicture(function(data) {
            app.onCapture(data);
        }, function(err) {
            app.onFail(err);
        }, cameraOptions);
    },
    onCapture:function(data){
        var pop;
        // handle fileupload succes
        var success = function(d){
            app.clearCache();
            ons.notification.alert({
                messageHTML: '<span>File uploaded successfully</span><br/><br/><img src="'+upload_path+options.fileName+'" id="upld_img" style="max-width:200px;max-height:200px"/>', 
                title: 'Upload', 
                buttonLabel: 'OK', 
                animation: 'default'
            });
            pop.destroy();
        };
        // handle upload fail
        var fail = function(er){
            app.clearCache();
            ons.notification.alert({message: 'Error: '+er, title: 'Error', buttonLabel: 'OK', animation: 'default'});            
        };
        // upload URL change here
        var upload_uri = "http://verifyimages.azurewebsites.net/geofence/index.php";
        var upload_path = "http://verifyimages.azurewebsites.net/geofence/uploads/";
        // upload file
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.fileKey = "img";
        options.fileName = "img_"+Math.floor(Math.random()*10)+(new Date().getTime())+".jpg";//data.substr(data.lastIndexOf('/')+1);
        options.mimeType= "image/jpeg";
        ft.upload( data, upload_uri, success, fail, options);
        ons.createAlertDialog('alert.html').then(function(alertDialog) {
            alertDialog.show();
            pop = alertDialog;
        });
    },
    onFail:function(err){
        
    },
    clearCache:function() {
        navigator.camera.cleanup();
    }    
};
