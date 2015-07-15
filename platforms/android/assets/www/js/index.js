/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        //window.addEventListener('orientationchange', app.cambioOrientacion);

        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    pushNotification: window.plugins.pushNotification,

    onDeviceReady: function() {

        var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ios" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "ios" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";

        $(".banner").show();

        if(deviceType == "Android"){

            app.pushNotification.register(
                app.notification.successHandler,
                app.notification.errorHandler,
                {
                    "senderID":"182650902788",
                    "ecb":"app.notification.onNotificationGCM"
                }
            );

        }else if(deviceType == "ios"){

            app.pushNotification.register(
                app.notification.tokenHandler,
                app.notification.errorHandler,
                {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"app.notification.onNotificationAPN"
                }
            );
        }


        document.addEventListener( "backbutton", function(){

            app.goBack();

        }, false );

        $(".btn-back").on("click",app.goBack);

        $(".btn-menu-link").on("click", function(){

            app.menuView();

        });

        if(localStorage.getItem("usr")){

            if(localStorage.getItem("actual")){
                
                $(".btn-back").fadeIn();
                window['app'][localStorage.getItem("actual")]();

            }else{

                app.setTypeView();

            }

        }else{

            localStorage.setItem("anterior", "");
            app.firstUserView();

        }
        
    },

    notification: {

        successHandler: function(result){

            //alert('Callback Success! Result = '+result);

        },

        errorHandler: function(error){

            //alert(error);

        },

        tokenHandler: function(token){

            localStorage.setItem("deviceId", token);
            console.log("Regid " + token);

            app.notification.deviceRegister(token);

        },

        onNotificationGCM: function(e){

            switch( e.event ){

                case 'registered':

                    localStorage.setItem("deviceId", e.regid);
                    console.log("Regid " + e.regid);

                    app.notification.deviceRegister(e.regid);

                    break;

                case 'message':
                    // this is the actual push notification. its format depends on the data model from the push server
                    app.pop.alert(e.message, "Hey!");
                    break;

                case 'error':
                    app.pop.alert('GCM error = '+e.msg);
                    break;

                default:
                    app.pop.alert('An unknown GCM event has occurred');
                    break;
            }

        },

        onNotificationAPN: function(event) {

            if ( event.alert ){

                navigator.notification.alert(event.alert);

            }

            if ( event.sound ){

                var snd = new Media(event.sound);
                snd.play();
            }

            // iOS8 only
            if ( event.category ){

            //notification action category

            }

            // iOS8 only
            if ( event.identifier ){

            //notification action identifier

            }

            if ( event.badge ){

                app.pushNotification.setApplicationIconBadgeNumber(
                    app.notification.successHandler,
                    app.notification.errorHandler,
                    event.badge);
            }
        },

        deviceRegister: function(iden){

            var user = localStorage.getItem("usr");
            var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ios" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "ios" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            var url = $("#urlapp").val();

            if ( user ){

                $.ajax({

                    url: url + 'register_device_notification',
                    type: 'GET',
                    data: {'iden': iden, 'user': user, 'os': deviceType}

                }).done(function(data){

                        //app.pop.alert("hola");

                });

            }

        }

    },
    
    firstUserView: function(){
    
        $("#principal").html('<div class="bg-movers">' +
            /*'<div class="barra-marron"></div>' +*/
            '<div style="text-align: center; margin-top: 30px;">' +
                '<img src="img/logoo_220.png" height="170px"/>' +
            '</div>' +
            '<div class="footer-test btn-group">' +
                '<a class="btn btn-first-view login">Log in</a>' +
            '</div>' +
        '</div>');
        
        $(function(){    //init

            localStorage.clear();
            localStorage.setItem("anterior", '');
            localStorage.setItem("actual", "firstUserView");
            $(".banner").hide();
            $(".btn-back").fadeOut();
            $(".footer").hide();
          
        });
        
        $(".btn-first-view").on("click", function(){
                     
            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-firstUserView");
            $(".footer").show();
            $(".banner").show();
                     
        });
        
        $(".login").on("click", app.loginView);
    
    },

    loginView: function(){

        $("#principal").html('<div style="background-color: #3B5998; max-height: 50px;">' +
            '<a class="btn nxt-btn" style="margin-top: 0px; background-color: #1dbb9c;">Log in with email</a>' +
        '</div>' +
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 first-inputs" style="text-align: center;">' +
                    '<label class="fancy-label" style="margin-top: 15px; margin-bottom: 10px;">or with email</label>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="usrname" type="email" class="form-control" placeholder="Email"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="password" type="password" class="form-control" placeholder="Password"/>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn login">Log in</a>' +
        '<div style="text-align: center;">' +
            '<label class="fancy-label signup">Don\'t have an account?</label>' +
            '<p>' +
                '<label class="fancy-label f-pass">Forgot your password?</label>' +
            '</p>' +
        '</div>');

        $(function(){    //init

            localStorage.setItem("actual", "loginView");
            $(".btn-menu-link").hide();
            $(".btn-back").fadeIn();

            /*$('#usrname').css({background: 'url(img/Icons/user.png) no-repeat left center'});
            $('#password').css({background: 'url(img/Icons/password.png) no-repeat left center'});
            $('#usrname').css({'background-size': '48px'});
            $('#password').css({'background-size': '38px'});*/

            $(".logo-place").html('<label style="margin-bottom: 0px; margin-top: 10px;">WELCOME</label>');

        });

        $(".btn-fb").on("click", function(){

            facebookConnectPlugin.login(
                ["public_profile","email"],
                app.faceBook.loginSucess,
                app.faceBook.loginError
            );

        });

        $(".f-pass").on("click", function(){

            var url = $("#urlapp").val();
            url = url.split("/app_request/");
            url = url[0];

            window.open(url + "/user/password/reset/", "_system");

        });

        $(".signup").on("click", function(){

            var url = $("#urlapp").val();
            url = url.split("/app_request/");
            url = url[0];

            window.open(url + "/client/sign_up/", "_system");

        });

        $(".login").on("click", function(){

            var user = $("#usrname").val();
            var pass = $("#password").val();

            app.logIn(user, pass);

        });

    },
    
    signUpView: function(){
    
        $("#principal").html('<div style="background-color: #3B5998; max-height: 50px;">' +
            '<a class="btn btn-fb">Sign up with Facebook</a>' +
        '</div>' +
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 first-inputs" style="text-align: center;">' +
                    '<label class="fancy-label" style="margin-top: 15px; margin-bottom: 10px;">or with email</label>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="mail" type="email" class="form-control" placeholder="Email"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="password" type="password" class="form-control" placeholder="Choose password"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="confirmpassword" type="password" class="form-control" placeholder="Confirm password"/>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn signup">Sign up</a>');
        
        $(function(){    //init
          
            localStorage.setItem("actual", "signUpView");
            $(".btn-menu-link").hide();
            $(".btn-back").fadeIn();

            /*$('#name').css({background: 'url(img/Icons/user.png) no-repeat left center'});
            $('#mail').css({background: 'url(img/Icons/Email.png) no-repeat left center'});
            $('#phone').css({background: 'url(img/Icons/phone.png) no-repeat left center'});
            $('#password, #confirmpassword').css({background: 'url(img/Icons/password.png) no-repeat left center'});
            $('.first-inputs input').css({'background-size': '48px'});
            $('#password, #confirmpassword, #phone').css({'background-size': '38px'});*/

            $(".logo-place").html('<label style="margin-bottom: 0px; margin-top: 10px;">NEW ACCOUNT</label>');

         });

        $(".btn-fb").on("click", function(){

            facebookConnectPlugin.login(
                ["public_profile","email"],
                app.faceBook.loginSucess,
                app.faceBook.loginError
            );

        });
        
        $(".signup").on("click", function(){

            var Flag = false;
                       
            $(".form-control").each(function(){
                                    
                if($(this).val() == ""){
                
                    Flag = true;
                                    
                }
                                        
            });
                       
            if(Flag){
                       
                app.pop.alert("Fields can\'t be empty.", "Ops!");
            
            }
                       
            if($("#password").val() != $("#confirmpassword").val() && !Flag){
            
                app.pop.alert("Passwords don\'t mach!", "Passwords!");
                Flag = true;
                        
                $("#password").val("");
                $("#confirmpassword").val("");
                       
            }
            
            if(!Flag){

                var mail = $("#mail").val();
                var password = $("#password").val();
                            
                app.signUp(mail, password, false);
                       
            }
                            
        });
    
    
    },

    menuView: function(){

        $("#principal").html('<div class="container">' +
                '<div style="margin-top: 10px;" class="row">' +
                    '<div class="col-xs-12">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu btn-menu-history make-move">Make a move</a>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu btn-menu-history history">Move history</a>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu btn-menu-history rate">Rate</a>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu btn-menu-history inbox">Inbox</a>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu logout">Log out</a>' +
                    '</div>' +
                '</div>' +
            '</div>');

        $(function(){    //init

            localStorage.setItem("actual", "menuView");
            localStorage.setItem("anterior", "-setTypeView");
            $(".btn-menu-link").fadeOut();
            $(".btn-back").show();

        });

        $(".btn-menu-history").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-menuView");
            $(".btn-menu-link").show();

        });

        $(".make-move").on("click", function(){

            app.setTypeView();

        });

        $(".history").on("click", function(){

            app.moveHistoryView();

        });

        $(".rate").on("click", function(){

            app.rateMoverHistoryView();

        });

        $(".inbox").on("click", function(){

            app.inboxView();

        });

        $(".logout").on("click", function(){

            app.logOut();

        });

    },

    moveHistoryView: function(){

        var user = localStorage.getItem("usr");
        var date_aux;
        var time_aux;
        var url = $("#urlapp").val();

        $.ajax({

            url:url + 'history',
            type: 'GET',
            data: { user: user }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Moving history.</div>' +
            '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
                "<div class='row'>" +
                    "<div id='bod' class='col-xs-12'></div>" +
                "</div>" +
            "</div>");

            var num = data.length;

            if(num > 0){

                for(var i=0; i<num; i++){

                    date_aux = data[i].fields.start_date;
                    date_aux = date_aux.split("-");
                    date_aux = app.months(date_aux[1]) + ', ' + date_aux[2];
                    time_aux = data[i].fields.start_time.split(":");
                    time_aux = time_aux[0] + ":" + time_aux[1];
                    date_aux = date_aux + " at " + time_aux;

                    $("#bod").append('<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<div class="container">' +
                                '<div class="row">' +
                                    '<div class="col-xs-6">' +
                                        '<label for="size-span">Size: </label>' +
                                        '<span id="size-span">' + data[i].fields.moving_size + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6">' +
                                        '<label for="date-span">Date: </label>' +
                                        '<span id="date-span">' + date_aux + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6 type">' +
                                        '<label for="type-span">Type: </label>' +
                                        '<span id="type-span">' + data[i].fields.type + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6 status">' +
                                        '<label for="status-span">Status: </label>' +
                                        '<span id="status-span">' + data[i].fields.status + '</span>' +
                                    '</div>' +
                                    '<div style="margin-top: 10px;" class="col-xs-12 status">' +
                                        '<a class="btn nxt-btn btn-block move" id="' + data[i].pk + '">CHECK!' +
                                            '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');

                }

            }else if(!data.status){

                $("#bod").append('<div class="panel panel-default" style="margin-bottom: 15px;">' +
                    '<div class="panel-body">' +
                        '<div class="container">' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h3>There are no moves!</h3>' +
                                '</div>' +
                                '<div style="margin-top: 10px;" class="col-xs-12">' +
                                    '<a class="btn nxt-btn btn-block back">go back</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');

                $(".back").on("click", app.goBack);

            }else{

                app.pop.preventLogOut(data.status);

            }

            $(function(){ //init

                localStorage.setItem("actual", "moveHistoryView");

            });

            $(".move").on("click", function(){

                var iden = $(this).prop("id");

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-moveHistoryView");
                app.moveDetailView(iden);

            });

            $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-moveHistoryView");

            });

        });

    },

    moveDetailView: function(move){

        $("#principal").html('<div class="container" style="margin-top: 15px;">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div style="text-align: center;">' +
                        '<label class="fancy-label">Status.</label>' +
                    '</div>' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<p>' +
                                '<b>Status: </b>' +
                                '<span class="status"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Total Price: $</b>' +
                                '<span class="total"></span>' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div style="text-align: center;">' +
                        '<label class="fancy-label">Detail.</label>' +
                    '</div>' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<p>' +
                                '<b>Departure time: </b>' +
                                '<span class="date"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Size: </b>' +
                                '<span class="size"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Number of hours: </b>' +
                                '<span class="hours"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Crew size: </b>' +
                                '<span class="crew"></span>' +
                            '</p>' +
                            '<div class="departure-block">' +
                                '<p>' +
                                    '<b>Departure address: </b>' +
                                    '<span class="departure"></span>' +
                                '</p>' +
                            '</div>' +
                            '<div class="arrival-block">' +
                                '<p>' +
                                    '<b>Arrival address: </b>' +
                                    '<span class="arrival"></span>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');

        var url = $("#urlapp").val();

        $.ajax({

            url: url + 'move_detail',
            type: 'GET',
            data: { move: move },
            error: function(a,b,c){

               app.pop.alert(c, b);

            }

        }).done(function(data){

            var disp = {

                load: function(){

                    var dep_add = data.departure;

                    $(".departure").html(dep_add);

                },

                unload:function(){

                    var arr_add= data.arrival;

                    $(".arrival").html(arr_add);

                }
            };

            $(function(){   //init

                var type = data.type;
                var date = data.start_date;
                var time = data.start_time;
                var hours = data.hours;
                var size = data.moving_size;
                var total = data.total_price;
                var crew = data.size_of_crew;
                var status = data.work_on;

                var month = date.split("-");
                var year = month[0];
                var day = month[2];

                month = month[1];
                month = app.months(month);

                date = month + '. ' + day + ', ' + year;

                var time_full = date + " at " + time;

                localStorage.setItem("actual", "moveDetailView");

                $(".date").html(time_full);
                $(".size").html(size);
                $(".hours").html(hours);
                $(".crew").html(crew);

                if(type == "Load"){

                    $(".arrival-block").hide();
                    disp.load();

                }else if(type == "Unload"){

                    $(".departure-block").hide();
                    disp.unload();

                }else{

                    disp.load();
                    disp.unload();

                }

                $(".status").html(status);

                $(".total").html(total);

            });

            $(".back").on("click", function(){

                app.goBack();

            });

        });

    },

    months: function(a){

        var mon;

        switch(a){

            case '01':
                mon = "Jan";
                break;
            case '02':
                mon = "Feb";
                break;
            case '03':
                mon = "Mar";
                break;
            case '04':
                mon = "Apr";
                break;
            case '05':
                mon = "May";
                break;
            case '06':
                mon = "Jun";
                break;
            case '07':
                mon = "Jul";
                break;
            case '08':
                mon = "Agu";
                break;
            case '09':
                mon = "Sep";
                break;
            case '10':
                mon = "Oct";
                break;
            case '11':
                mon = "Nov";
                break;
            case '12':
                mon = "Dec";
                break;

        }

        return mon;

    },

    rateMoverHistoryView: function(){

        var user = localStorage.getItem("usr");
        var date_aux;
        var time_aux;
        var url = $("#urlapp").val();

        $.ajax({

            url:url + 'rate_history',
            type: 'GET',
            data: { user: user }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Rate the moving.</div>' +
            '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
                "<div class='row'>" +
                    "<div id='bod' class='col-xs-12'></div>" +
                "</div>" +
            "</div>");

            var num = data.length;

            if(num > 0){

                for(var i=0; i<data.length; i++){

                    date_aux = data[i].fields.start_date;
                    date_aux = date_aux.split("-");
                    date_aux = app.months(date_aux[1]) + ', ' + date_aux[2];
                    time_aux = data[i].fields.start_time.split(":");
                    time_aux = time_aux[0] + ":" + time_aux[1];
                    date_aux = date_aux + " at " + time_aux;

                    $("#bod").append('<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<div class="container">' +
                                '<div class="row">' +
                                    '<div class="col-xs-6">' +
                                        '<label for="size-span">Size: </label>' +
                                        '<span id="size-span">' + data[i].fields.moving_size + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6">' +
                                        '<label for="date-span">Date: </label>' +
                                        '<span id="date-span">' + date_aux + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6 type">' +
                                        '<label for="type-span">Type: </label>' +
                                        '<span id="type-span">' + data[i].fields.type + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6 status">' +
                                        '<label for="status-span">Status: </label>' +
                                        '<span id="status-span">' + data[i].fields.status + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-12 status">' +
                                        '<a class="btn nxt-btn btn-block move" id="' + data[i].pk + '">Rate movers!' +
                                            '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');

                }

            }else if(!data.status){

                $("#bod").append('<div class="panel panel-default" style="margin-bottom: 15px;">' +
                    '<div class="panel-body">' +
                        '<div class="container">' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h3>There are no moves to rate!</h3>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<a class="btn nxt-btn btn-block back">go back</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');

                $(".back").on("click", app.goBack);

            }else{

                app.pop.preventLogOut(data.status);

            }

            $(function(){ //init

                localStorage.setItem("actual", "rateMoverView");

            });

            $(".move").on("click", function(){

                var iden = $(this).prop("id");

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-rateMoverHistoryView");
                app.moverListForRate(iden);

            });

            $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-rateMoverHistoryView");

            });

        });

    },

    moverListForRate: function(move){

        var url = $("#urlapp").val();

        $.ajax({

            url:url + 'movers_list_for_move',
            type: 'GET',
            data: { move: move }

        }).done(function(data){

            var num = data.length;

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Movers in this move!</div>' +
            '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
                "<div class='row'>" +
                    "<div id='bod' class='col-xs-12'></div>" +
                "</div>" +
            "</div>");

            if(num > 0){

                for(var i=0; i<data.length; i++){

                    var html = '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<div class="container">' +
                                '<div class="row">' +
                                    '<div class="col-xs-12">' +
                                        '<span id="size-span">' + data[i].mover.user.first_name + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-12">' +
                                        '<label for="date-span">Phone number: </label>' +
                                        '<span id="date-span">' + data[i].mover.phone_number + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-12 status">';

                                    if(!data[i].rate){

                                        html = html + '<a class="btn btn-primary btn-block move" id="' + data[i].mover.id + '-' + data[i].id + '">rate!</a>';

                                    }else{

                                        switch (data[i].rate){
                                            case 1:

                                                html = html + '<img id="star-1" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-2" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-3" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-4" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-5" class="img-star" src="img/star-empty.png" height="18">';

                                                break;
                                            case 2:

                                                html = html + '<img id="star-1" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-2" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-3" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-4" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-5" class="img-star" src="img/star-empty.png" height="18">';

                                                break;
                                            case 3:

                                                html = html + '<img id="star-1" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-2" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-3" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-4" class="img-star" src="img/star-empty.png" height="18">' +
                                                '<img id="star-5" class="img-star" src="img/star-empty.png" height="18">';

                                                break;
                                            case 4:

                                                html = html + '<img id="star-1" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-2" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-3" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-4" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-5" class="img-star" src="img/star-empty.png" height="18">';

                                                break;
                                            case 5:

                                                html = html + '<img id="star-1" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-2" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-3" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-4" class="img-star" src="img/star-full.jpg" height="18">' +
                                                '<img id="star-5" class="img-star" src="img/star-full.jpg" height="18">';

                                                break;
                                        }

                                    }
                                    html = html + '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                    $("#bod").append(html);

                }

            }else if(!data.status){

                $("#bod").append('<div class="panel panel-defaul" style="margin-bottom: 15px;">' +
                    '<div class="panel-body">' +
                        '<div class="container">' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h3>There are no movers to rate!</h3>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<a class="btn btn-primary btn-block back">go back</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');

                $(".back").on("click", app.goBack);

            }else{

                app.pop.preventLogOut(data.status);

            }

            $(".move").on("click", function(){

                var iden = $(this).prop("id");

                app.moveRateView(iden);

            });

        });

    },

    moveRateView: function(iden){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Move detail.</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<p>' +
                                '<b>Departure time: </b>' +
                                '<span class="date"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Size: </b>' +
                                '<span class="size"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Number of hours: </b>' +
                                '<span class="hours"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Crew size: </b>' +
                                '<span class="crew"></span>' +
                            '</p>' +
                            '<div class="departure-block">' +
                                '<p>' +
                                    '<b>Departure address: </b>' +
                                    '<span class="departure"></span>' +
                                '</p>' +
                            '</div>' +
                            '<div class="arrival-block">' +
                                '<p>' +
                                    '<b>Arrival address: </b>' +
                                    '<span class="arrival"></span>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body" style="text-align: center;">' +
                            '<img id="star-1" class="img-star" src="img/star-full.jpg" height="32">' +
                            '<img id="star-2" class="img-star" src="img/star-full.jpg" height="32">' +
                            '<img id="star-3" class="img-star" src="img/star-empty.png" height="32">' +
                            '<img id="star-4" class="img-star" src="img/star-empty.png" height="32">' +
                            '<img id="star-5" class="img-star" src="img/star-empty.png" height="32">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<a class="btn btn-block btn-primary rate">Rate!</a>' +
                '</div>' +
            '</div>' +
            '<div id="spin"></div>' +
        '</div>');

        var url = $("#urlapp").val();
        var move = iden.split("-");
        var workon;

        workon = move[1];
        move = move[0];

        function setSart(star){

            switch (star){
                case '1':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-empty.png");
                    $("#star-3").prop("src","img/star-empty.png");
                    $("#star-4").prop("src","img/star-empty.png");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.setItem("rate", "1");

                    break;
                case '2':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-empty.png");
                    $("#star-4").prop("src","img/star-empty.png");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.setItem("rate", "2");

                    break;
                case '3':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-empty.png");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.setItem("rate", "3");

                    break;
                case '4':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-full.jpg");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.setItem("rate", "4");

                    break;
                case '5':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-full.jpg");
                    $("#star-5").prop("src","img/star-full.jpg");

                    localStorage.setItem("rate", "5");

                    break;
            }

        }

        $.ajax({

            url: url + 'move_detail',
            type: 'GET',
            data: { move: move },
            error: function(a,b,c){

                app.pop.alert(c, b);

            }

        }).done(function(data){

            var disp = {

                load: function(){

                    var dep_add = data.departure;

                    $(".departure").html(dep_add);

                },

                unload:function(){

                    var arr_add= data.arrival;

                    $(".arrival").html(arr_add);

                }
            };

            $(function(){   //init

                var type = data.type;
                var date = data.start_date;
                var time = data.start_time;
                var hours = data.hours;
                var size = data.moving_size;
                var crew = data.size_of_crew;

                if(localStorage.getItem("rate")){

                    setSart(localStorage.getItem("rate"));

                }else{

                    localStorage.setItem("rate", "2");

                }

                localStorage.setItem("actual", "moveDetailView");

                var time_full = date + " at " + time;

                $(".date").html(time_full);
                $(".size").html(size);
                $(".hours").html(hours);
                $(".crew").html(crew);

                if(type == "load"){

                    $(".arrival-block").fadeOut();
                    disp.load();

                }else if(type == "unload"){

                    $(".departure-block").fadeOut();
                    disp.unload();

                }else{

                    disp.load();
                    disp.unload();

                }

            });

            $(".back").on("click", function(){

                app.moverListForRate(move);

            });

            $(".rate").on("click", function(){

                var rateScore = localStorage.getItem("rate");

                $.ajax({

                    url: url + 'rate_mover',
                    type: 'GET',
                    data: {'rate': rateScore, 'workon': workon}

                }).done(function(data){

                    if(data.status == "ok"){

                        app.moverListForRate(data.move);

                    }

                });

            });

        });

        $(".img-star").on("click", function(){

            var star = $(this).prop("id");

            star = star.split("-");
            star = star[1];

            setSart(star);

        });

    },

    setTypeView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">How can we help you?</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="load" class="btn btn-lg btn-primary btn-type-view btn-block btn-mov-arrow load">Load' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="unload" class="btn btn-lg btn-primary btn-type-view btn-block btn-mov-arrow unload">Unload' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="full" class="btn btn-lg btn-primary btn-type-view btn-block btn-mov-arrow full">Full Move' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.removeItem("actual");
            localStorage.setItem("anterior", "");
            $(".btn-menu-link, .banner").show();
            $(".btn-back").fadeOut();

            if(localStorage.getItem("type")){

                var type = localStorage.getItem("type");

                $(".arrow-button-"+type).attr('src', 'img/Icons/OrangeArrowRight.png');
                $("#"+type).removeClass("btn-primary");
                $("#"+type).addClass("btn-current");

                $("#"+type).removeClass("btn-mov-arrow");
                $("#"+type).addClass("btn-mov-size-current");

            }
        });

        $(".btn-type-view, .btn-menu-link").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setTypeView");
            localStorage.setItem("type", $(this).prop("id"));

        });

        $(".btn-type-view").on("click", function(){

            $(".btn-back").fadeIn();

        });

        $(".load, .unload").on("click", app.setMovingSizeView);

        $(".full").on("click", app.needATruckView);

    },

    needATruckView: function(){

        $("#principal").html('<div style="margin-top: 5px;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 " style="margin-top: 15px;">' +
                    '<a class="btn btn-lg btn-primary btn-block btn-menu btn-mov-arrow btn-truck yes">i need a truck' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 ">' +
                    '<a class="btn btn-lg btn-primary btn-block btn-menu btn-mov-arrow btn-truck no">i don\'t need it' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.setItem("actual", "needATruckView");

            if(localStorage.getItem("truck")){

                $(".arrow-button-yes").attr('src', 'img/Icons/OrangeArrowRight.png');
                $(".yes").removeClass("btn-primary");
                $(".yes").addClass("btn-current");

                $(".yes").removeClass("btn-mov-size");
                $(".yes").addClass("btn-mov-size-current");

            }else{

                $(".arrow-button-no").attr('src', 'img/Icons/OrangeArrowRight.png');
                $(".no").removeClass("btn-primary");
                $(".no").addClass("btn-current");

                $(".no").removeClass("btn-mov-arrow");
                $(".no").addClass("btn-mov-size-current");

            }
        });

        $(".btn-truck, .btn-menu-link").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-needATruckView");

        });

        $(".no").on("click", function(){

            localStorage.removeItem("truck");

            app.setMovingSizeView();

        });

        $(".yes").on("click", app.setTruckSizeView);

    },

    setTruckSizeView: function(){

        $("#principal").html('<div class="container" style="margin-top: 15px;">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="10ft" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-truck-size">10ft' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="14ft" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-truck-size">14ft' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="17ft" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-truck-size">17ft' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="20ft" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-truck-size">20ft' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="24ft" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-truck-size">24ft+' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.setItem("actual", "setTruckSizeView");

            if(localStorage.getItem("truck")){

                var truck = localStorage.getItem("truck");
                truck = truck.split("+");
                truck = truck[0];

                $(".arrow-button-"+truck).attr('src', 'img/Icons/OrangeArrowRight.png');
                $("#"+truck).removeClass("btn-primary");
                $("#"+truck).addClass("btn-current");

                $("#"+truck).removeClass("btn-mov-arrow");
                $("#"+truck).addClass("btn-mov-size-current");

            }
        });

        $(".btn-truck-size").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setTruckSizeView");

            if($(this).prop("id") == "24ft"){

                localStorage.setItem("truck", "24ft+");

            }else{

                localStorage.setItem("truck", $(this).prop("id"));

            }

            app.setMovingSizeView();

        });

        $(".btn-menu-link").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setTruckSizeView");

        });

    },

    setMovingSizeView: function(){

        $("#principal").html('<div class="sub-banner">What\'s your moving size?</div>' +
        '<div class="background-fade-test"></div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="studio" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">studio' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="1-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">1 bedroom apt.' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="2-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">2 bedroom apt.' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="3-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">3 bedroom apt.' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="2-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">2 bedroom house' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="3-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">3 bedroom house' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="4-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">4 bedroom house' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="storage" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">storage' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class="btn-menu btn-mov-size-bg">' +
                        '<a id="business-and-office" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">business & office' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class=" btn-menu btn-mov-size-bg">' +
                        '<a id="other" class="btn btn-lg btn-primary btn-block btn-mov-arrow btn-mov-size">other' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.setItem("actual", "setMovingSizeView");

            if(localStorage.getItem("size")){

                var size = localStorage.getItem("size");

                $("#"+size).removeClass("btn-primary");
                $("#"+size).addClass("btn-current");

                $("#"+size).removeClass("btn-mov-arrow");
                $("#"+size).addClass("btn-mov-size-current");

            }
        });

        $(".btn-mov-size").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setMovingSizeView");
            localStorage.setItem("size", $(this).prop("id"));

            var type = localStorage.getItem("type");

            if(type == "full" || type == "load"){

                app.setDepartureView();

            }else{

                app.setDate();

            }

        });

        $(".btn-menu-link").on("click", function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setMovingSizeView");

        });
    },

    setDepartureView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Where are you moving from?</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                /*'<div class="col-xs-12">' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<div id="geolocation" style="height: 300px; margin-bottom: 15px;" class="col-xs-12"></div>' +
                            'Where Are You Moving From?' +
                            '<a class="btn btn-xs btn-primary pull-right" id="set-current-location">Use current address</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +*/
                '<div class="col-xs-12">' +
                    '<div class=" departure-panel">' +
                        '<div hidden="true">' +
                            '<span id="lat"></span>' +
                            '<span id="lon"></span>' +
                            '<span id="departure-bool">true</span>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="Street address" class="address-input" id="street-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="City" class="address-input" id="city-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="State" class="address-input" id="state-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="number" placeholder="Zip code" class="address-input" id="zipcode-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="move-specification" style="padding: 7px;">Any additional comments or directions we need to know about this location?</label>' +
                            '<textarea class="address-input" id="move-specification" rows="4"></textarea>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn">Next</a>');

        $(function(){   //init

            $(".nxt-btn").fadeIn();

            localStorage.setItem("actual", "setDepartureView");

            var initData = localStorage.getItem("departure");

            if(initData){    //lat||lon||street||city||state||zipcode||spe

                initData = initData.split("||");

                $("#street-input").val(initData[2]);
                $("#city-input").val(initData[3]);
                $("#state-input").val(initData[4]);
                $("#zipcode-input").val(initData[5]);
                $("#move-specification").val(initData[6]);

            }

            //app.mapInit();

        });

        $(".nxt-btn").on("click", function(){

            var flag = false;
            var lat = 39.728454;
            var lon = -104.99832800000001;
            var street = $("#street-input").val();
            var city = $("#city-input").val();
            var state = $("#state-input").val();
            var zipcode = $("#zipcode-input").val();
            var esp = $("#move-specification").val();

            $(".departure-panel input").each(function(){

                if($(this).val() == ''){

                    flag = true;

                }

            });

            if(flag){

                app.pop.alert("Set specific address.");

            }else{

                var address = street + ', ' + city + ', ' + state + ' ' + zipcode + ', USA'
                var geocoder = new google.maps.Geocoder();

                geocoder.geocode( { 'address': address}, function(results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        lat = results[0].geometry.location.lat;
                        lon = results[0].geometry.location.lon;


                    }

                });

                var departure = lat +
                    "||" + lon +
                    "||" + street +
                    "||" + city +
                    "||" + state +
                    "||" + zipcode +
                    "||" + esp;

                localStorage.setItem("departure", departure);

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setDepartureView");

                $(".nxt-btn").fadeOut();

                app.setDate();

            }

        });

        $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setDepartureView");

        });

    },

    setArrivalView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Where are you moving to?</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                /*'<div class="col-xs-12">' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<div id="geolocation" style="height: 300px; margin-bottom: 15px;" class="col-xs-12"></div>' +
                            'Where Are You Moving To?' +
                            '<a class="btn btn-xs btn-primary pull-right" id="set-current-location">Use current address</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +*/
                '<div class="col-xs-12">' +
                    '<div class="arrival-panel">' +
                        '<div hidden="true">' +
                            '<span id="lat"></span>' +
                            '<span id="lon"></span>' +
                            '<span id="departure-bool">false</span>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="Street address" class="address-input" id="street-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="City" class="address-input" id="city-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="State" class="address-input" id="state-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="number" placeholder="Zip code" class="address-input" id="zipcode-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="move-specification" style="padding: 7px;">Any additional comments or directions we need to know about this location?</label>' +
                            '<textarea class="address-input" id="move-specification" rows="4"></textarea>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn">Next</a>');

        $(function(){   //init

            $(".nxt-btn").fadeIn();

            localStorage.setItem("actual", "setArrivalView");

            var initData = localStorage.getItem("arrival");

            if(initData){    //lat||lon||street||city||state||zipcode||spe

                initData = initData.split("||");

                $("#street-input").val(initData[2]);
                $("#city-input").val(initData[3]);
                $("#state-input").val(initData[4]);
                $("#zipcode-input").val(initData[5]);
                $("#move-specification").val(initData[6]);

            }

            //app.mapInit();

        });

        $(".back").on("click", function(){

            app.goBack();

        });

        $(".nxt-btn").on("click", function(){

            var lat = 39.728454;
            var lon = -104.99832800000001;
            var flag = false;
            var street = $("#street-input").val();
            var city = $("#city-input").val();
            var state = $("#state-input").val();
            var zipcode = $("#zipcode-input").val();
            var esp = $("#move-specification").val();

            $(".arrival-panel input").each(function(){

                if($(this).val() == ''){

                    flag = true;

                }

            });

            if(flag){

                app.pop.alert("Set specific address.");

            }else{

                var arrival;
                var address = street + ', ' + city + ', ' + state + ' ' + zipcode + ', USA'
                var geocoder = new google.maps.Geocoder();

                geocoder.geocode( { 'address': address}, function(results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        lat = results[0].geometry.location.lat;
                        lon = results[0].geometry.location.lon;


                    }

                });


                arrival = lat +
                    "||" + lon +
                    "||" + street +
                    "||" + city +
                    "||" + state +
                    "||" + zipcode +
                    "||" + esp;

                localStorage.setItem("arrival", arrival);

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setArrivalView");

                $(".nxt-btn").fadeOut();

                app.setPersonalInfo();

            }
        });

        $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setArrivalView");

        });
    },

    setDate: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">You\'re almost done...</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12" style="margin-top: 10px;">' +
                    '<div class="setDateClass">' +
                        '<div class="form-group" style="background-color: #FF7519"> ' +
                            '<input type="date" placeholder="DATE" class="address-input" name="date" id="date">' +
                        '</div>' +
                        '<div class="form-group" style="background-color: #FF7519">' +
                            '<input type="time" placeholder="TIME" class="address-input" name="time" id="time">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input id="est-hou" placeholder="Estimate # of hours" class="address-input" type="number"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="number" placeholder="Choose size of crew" id="size-crew" class="address-input"/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-block btn-primary nxt-btn">Next</a>');

        $(function(){  //init

            localStorage.setItem("actual", "setDate");

            $("#date").val(localStorage.getItem("date"));
            $("#time").val(localStorage.getItem("time"));
            $("#est-hou").val(localStorage.getItem("hours"));
            $("#size-crew").val(localStorage.getItem("crew"));

            if($('#date').val() != ''){

                $('#date').css({background: 'none'});

            }else{

                $('#date').css({background: 'url(img/DATE.png) no-repeat left center'});
                $('#date').css({'background-size': '48px'});

            }

            if($('#time').val() != ''){

                $('#time').css({background: 'none'});

            }else{

                $('#time').css({background: 'url(img/TIME.png) no-repeat left center'});
                $('#time').css({'background-size': '48px'});

            }

        });

        $(".back").on("click", function(){

            app.goBack();

        });

        $("#date, #time").on("change", function(){

            if($(this).val() != ''){

                $(this).css({background: 'none'});

            }else{

                if($(this).prop("id") == "date"){

                    $(this).css({background: 'url(img/DATE.png) no-repeat left center'});

                }else{

                    $(this).css({background: 'url(img/TIME.png) no-repeat left center'});

                }

                $(this).css({'background-size': '48px'});

            }

        });

        $(".nxt-btn").on("click", function(){

            var esthou = $("#est-hou").val();
            var estcrew = $("#size-crew").val();
            var flag = false;

            $(".setDateClass input").each(function(){

                if($(this).val() == ''){

                    flag = true;

                }

            });

            if(flag){

                app.pop.alert("Fields can't be empty.");

            }else if(esthou < 1){

                app.pop.alert("Estimate the number of hours must be greater than zero.");

            }else if(estcrew < 1){

                app.pop.alert("Size of crew must be greater than zero.");

            }else{


                var type = localStorage.getItem("type");

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setDate");

                localStorage.setItem("date", $("#date").val());

                localStorage.setItem("time", $("#time").val());

                localStorage.setItem("hours", esthou);

                localStorage.setItem("crew", estcrew);

                if(type == "load"){

                    app.setPersonalInfo();

                }else{

                    app.setArrivalView();

                }
            }
        });

        $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setDate");

        });
    },

    setPersonalInfo: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Personal information</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12" style="margin-top: 10px;">' +
                    '<div class="setPersonalInfoClass">' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="Full name" class="address-input" id="client-name-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="Phone number" class="address-input" id="client-phone-input"/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-block btn-primary nxt-btn">Next</a>');

        $(function(){   //init

            $(".nxt-btn").fadeIn();

            localStorage.setItem("actual", "setPersonalInfo");

            var name = localStorage.getItem("name");
            var phone = localStorage.getItem("phone");

            if(name){

                $("#client-name-input").val(name);

            }

            if(phone){

                $("#client-phone-input").val(phone);

            }

        });

        $(".back").on("click", function(){

            app.goBack();

        });

        $(".nxt-btn").on("click", function(){

            var flag = false;

            $(".setPersonalInfoClass input").each(function(){

                if($(this).val() == ''){

                    flag = true;

                }

            });

            if(flag){

                app.pop.alert("Fields can't be empty.");

            }else{

                var name = $("#client-name-input").val();
                var phone = $("#client-phone-input").val();

                localStorage.setItem("name", name);
                localStorage.setItem("phone", phone);

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setPersonalInfo");

                $(".nxt-btn").fadeOut();

                app.resumeView();

            }
        });

        $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-setArrivalView");

        });

    },

    resumeView: function(){

        var url = $("#urlapp").val();
        var size_of_crew = localStorage.getItem("crew");
        var hours = localStorage.getItem("hours");
        var move_type = localStorage.getItem("type");
        var truck = localStorage.getItem("truck");

        if(move_type == "full"){

            move_type = "Full";

        }

        $.ajax({

            url: url + 'request_calculate_billing',
            type: 'GET',
            data: { 'size_of_crew': size_of_crew, 'hours': hours, 'type': move_type, 'truck': truck }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Double check your move.</div>' +
            '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
                '<div class="row">' +
                    '<div class="col-xs-12">' +
                        '<div class="panel panel-default">' +
                            '<div class="panel-body">' +
                                '<p>' +
                                    '<b>Full Name: </b>' +
                                    '<span class="client-name"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Phone Number: </b>' +
                                    '<span class="client-phone"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Date Time: </b>' +
                                    '<span class="date"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Number Of Hours: </b>' +
                                    '<span class="hours"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Minimum Crew Size: </b>' +
                                    '<span class="crew"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Type Of Move: </b>' +
                                    '<span class="type"></span>' +
                                '</p>' +
                                '<p>' +
                                    '<b>Moving Size: </b>' +
                                    '<span class="size"></span>' +
                                '</p>' +
                                '<div class="departure-block">' +
                                    '<p>' +
                                        '<b>Departure Address: </b>' +
                                        '<span class="departure"></span>' +
                                    '</p>' +
                                '</div>' +
                                '<div class="arrival-block">' +
                                    '<p>' +
                                        '<b>Arrival Address: </b>' +
                                        '<span class="arrival"></span>' +
                                    '</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group" align="center" style="text-align: center;">' +
                        '<label class="fancy-label" style="padding: 7px;">Payment Information:</label>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="panel panel-default">' +
                            '<div class="panel-body">' +
                                '<p>' +
                                    '<label>Amount Due:</label>' +
                                    '<ul>' +
                                        'Travel Charge: ' +
                                        '$<span class="travle"></span>' +
                                    '</ul>' +
                                '</p>' +
                                '<p>' +
                                    '<label>Remaining Balance:</label>' +
                                    '<ul>' +
                                        'Est. Moving Price: ' +
                                        '$<span class="estimate"></span>' +
                                        '<br>' +
                                        '<div class="truck-block">' +
                                            'Truck: ' +
                                            '$<span class="truck"></span>' +
                                            '<br>' +
                                        '</div>' +
                                        '<span>Due at completion of move</span>' +
                                    '</ul>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<a class="btn btn-block nxt-btn">Next</a>');

            var disp = {

                load: function(){

                    var dep_add = localStorage.getItem("departure");

                    dep_add = dep_add.split("||");
                    dep_add = dep_add[2] + ', ' + dep_add[3] + ', ' + dep_add[4] + ', ' + dep_add[5];

                    $(".departure").html(dep_add);


                },

                unload:function(){

                    var arr_add= localStorage.getItem("arrival");

                    arr_add = arr_add.split("||");
                    arr_add = arr_add[2] + ', ' + arr_add[3] + ', ' + arr_add[4] + ', ' + arr_add[5];

                    $(".arrival").html(arr_add);

                }
            };

            $(function(){   //init

                var type = localStorage.getItem("type");
                var date = localStorage.getItem("date");
                var time = localStorage.getItem("time");
                var hours = localStorage.getItem("hours");
                var size = localStorage.getItem("size");
                var name = localStorage.getItem("name");
                var phone = localStorage.getItem("phone");
                var total, truck;
                var crew = parseInt(localStorage.getItem("crew"));

                var month = date.split("-");
                var year = month[0];
                var day = month[2];

                month = month[1];
                month = app.months(month);

                date = month + '. ' + day + ', ' + year;

                var time_full = date + " at " + time;
                size = size.replace(/-/g, ' ');

                localStorage.setItem("actual", "resumeView");

                $(".date").html(time_full);
                $(".size").html(size);
                $(".hours").html(hours);
                $(".crew").html(crew);
                $(".type").html(type);
                $(".client-name").html(name);
                $(".client-phone").html(phone);

                if(type == "load"){

                    $(".arrival-block").hide();
                    disp.load();

                }else if(type == "unload"){

                    $(".departure-block").hide();
                    disp.unload();

                }else{

                    disp.load();
                    disp.unload();

                }

                if(localStorage.getItem("truck")){

                    $(".truck-block").show();
                    $(".truck").html(data.truck_fee);
                    truck = parseFloat(data.truck_fee);

                }else{

                    $(".truck-block").hide();
                    $(".truck").html(data.truck_fee);
                    truck = parseFloat(data.truck_fee);

                }

                var travel = parseFloat(data.travel_fee);
                var estimate = parseFloat(data.mover_fee);

                $(".travle").html(travel);
                $(".estimate").html(estimate);

            });

            $(".btn-menu-link").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-resumeView");

            });

            $(".nxt-btn").on("click", function(){

                localStorage.setItem("anterior", localStorage.getItem("anterior") + "-resumeView");

                app.movingPaymentView();

            });

            $(".back").on("click", function(){

                app.goBack();

            });

        });

    },

    successView: function(){

        $("#principal").html('<div class="container">' +
            '<div class="row">' +
                '<div style="padding-top: 10px;" class="col-xs-12">' +
                    '<div class="alert alert-success">' +
                        '<p>You have succesfully requested your move.</p>' +
                        '<p>Thank you for choosing MUV.</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div style="margin-top: 20px; margin-bottom: 20px;">' +
            '<a class="btn btn-primary nxt-btn finish">Finish</a>' +
        '</div>');

        $(function(){  //init

            var user = localStorage.getItem("usr");

            localStorage.clear();

            localStorage.setItem("usr", user);

        });

        $(".finish").on("click", app.moveHistoryView);

    },

    inboxView: function(){

        var user = localStorage.getItem("usr");
        var date_aux, time_aux;
        var url = $("#urlapp").val();

        $(function(){ //init

            localStorage.setItem("actual", "inboxView");

        });

        $.ajax({

            url:url + 'inbox',
            type: 'GET',
            data: { user: user }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Inbox.</div>' +
            '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
                "<div class='row'>" +
                    "<div id='bod' class='col-xs-12'></div>" +
                "</div>" +
            "</div>");

            var num = data.length;

            if(num > 0){

                for(var i=0; i<num; i++){

                    date_aux = data[i].date;
                    date_aux = date_aux.split("-");
                    date_aux = app.months(date_aux[1]) + ', ' + date_aux[2];
                    time_aux = data[i].time.split(":");
                    time_aux = time_aux[0] + ":" + time_aux[1];
                    date_aux = date_aux + " at " + time_aux;

                    if(data[i].read == true){

                        $("#bod").append('<div class="panel panel-default">' +
                            '<div class="panel-body">' +
                                '<div class="container">' +
                                    '<div class="row">' +
                                        '<div class="col-xs-12">' +
                                            '<span id="title-span"> ' + data[i].title + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-6 type">' +
                                            '<label for="type-span">From: </label>' +
                                            '<span id="type-span"> ' + data[i].message_from.first_name + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-6">' +
                                            '<label for="date-span">Date: </label>' +
                                            '<span id="date-span"> ' + date_aux + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-6 status">' +
                                            '<label for="status-span">Status: </label>' +
                                            '<span id="status-span"> Readed</span>' +
                                        '</div>' +
                                        '<div class="col-xs-12 status">' +
                                            '<a class="btn nxt-btn btn-block message" id="' + data[i].id + '">VIEW' +
                                                '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                                            '</a>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');


                    }else{

                        $("#bod").append('<div class="panel panel-default">' +
                            '<div class="panel-body">' +
                                '<div class="container">' +
                                    '<div class="row">' +
                                        '<div class="col-xs-12">' +
                                            '<span id="title-span"> ' + data[i].title + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-6">' +
                                            '<label for="type-span">From: </label>' +
                                            '<span id="type-span"> ' + data[i].message_from.first_name + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-6">' +
                                            '<label for="date-span">Date: </label>' +
                                            '<span id="date-span"> ' + date_aux + '</span>' +
                                        '</div>' +
                                        '<div class="col-xs-12">' +
                                            '<label for="status-span">Status: </label>' +
                                            '<span id="status-span"> Unreaded</span>' +
                                        '</div>' +
                                        '<div class="col-xs-12 status">' +
                                            '<a class="btn nxt-btn btn-block message" id="' + data[i].id + '">VIEW' +
                                                '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                                            '</a>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');

                    }

                }

                $(".message").on("click", function(){

                    var iden = $(this).prop("id");
                    localStorage.setItem("anterior", localStorage.getItem("anterior") + "-inboxView");

                    app.displayMessageView(iden);

                });

            }else if(!data.status){

                $("#bod").append('<div class="panel panel-default" style="margin-bottom: 15px;">' +
                    '<div class="panel-body">' +
                        '<div class="container">' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h3>There are no messages!</h3>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<a class="btn nxt-btn btn-block back">go back</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');

                $(".back").on("click", app.goBack);

            }else{

                app.pop.preventLogOut(data.status);

            }

        });

    },

    displayMessageView: function(iden){

        var url = $("#urlapp").val();
        var date_aux, time_aux;

        $.ajax({

            url: url + "displayMessage/"+iden+'/',
            type: "GET"

        }).done(function(data){

            date_aux = data.date;
            date_aux = date_aux.split("-");
            date_aux = app.months(date_aux[1]) + ', ' + date_aux[2];
            time_aux = data.time.split(":");
            time_aux = time_aux[0] + ":" + time_aux[1];
            date_aux = date_aux + " at " + time_aux;

            $("#principal").html('<div class="panel panel-default" style="margin-bottom: 15px;">' +
                '<div class="panel-body">' +
                    '<div class="container">' +
                        '<div style="padding-top: 15px;" class="row">' +
                            '<div class="col-xs-6">' +
                                '<label for="type-span">From: </label>' +
                                '<span id="type-span"> ' + data.message_from.first_name + '</span>' +
                            '</div>' +
                            '<div class="col-xs-6">' +
                                '<label for="date-span">Date: </label>' +
                                '<span id="date-span"> ' + date_aux + '</span>' +
                            '</div>' +
                            '<div class="col-xs-12">' +
                                '<span id="title-span"> <h3>' + data.title + '</h3></span>' +
                            '</div>' +
                            '<div style="padding: 10px;" class="col-xs-12">' +
                                data.message +
                            '</div>' +
                            '<div class="col-xs-12">' +
                                '<a class="btn btn-primary btn-block back" style="text-align: center;">go back</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');

            $(".back").on("click", app.goBack);
        });
    },

    movingPaymentView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Enter payment info.</div>' +
        '<div style="margin-top: 50px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div class="movingPaymentP">' +
                        '<div class="form-group">' +
                            '<input placeholder="Card number" class="address-input" type="number" id="cnumber"/>' +
                        '</div>' +
                        '<div style="width: 49%; float:left;" class="form-group">' +
                            '<select id="tdcmonth" class="form-control address-input">' +
                                '<option value="-">Month</option>' +
                                '<option value="01">01</option>' +
                                '<option value="02">02</option>' +
                                '<option value="03">03</option>' +
                                '<option value="04">04</option>' +
                                '<option value="05">05</option>' +
                                '<option value="06">06</option>' +
                                '<option value="07">07</option>' +
                                '<option value="08">08</option>' +
                                '<option value="09">09</option>' +
                                '<option value="10">10</option>' +
                                '<option value="11">11</option>' +
                                '<option value="12">12</option>' +
                            '</select>' +
                        '</div>' +
                        '<div style="width: 49%; float:right;" class="form-group">' +
                            '<select id="tdcyear" class="form-control address-input">' +
                                '<option value="-">Year</option>' +
                                '<option id="year-tdc-0" value="01">01</option>' +
                                '<option id="year-tdc-1" value="02">02</option>' +
                                '<option id="year-tdc-2" value="03">03</option>' +
                                '<option id="year-tdc-3" value="04">04</option>' +
                                '<option id="year-tdc-4" value="05">05</option>' +
                                '<option id="year-tdc-5" value="06">06</option>' +
                                '<option id="year-tdc-6" value="07">07</option>' +
                                '<option id="year-tdc-7" value="08">08</option>' +
                                '<option id="year-tdc-8" value="09">09</option>' +
                                '<option id="year-tdc-9" value="10">10</option>' +
                            '</select>' +
                            /*'<input placeholder="MM/YYYY" class="address-input" type="text" id="tdcdate"/>' +*/
                        '</div>' +
                        '<div style="padding-top: 3px;" class="form-group">' +
                            '<input placeholder="CVC" class="address-input" type="password" id="ccv"/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn nxt-btn pay">Next</a>');

        localStorage.setItem("actual", "movingPaymentView");

        $(function(){   //init

            var date = new Date();
            var currentYear = parseInt(date.getFullYear());

            for(var i = 0; i< 10; i++){

                $("#year-tdc-"+i).val(currentYear + i);
                $("#year-tdc-"+i).html(currentYear + i);

            }

        });

        function checkDate(){

            var month = $("#tdcmonth").val();
            var year = $("#tdcyear").val();

            if(month != "-" && year != "-"){

                var date = new Date();
                month = parseInt(month);
                year = parseInt(year);
                var currentYear = parseInt(date.getFullYear());
                var currentMonth = parseInt(date.getMonth());

                if(year < currentYear || (year == currentYear && month < currentMonth)){

                    return false;

                }else{

                    return  true;

                }
            }else{

                return false;

            }

        }

        $("#tdcdate").focusout(function(){

            var value = $(this).val();

            if(value.length != 7){

                app.pop.alert("Invalid date.");
                $(this).val('');

            }else{

                var month = value.split('/');
                var flag = false;

                if(month.length == 2){

                    if(!jQuery.isArray( month[0] ) && (month[0] - parseFloat( month[0] ) + 1) >= 0){

                        flag = true;

                    }

                    if(!jQuery.isArray( month[1] ) && (month[1] - parseFloat( month[1] ) + 1) >= 0){

                        flag = true;

                    }

                    if(!flag){

                        app.pop.alert("Month and year most be numeric.");
                        $(this).val('');

                    }

                    if(month[0] < 1 || month[0] >12){

                        app.pop.alert("Invalid month.");
                        $(this).val('');

                    }

                }else{

                    app.pop.alert("Use \"/\" between month and year.");
                    $(this).val('');

                }
            }
        });

        $(".pay").on("click", function(){

            var one = $("#cnumber").val();
            var month = $("#tdcmonth").val();
            var year = $("#tdcyear").val();
            var two = parseInt(month);
            var three = parseInt(year);
            var four = $("#ccv").val();
            var flag = false;

            $(".movingPaymentP input").each(function(){

                if($(this).val() == ""){

                    flag = true;

                }

            });

            if(flag){

                app.pop.alert("Fields can\'t be empty.");

            }else if(!checkDate()){

                app.pop.alert("Please check your expiration date.");

            }else if(four.length != 3){

                app.pop.alert("Ccv field must have THREE characters.");

            }else{

                var arrival;
                var departure;
                var truck;
                var usr = localStorage.getItem("usr");
                var type = localStorage.getItem("type");
                var date = localStorage.getItem("date");
                var time = localStorage.getItem("time");
                var size = localStorage.getItem("size");
                var hours = localStorage.getItem("hours");
                var crew = localStorage.getItem("crew");
                var name = localStorage.getItem("name");
                var phone = localStorage.getItem("phone");
                var url = $("#urlapp").val();

                size = size.replace("-"," ");

                if(localStorage.getItem("departure")){

                    departure = localStorage.getItem("departure");

                }else{

                    departure = '';

                }

                if(localStorage.getItem("arrival")){

                    arrival = localStorage.getItem("arrival");

                }else{

                    arrival = '';

                }

                if(localStorage.getItem("truck")){

                    truck = localStorage.getItem("truck");

                }else{

                    truck = '';

                }

                $.ajax({

                    berofeSend:function(){

                        $("#spin").spin({
                            lines: 13, // The number of lines to draw
                            length: 20, // The length of each line
                            width: 10, // The line thickness
                            radius: 30, // The radius of the inner circle
                            corners: 1, // Corner roundness (0..1)
                            rotate: 0, // The rotation offset
                            direction: 1, // 1: clockwise, -1: counterclockwise
                            color: '#000', // #rgb or #rrggbb or array of colors
                            speed: 1, // Rounds per second
                            trail: 60, // Afterglow percentage
                            shadow: false, // Whether to render a shadow
                            hwaccel: false, // Whether to use hardware acceleration
                            className: 'spinner', // The CSS class to assign to the spinner
                            zIndex: 2e9, // The z-index (defaults to 2000000000)
                            top: '50%', // Top position relative to parent
                            left: '50%' // Left position relative to parent
                        });

                    },
                    url: url + 'move',
                    type:'GET',
                    data:{
                        'usr': usr,
                        'type': type,
                        'phone': phone,
                        'name': name,
                        'size': size,
                        'truck': truck,
                        'departure': departure,
                        'date': date,
                        'time': time,
                        'hours': hours,
                        'arrival': arrival,
                        'crew': crew,
                        'one': one,
                        'two': two,
                        'three': three,
                        'four': four
                    },
                    error: function(a,b,c){

                        app.pop.alert(c, b);

                    }

                }).done(function(data){

                    if(data.status == "ok"){

                        if(!data.status_tdc){

                            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-movingPaymentView");

                            app.successView();

                        }else{

                            app.pop.alert(data.status_tdc);

                        }

                    }else{

                        app.pop.preventLogOut(data.status);

                    }

                });

            }

        });

        $(".btn-menu-link").on('click', function(){

            localStorage.setItem("anterior", localStorage.getItem("anterior") + "-movingPaymentView");

        });

    },

    mapInit: function(){

        var flag = false;
        var markers = [];
        var marker = null;
        var newPos;
        var initData;
        var dep_arr = $("#departure-bool").html();
        var defCenter = new google.maps.LatLng(39.728454, -104.99832800000001);

        $("#lat").html(39.728454);
        $("#lon").html(-104.99832800000001);

        var mapOptions = {

            center: defCenter,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };

        if(dep_arr == "true"){

            initData = localStorage.getItem("departure");

        }else{

            initData = localStorage.getItem("arrival");

        }

        if(initData){    //lat||lon||street||city||state||zipcode||spe

            initData = initData.split("||");

            newPos = new google.maps.LatLng(initData[0], initData[1]);

            $("#lat").html(initData[0]);
            $("#lon").html(initData[1]);
            $("#street-input").val(initData[2]);
            $("#city-input").val(initData[3]);
            $("#state-input").val(initData[4]);
            $("#zicode-input").val(initData[5]);
            $("#move-specification").val(initData[6]);

            mapOptions = {

                center: newPos,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP

            };

            $("#street-input").val(initData[2]);
            $("#city-input").val(initData[3]);
            $("#state-input").val(initData[4]);
            $("#zipcode-input").val(initData[5]);
            $("#move-specification").val(initData[6]);

        }

        var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);

        if(initData){

            marker = new google.maps.Marker({
                position: newPos,
                map: map,
                optimized: false,
                clickable: true,
                animation: google.maps.Animation.DROP,
                title: 'Departure address'
            });

            markers.push(marker);

            flag = true;

            map.setCenter(newPos);

        }

        google.maps.event.addListener(map, 'click', function(event) {

            $("#lat").html(event.latLng.lat());
            $("#lon").html(event.latLng.lng());

            if(flag){

                markers[0].setMap(null);
                markers = [];

            }

            marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                optimized: false,
                clickable: true,
                animation: google.maps.Animation.DROP,
                title: 'Departure address'
            });

            markers.push(marker);

            flag = true;
        });

        $("#set-current-location").on("click", function(){

            navigator.geolocation.getCurrentPosition(function(position){

                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;
                var latLong = new google.maps.LatLng(latitude, longitude);

                if(flag){

                    markers[0].setMap(null);
                    markers = [];

                }

                $("#lat").html(latLong.lat());
                $("#lon").html(latLong.lng());

                map.setCenter(latLong);

                marker = new google.maps.Marker({
                    position: latLong,
                    map: map,
                    optimized: false,
                    clickable: true,
                    animation: google.maps.Animation.DROP,
                    title: 'Departure address'
                });

                markers.push(marker);

                flag = true;

            }, function(error){

                app.pop.alert('Error: ' + error.message, 'Code: ' + error.code);

            }, {maximumAge:60000, timeout:10000, enableHighAccuracy:true});

        });

    },

    goBack: function(parameter){

        var historial = localStorage.getItem("anterior");
        var actual = localStorage.getItem("actual");
        var nuevoHistorial = "";
        var target;

        if(actual == "menuView"){

            $(".btn-menu-link").show();

        }

        if(historial != ""){

            historial = historial.split("-");

            var long = historial.length-1;
            target = historial[long];

            for(var i=1; i<long; i++){

                nuevoHistorial = nuevoHistorial + "-" + historial[i];

            }

        }

        if(!target){

            if(localStorage.getItem("usr")){

                app.setTypeView();

            }else{

                app.firstUserView();

            }

            navigator.app.exitApp();
            return true;

        }else{

            $(".nxt-btn").fadeOut();

            localStorage.setItem("anterior", nuevoHistorial);

            if(parameter){

                window['app'][target](parameter);

            }else{

                window['app'][target]();

            }

        }

    },
    
    pop: {
    
        alert: function(text, title){
            
            if(title){
            
                $(".alert-title").html(title);
            
            }else{
                
                $(".alert-title").html("Oops!");

            }
            
            $(".alert-content").html(text);
            $("#id-modal-alert-disp").modal("toggle");

        
        },

        preventLogOut: function(text){

            app.pop.alert(text, "Caution!");
            app.logOut();

        }
    
    },

    faceBook: {

        loginSucess: function(userData){

            facebookConnectPlugin.api( "me/?fields=id,email,first_name,last_name", ["email"],
                function (response) {

                    var name = response.first_name + " " + response.last_name;

                    app.signUp(name, "", response.email, "", true);

                    //app.pop.alert("Email: " + response.email + "\nFirst name: " +  response.first_name + "\nLast name: " + response.last_name);

                    //app.logIn(user, pass, true);
                },app.faceBook.loginError2);



            facebookConnectPlugin.logout(app.faceBook.logoutfacebook());

        },

        loginError: function(error){

            app.pop.alert(error.errorMessage);
            facebookConnectPlugin.logout(app.faceBook.logoutfacebook(), function () {alert("log out fail")});

        },

        logoutfacebook: function(){


            //alert("log out!");

        }

    },

    signUp: function(mail, password, fb){

        var url = $("#urlapp").val();

        $.ajax({

            url: url + 'signup_client',
            type:'GET',
            data:{'mail': mail, 'password': password, 'fb': fb},
            error: function(a,b,c){

               app.pop.alert(c, b);

            }

        }).done(function(data){

            if(data.status == "ok"){

                var device_id = localStorage.getItem("deviceId");
                localStorage.setItem("usr", data.user);

                if(device_id){

                    app.notification.deviceRegister(device_id)

                }

                $(".logo-place").html('<img src="img/logo.png" class="logo"/>');

                app.setTypeView();

            }else{

                app.pop.alert(data.status);

            }

        });

    },

    logIn: function(usr, pass){

        var url = $("#urlapp").val();

        $.ajax({

            url: url + 'log_client',
            type:'GET',
            data:{'usr': usr, 'pass': pass},
            error: function(a,b,c){

                app.pop.alert(c, b);

            }

        }).done(function(data){

            var device_id = localStorage.getItem("deviceId");

            if(data.status == "ok"){

                localStorage.setItem("usr", data.user);

                if(device_id){

                    app.notification.deviceRegister(device_id)

                }

                $(".logo-place").html('<img src="img/logo.png" class="logo"/>');

                app.setTypeView();

            }else{

                app.pop.alert(data.status);

            }

        });

    },

    logOut: function(){

        var usr = localStorage.getItem("usr");
        var url = $("#urlapp").val();

        localStorage.clear();

        facebookConnectPlugin.logout(app.faceBook.logoutfacebook());

        $.ajax({

            url: url + 'log_out',
            type: 'GET',
            data:{'usr': usr},
            error: function(){

                app.firstUserView();

            }

        }).done(function(){

            app.firstUserView();

        });

    }

};

app.initialize();
