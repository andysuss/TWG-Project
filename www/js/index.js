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
        var plot = cordova.require("cordova/plugin/plot");
        plot.init({});
        plot.enable();

        plot.notificationHandler = function(notification, data) {
            var jsdata = (data !== undefined)? eval("("+data+")"):false;
            mytab.setActiveTab(0);
            mytab.on("postchange", function(e){
                if( e.index === 0 && jsdata !== false){
                    app.shp_tab(jsdata.locationId);
                } else if( e.index === 2 && jsdata !== false){
                    (jsdata.hasOwnProperty("img"))? app.lyt(jsdata.img):app.lyt(null);
                }
            });
        };

        if( mytab.getActiveTabIndex() === 0 ){
            //app.shp_tab();
        }
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 1){

                geo.init();
                $("#pictk").click(function(){app.pictk();});

            } else if( mytab.getActiveTabIndex() === 3){

                // Survey URL goes here
                var url = "http://www.google.com/";
                var ref = cordova.InAppBrowser.open(encodeURI(url),"_blank", "location=no,toolbar=no");

            } else if( mytab.getActiveTabIndex() === 0){

                //app.shp_tab();

            }
        });
    },
    shp_tab:function(locationId){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            crossDomain: true,
            url: 'http://twgverify.asolllc.net/api/shipmenthistories/?location='+encodeURIComponent(locationId),
            success: function (data)
            {
                var ls = document.getElementById('shp_ls');
                var html = '';
                $.each(data, function(i, v){
                    html +=  '<ons-list-item modifier="chevron" class="list-item-container"><div class="list-item-right"><div class="list-item-content"><div class="name">'+v.Item+'</div><div>Quantity: '+v.CaseQty+'</div><div class="date">Location Id: '+locationId+'</div><div class="lucent date">'+v.Shipdate+'</div></div></div></ons-list-item>';
                });
                ls.innerHTML = html;
                ons.compile(ls);
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
    },
    lyt:function(img){
        if(img === null){
            document.getElementById("lyt_ctr").innerHTML = '<p>No image to display.</p>';
        } else {
            console.log(img);
            modal.show();
            $('<img src="'+img+'" class="lyt_img"/>').bind('load', function(){
                modal.hide();
            }).appendTo("#lyt_ctr");
        }
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
        var upload_uri = "http://demo3.inheritedarts.com/geofence/upload.php";
        var upload_path = "http://demo3.inheritedarts.com/geofence/uploads/";
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