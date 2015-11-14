var app = {
    initialize: function() {
        user_data = window.localStorage.getItem("asollc_app_credentials");
        if( user_data === null ){
            window.location = "login.html";
        } else {
            user_data = eval("("+user_data+")");
        }
        lastLocationData = (window.localStorage.getItem("last_locationId_data") !== null )? eval("("+window.localStorage.getItem("last_locationId_data")+")"):null;
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {

        var plot = cordova.require("cordova/plugin/plot");
        plot.init({});
        plot.enable();
        console.log(user_data.GUID);
        plot.notificationHandler = function(notification, data) {
            var jsdata = (data !== undefined)? eval("("+data+")"):false;
            lastLocationData = notification;
            lastLocationData.locationId = jsdata.locationId;
            lastLocationData.img = jsdata.img;
            mytab.setActiveTab(0);
            window.localStorage.setItem("last_locationId_data", JSON.stringify(lastLocationData));
        };

        if( mytab.getActiveTabIndex() === 0 ){

            app.shp_tab();
        }
        $(document).on('change','#locations',function(){
            var drpLocation = $('#locations').val() ;
            if(drpLocation != ""){
            lastLocationData.locationId = drpLocation;
                $.each(imagesArray, function(value, key) {
                    if (key.Id == drpLocation){
                        imageUrl = key.Manager;
                        lastLocationData.img =  "https://docs.google.com/gview?embedded=true&url=http://verifyimages.azurewebsites.net/stores/" + imageUrl
                        console.log(imageUrl);
                    }
                });
            }
        });
        mytab.on("postchange", function(e){
            if( mytab.getActiveTabIndex() === 1){
                imagesArray = [];
                var myData = window.localStorage.getItem("asollc_app_credentials")
                //console.log(myData);

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    dataType: "json",
                    url: 'http://twgverify.asolllc.net/api/racetraclocations',
                    success: function(data){
                        var $el = $("#locations");
                        $el.empty();
                        $el.append($("<option></option>")
                            .attr("value", '').text('Please Select'));
                        $.each(data, function(value, key) {
                            $el.append($("<option></option>")
                                .attr("value", key.Id).text(key.Address));
                            imagesArray.push(key);
                        });

                        //console.log(data)
                    }
                });
                geo.init();
                $("#pictk").click(function(){app.pictk();});

            } else if( mytab.getActiveTabIndex() === 3){

                var ref = window.open( 'http://verifyimages.azurewebsites.net/survey.aspx?id='+user_data.GUID, '_blank', 'EnableViewPortScale=yes' );
                ref.addEventListener( 'loadstart', function () { } );

            } else if( mytab.getActiveTabIndex() === 0){

                app.shp_tab();

            } else if( mytab.getActiveTabIndex() === 2){

                app.lyt();

            }
        });
    },
    shp_tab:function(){
        if( lastLocationData === null ){
            ons.notification.alert({
                message: 'No data to display for the moment',
                title: 'Information',
                buttonLabel: 'OK',
                animation: 'default'
            });
            return false;
        };
        $.ajax({
            type: 'GET',
            dataType: 'json',
            crossDomain: true,
            url: 'http://twgverify.asolllc.net/api/shipmenthistories/?location='+encodeURIComponent(lastLocationData.locationId),
            success: function (data)
            {
                var ls = document.getElementById('shp_ls');
                var html = '';
                $.each(data, function(i, v){
                    html +=  '<ons-list-item class="list-item-container"><div class="list-item-right"><div class="list-item-content"><div class="name" style="border-bottom: 1px solid #ddd">'+v.Item+'</div><div style="border-bottom: 1px solid #ddd">Quantity: '+v.CaseQty+'</div><div class="date" style="border-bottom: 1px solid #ddd">Location Id: '+lastLocationData.locationId+'</div><div class="lucent date">'+v.Shipdate.toString().substr(0, v.Shipdate.lastIndexOf("T"))+'</div></div></div></ons-list-item>';
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
    lyt:function(){
        if(lastLocationData === null ){
            document.getElementById("lyt_ctr").innerHTML = '<p>No image to display.</p>';
        } else {
            //lastLocationData.img
            console.log(lastLocationData.locationId);
            var ref2 = window.open( lastLocationData.img, '_blank', 'EnableViewPortScale=yes' );
            ref2.addEventListener( 'loadstart', function () { } );
        }
    },
    pictk:function(){
        cameraOptions = {
            quality: 60,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            targetWidth: 512,
            targetHeight: 512,
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
            var currentlat = window.localStorage.getItem("asollc_app_lat");
            var currentlong = window.localStorage.getItem("asollc_app_long");
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: "json",
                url: 'http://twgverify.asolllc.net/api/visitdata',
                data: {Imagefilename: options.fileName, Lat: currentlat, Long: currentlong, Matchuplocationid: lastLocationData.locationId, UserGUID: user_data.GUID},
                success: function(data){
                    console.log(data);
                }
            });
        };
        // handle upload fail
        var fail = function(er){
            app.clearCache();
            ons.notification.alert({message: 'Error: '+er, title: 'Error', buttonLabel: 'OK', animation: 'default'});
        };
        // upload URL change here
        var upload_uri = "http://posverify.com/geofence/upload.php";
        var upload_path = "http://posverify.com/geofence/uploads/";
        var img_name = "img_"+Math.floor(Math.random()*10)+(new Date().getTime())+".jpg";
        // GET data 
        upload_uri = upload_uri + "?imgname="+encodeURIComponent(img_name)+"&lat="+encodeURIComponent(lastLocationData.geofenceLatitude)+"&lng="+encodeURIComponent(lastLocationData.geofenceLongitude)+"&guid="+encodeURIComponent(user_data.GUID)+"&locationid="+encodeURIComponent(lastLocationData.locationId)+"&geofenceid="+encodeURIComponent(lastLocationData.id);
        // upload file
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.fileKey = "img";
        options.fileName = img_name;
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