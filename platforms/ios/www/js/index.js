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

        window.addEventListener('orientationchange', app.cambioOrientacion);

        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'


    onDeviceReady: function() {

        $(".nxt-btn").fadeOut();

        document.addEventListener( "backbutton", function(){

            app.goBack();

        }, false );

        $(".btn-back").on("click",app.goBack);

        if(localStorage.usr){

            if(localStorage.actual){
                
                $(".btn-back").fadeIn();
                window['app'][localStorage.actual]();

            }else{

                app.menuView();

            }

        }else{

            localStorage.anterior = "";
            app.firstUserView();

        }
        
    },
    
    firstUserView: function(){
    
        $("#principal").html('<div class="bg-movers">' +
            '<div style="text-align: center">' +
                '<img src="img/logo.png" height="200px"/>' +
            '</div>' +
            '<span class="moving-made-easy">moving made easy™</span>' +
            '<div class="footer-test btn-group">' +
                '<a class="btn btn-first-view login">Log in</a>' +
                '<a class="btn btn-first-view signup">Sign Up</a>' +
            '</div>' +
        '</div>');
        
        $(function(){    //init

            localStorage.clear();
            localStorage.anterior = '';
            localStorage.actual = "firstUserView";
            $(".banner").hide();
            $(".btn-back").fadeOut();
            $(".footer").hide();
          
        });
        
        $(".btn-first-view").on("click", function(){
                     
            localStorage.anterior = localStorage.anterior + "-firstUserView";
            $(".footer").show();
            $(".banner").show();
                     
        });
        
        $(".login").on("click", app.loginView);
        
        $(".signup").on("click", app.signUpView);
    
    },

    loginView: function(){

        $("#principal").html('<div class="login-view" style="background-color: #3B5998; max-height: 50px;">' +
            '<a class="btn btn-primary nxt-btn btn-fb">Log in with Facebook</a>' +
        '</div>' +
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 first-inputs" style="text-align: center;">' +
                    '<label class="fancy-label" style="margin-top: 15px; margin-bottom: 10px;">or with mail</label>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="usrname" type="email" class="form-control" placeholder="Email" style="margin-bottom: 15px;"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="password" type="password" class="form-control" placeholder="Password"/>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn login">Log in</a>' +
        '<label class="fancy-label f-pass">Forgot your password?</label>');

        $(function(){    //init

            localStorage.actual = "loginView";
            $(".btn-back").fadeIn();

            $('#usrname').css({background: 'url(img/Icons/user.png) no-repeat left center'});
            $('#password').css({background: 'url(img/Icons/password.png) no-repeat left center'});
            $('#usrname').css({'background-size': '48px'});
            $('#password').css({'background-size': '38px'});

        });

        $(".f-pass").on("click", function(){

            var url = $("#urlapp").val();
            url = url.split("/app_request/");
            url = url[0];

            window.open(url + "/user/password/reset/", "_system");

        });

        $(".login").on("click", function(){

            var usr = $("#usrname").val();
            var pass = $("#password").val();
            var url = $("#urlapp").val();

            $.ajax({

                url: url + 'log_client',
                type:'GET',
                data:{'usr': usr, 'pass': pass},
                error: function(a,b,c){

                    app.pop.alert(c, b);

                }

            }).done(function(data){

                if(data.status == "ok"){

                    localStorage.usr = data.user;
                    app.menuView();

                }else{

                    app.pop.alert(data.status);

                }

            });

        });

    },
    
    signUpView: function(){
    
        $("#principal").html('<div class="login-view" style="background-color: #3B5998; max-height: 50px;">' +
            '<a class="btn btn-primary nxt-btn btn-fb">Sign up with Facebook</a>' +
        '</div>' +
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 first-inputs" style="text-align: center;">' +
                    '<label class="fancy-label" style="margin-top: 15px; margin-bottom: 10px;">or with mail</label>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="name" type="text" class="form-control" placeholder="Full name" style="margin-bottom: 15px;"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="phone" type="text" class="form-control" placeholder="Phone number" style="margin-bottom: 15px;"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="mail" type="email" class="form-control" placeholder="Email" style="margin-bottom: 15px;"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="password" type="password" class="form-control" placeholder="Password" style="margin-bottom: 15px;"/>' +
                    '</div>' +
                    '<div class="form-group" style="background-color: #FFFFFF"> ' +
                        '<input id="confirmpassword" type="password" class="form-control" placeholder="Confirm password"/>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn signup">Sign up</a>');
        
        $(function(){    //init
          
            localStorage.actual = "signUpView";
            $(".btn-back").fadeIn();

            $('#name').css({background: 'url(img/Icons/user.png) no-repeat left center'});
            $('#mail').css({background: 'url(img/Icons/Email.png) no-repeat left center'});
            $('#password, #confirmpassword').css({background: 'url(img/Icons/password.png) no-repeat left center'});
            $('.first-inputs input').css({'background-size': '48px'});
            $('#password, #confirmpassword').css({'background-size': '38px'});
          
         });
        
        $(".signup").on("click", function(){
                       
            var url = $("#urlapp").val();
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
                       
                var name = $("#name").val();
                var phone = $("#phone").val();
                var mail = $("#mail").val();
                var password = $("#password").val();

                            
                $.ajax({

                    url: url + 'signup_client',
                    type:'GET',
                    data:{'name': name, 'phone': phone, 'mail': mail, 'password': password},
                    error: function(a,b,c){
                                   
                       app.pop.alert(c, b);
                                   
                    }
                                   
                }).done(function(data){
                                           
                    if(data.status == "ok"){
                                           
                        localStorage.usr = data.user;
                        app.menuView();
                                           
                    }else{
                                           
                        app.pop.alert(data.status);
                                           
                    }
                                           
                });
                       
            }
                            
        });
    
    
    },

    menuView: function(){

        $("#principal").html('<div class="container">' +
                '<div class="row">' +
                    '<div class="col-xs-12 btn-menu">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu make-move">Make a move</a>' +
                    '</div>' +
                    '<div class="col-xs-12 btn-menu">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu history">Move history</a>' +
                    '</div>' +
                    '<div class="col-xs-12 btn-menu">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu rate">Rate</a>' +
                    '</div>' +
                    '<div class="col-xs-12 btn-menu">' +
                        '<a class="btn btn-lg btn-primary btn-block btn-menu logout">Log out</a>' +
                    '</div>' +
                '</div>' +
            '</div>');

        $(function(){    //init

            localStorage.removeItem("actual");
            localStorage.anterior = "";
            $(".btn-back").fadeOut();

        });

        $(".btn-menu").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-menuView";
            $(".btn-back").fadeIn();

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

        $(".logout").on("click", function(){

            app.logOut();

        });

    },

    moveHistoryView: function(){

        var user = localStorage.usr;
        var date_aux;
        var time_aux;
        var url = $("#urlapp").val();

        $.ajax({

            url:url + 'history',
            type: 'GET',
            data: { user: user }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Moving History.</div>' +
            '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
                                    '<div class="col-xs-12 status">' +
                                        '<a class="btn btn-primary btn-block move" id="' + data[i].pk + '">CHECK!' +
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

            $(function(){ //init

                localStorage.actual = "moveHistoryView";

            });

            $(".move").on("click", function(){

                var iden = $(this).prop("id");

                localStorage.anterior = localStorage.anterior + "-moveHistoryView";
                app.moveDetailView(iden);

            });

        });

    },

    moveDetailView: function(move){

        $("#principal").html('<div class="container">' +
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
                                '<b>Total Price: </b>' +
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

                localStorage.actual = "moveDetailView";

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

        var user = localStorage.usr;
        var date_aux;
        var time_aux;
        var url = $("#urlapp").val();

        $.ajax({

            url:url + 'rate_history',
            type: 'GET',
            data: { user: user }

        }).done(function(data){

            $("#principal").html('<div class="background-fade-test"></div>' +
            '<div class="sub-banner">Rate The Moving.</div>' +
            '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
                                        '<a class="btn btn-primary btn-block move" id="' + data[i].pk + '">Rate movers!' +
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

            $(function(){ //init

                localStorage.actual = "rateMoverView";

            });

            $(".move").on("click", function(){

                var iden = $(this).prop("id");

                localStorage.anterior = localStorage.anterior + "-rateMoverHistoryView";
                app.moverListForRate(iden);

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
            '<div class="sub-banner">Movers In This Move!</div>' +
            '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
        '<div class="sub-banner">Move Detail.</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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

                    localStorage.rate = "1";

                    break;
                case '2':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-empty.png");
                    $("#star-4").prop("src","img/star-empty.png");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.rate = "2";

                    break;
                case '3':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-empty.png");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.rate = "3";

                    break;
                case '4':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-full.jpg");
                    $("#star-5").prop("src","img/star-empty.png");

                    localStorage.rate = "4";

                    break;
                case '5':
                    $("#star-1").prop("src","img/star-full.jpg");
                    $("#star-2").prop("src","img/star-full.jpg");
                    $("#star-3").prop("src","img/star-full.jpg");
                    $("#star-4").prop("src","img/star-full.jpg");
                    $("#star-5").prop("src","img/star-full.jpg");

                    localStorage.rate = "5";

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

                if(localStorage.rate){

                    setSart(localStorage.rate);

                }else{

                    localStorage.rate = "2";

                }

                localStorage.actual = "moveDetailView";

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

                var rateScore = localStorage.rate;

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
        '<div class="sub-banner">How Can We Help You?</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="load" class="btn btn-lg btn-primary btn-type-view btn-block load">Load' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="unload" class="btn btn-lg btn-primary btn-type-view btn-block unload">Unload' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="full" class="btn btn-lg btn-primary btn-type-view btn-block full">Full Move' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.actual = "setTypeView";

            if(localStorage.type){

                var type = localStorage.type;

                $("#"+type).removeClass("btn-primary");
                $("#"+type).addClass("btn-current");

            }
        });

        $(".btn-type-view").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-setTypeView";
            localStorage.type = $(this).prop("id");

        });

        $(".load, .unload").on("click", app.setMovingSizeView);

        $(".full").on("click", app.needATruckView);

    },

    needATruckView: function(){

        $("#principal").html('<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a class="btn btn-lg btn-primary btn-block btn-truck yes">i need a truck</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a class="btn btn-lg btn-primary btn-block btn-truck no">i do not need a truck</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.actual = "needATruckView";

            if(localStorage.truck){

                $(".yes").removeClass("btn-primary");
                $(".yes").addClass("btn-current");

            }else{

                $(".no").removeClass("btn-primary");
                $(".no").addClass("btn-current");

            }
        });

        $(".btn-truck").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-needATruckView";

        });

        $(".no").on("click", function(){

            localStorage.removeItem("truck");

            app.setMovingSizeView();

        });

        $(".yes").on("click", app.setTruckSizeView);

    },

    setTruckSizeView: function(){

        $("#principal").html('<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="10ft" class="btn btn-lg btn-primary btn-block btn-truck-size">10ft' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="14ft" class="btn btn-lg btn-primary btn-block btn-truck-size">14ft' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="17ft" class="btn btn-lg btn-primary btn-block btn-truck-size">17ft' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="20ft" class="btn btn-lg btn-primary btn-block btn-truck-size">20ft' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="24ft" class="btn btn-lg btn-primary btn-block btn-truck-size">24ft+' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.actual = "setTruckSizeView";

            if(localStorage.truck){

                var truck = localStorage.truck;
                truck = truck.split("+");
                truck = truck[0];

                $("#"+truck).removeClass("btn-primary");
                $("#"+truck).addClass("btn-current");

            }
        });

        $(".btn-truck-size").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-setTruckSizeView";

            if($(this).prop("id") == "24ft"){

                localStorage.truck = "24ft+";

            }else{

                localStorage.truck = $(this).prop("id");

            }

            app.setMovingSizeView();

        });

    },

    setMovingSizeView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">What\'s Your Moving Size?</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="studio" class="btn btn-lg btn-primary btn-block btn-mov-size">studio' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="1-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-size">1 bedroom apartment' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="2-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-size">2 bedroom apartment' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="3-bedroom-apartment" class="btn btn-lg btn-primary btn-block btn-mov-size">3 bedroom apartment' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="2-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-size">2 bedroom house' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="3-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-size">3 bedroom house' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="4-bedroom-house" class="btn btn-lg btn-primary btn-block btn-mov-size">4 bedroom house' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="storage" class="btn btn-lg btn-primary btn-block btn-mov-size">storage' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="bussines-and-office" class="btn btn-lg btn-primary btn-block btn-mov-size">bussines and office' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
                '<div class="col-xs-12 btn-menu">' +
                    '<a id="other" class="btn btn-lg btn-primary btn-block btn-mov-size">other' +
                        '<img src="img/Icons/WhiteArrowRight.png" height="22px" class="pull-right"/>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>');

        $(function(){      //init

            localStorage.actual = "setMovingSizeView";

            if(localStorage.size){

                var size = localStorage.size;

                $("#"+size).removeClass("btn-primary");
                $("#"+size).addClass("btn-current");

            }
        });

        $(".btn-mov-size").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-setMovingSizeView";
            localStorage.size = $(this).prop("id");

            var type = localStorage.type;

            if(type == "full" || type == "load"){

                app.setDepartureView();

            }else{

                app.setDate();

            }

        });
    },

    setDepartureView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Where Are You Moving From?</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
                            '<input type="text"  placeholder="City" class="address-input" id="city-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="text" placeholder="State" class="address-input" id="state-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input type="number" placeholder="Zip code" class="address-input" id="zipcode-input"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="move-specification">Any additional comments or directions we need to know about this location?</label>' +
                            '<textarea class="address-input" id="move-specification" rows="4"></textarea>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary btn-block nxt-btn">Next</a>');

        $(function(){   //init

            $(".nxt-btn").fadeIn();

            localStorage.actual = "setDepartureView";

            var initData = localStorage.departure;

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

                localStorage.departure = departure;

                localStorage.anterior = localStorage.anterior + "-setDepartureView";

                $(".nxt-btn").fadeOut();

                app.setDate();

            }

        });

    },

    setArrivalView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Where Are You Moving To?</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
                            '<label for="move-specification">Any additional comments or directions we need to know about this location?</label>' +
                            '<textarea class="address-input" id="move-specification" rows="4"></textarea>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn">Next</a>');

        $(function(){   //init

            $(".nxt-btn").fadeIn();

            localStorage.actual = "setArrivalView";

            var initData = localStorage.arrival;

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

                localStorage.arrival = arrival;

                localStorage.anterior = localStorage.anterior + "-setArrivalView";

                $(".nxt-btn").fadeOut();

                app.resumeView();

            }
        });
    },

    setDate: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">You\'re Almost Done...</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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

            localStorage.actual = "setDate";

            $("#date").val(localStorage.date);
            $("#time").val(localStorage.time);
            $("#est-hou").val(localStorage.hours);
            $("#size-crew").val(localStorage.crew);

            if($('#date').val() != ''){

                $('#date').css({background: 'none'});

            }else{

                $('#date').css({background: 'url(img/DATE.png) no-repeat left center'});
                $('#date').css({'background-size': '48px'});

            }

            if($('#time').val() != ''){

                $('#time').css({background: 'none'});

            }else{

                $('#time').css({background: 'url(img/DATE.png) no-repeat left center'});
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


                var type = localStorage.type;

                localStorage.anterior = localStorage.anterior + "-setDate";

                localStorage.date = $("#date").val();

                localStorage.time = $("#time").val();

                localStorage.hours = esthou;

                localStorage.crew = estcrew;

                if(type == "load"){

                    app.resumeView();

                }else{

                    app.setArrivalView();

                }
            }
        });
    },

    resumeView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Double Check Your Move.</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
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
                '<div class="form-group" align="center" style="text-align: center;">' +
                    '<label class="fancy-label">Your Estimated Price.</label>' +
                '</div>' +
                '<div class="col-xs-12">' +
                    '<div class="panel panel-default">' +
                        '<div class="panel-body">' +
                            '<p>' +
                                '<b>Travel Charge: </b>' +
                                '$<span class="travle"></span>' +
                            '</p>' +
                            '<p>' +
                                '<b>Est. moving price: </b>' +
                                '$<span class="estimate"></span>' +
                            '</p>' +
                            '<div class="truck-block">' +
                                '<p>' +
                                    '<b>Truck: </b>' +
                                    '$<span class="truck"></span>' +
                                '</p>' +
                            '</div>' +
                            '<p>' +
                                '<b>Total fee approx.: </b>' +
                                '$<span class="total"></span>' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-block nxt-btn">Next</a>');

        var disp = {

            load: function(){

                var dep_add = localStorage.departure;

                dep_add = dep_add.split("||");
                dep_add = dep_add[2];

                $(".departure").html(dep_add);

            },

            unload:function(){

                var arr_add= localStorage.arrival;

                arr_add = arr_add.split("||");
                arr_add = arr_add[2];

                $(".arrival").html(arr_add);

            }
        };

        $(function(){   //init

            var type = localStorage.type;
            var date = localStorage.date;
            var time = localStorage.time;
            var hours = localStorage.hours;
            var size = localStorage.size;
            var total, truck;
            var crew = parseInt(localStorage.crew);

            var time_full = date + " at " + time;

            localStorage.actual = "resumeView";

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

            if(localStorage.truck){

                $(".truck").html("190");
                truck = 190;

            }else{

                $(".truck-block").fadeOut();
                $(".truck").html("0");
                truck = 0;

            }

            var travel = hours * 20;
            var estimate = crew * hours * 35
            total = travel + estimate + truck;

            $(".travle").html(travel);
            $(".estimate").html(estimate);
            $(".total").html(total);

        });

        $(".nxt-btn").on("click", function(){

            localStorage.anterior = localStorage.anterior + "-resumeView";

            app.movingPaymentView();

        });

        $(".back").on("click", function(){

            app.goBack();

        });
    },

    successView: function(){

        $("#principal").html('<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div class="alert alert-success">' +
                        '<p>You have requested your move successfully!</p>' +
                        '<p>Thanks for choose us for your move.</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div style="margin-top: 20px; margin-bottom: 20px;">' +
            '<a class="btn btn-primary nxt-btn finish">Finish</a>' +
        '</div>');

        $(function(){  //init

            var user = localStorage.usr;

            localStorage.clear();

            localStorage.usr = user;

        });

        $(".finish").on("click", app.menuView);

    },

    movingPaymentView: function(){

        $("#principal").html('<div class="background-fade-test"></div>' +
        '<div class="sub-banner">Enter Payment Info.</div>' +
        '<div style="z-index: -1; margin-top: 25px; background-color: #29180F;" class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12">' +
                    '<div class="movingPaymentP">' +
                        '<div class="form-group">' +
                            '<input placeholder="Card number" class="address-input" type="number" id="cnumber"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input placeholder="MM/YYYY" class="address-input" type="text" id="tdcdate"/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<input placeholder="CVC" class="address-input" type="password" id="ccv"/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<a class="btn btn-primary nxt-btn pay">Next</a>');

        localStorage.actual = "movingPaymentView";

        function checkDate(){

            var date = new Date();
            var inputdate = $("#tdcdate").val();
            inputdate = inputdate.split("/");
            var month = parseInt(inputdate[0]);
            var year = parseInt(inputdate[1]);
            var currentYear = parseInt(date.getFullYear());
            var currentMonth = parseInt(date.getMonth());

            if(year < currentYear || (year == currentYear && month < currentMonth)){

                return false;

            }else{

                return  true;

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
            var inputdate = $("#tdcdate").val();
            inputdate = inputdate.split("/");
            var two = parseInt(inputdate[0]);
            var three = parseInt(inputdate[1]);
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
                var usr = localStorage.usr;
                var type = localStorage.type;
                var date = localStorage.date;
                var time = localStorage.time;
                var size = localStorage.size;
                var hours = localStorage.hours;
                var crew = localStorage.crew;
                var url = $("#urlapp").val();

                size = size.replace("-"," ");

                if(localStorage.departure){

                    departure = localStorage.departure;

                }else{

                    departure = '';

                }

                if(localStorage.arrival){

                    arrival = localStorage.arrival;

                }else{

                    arrival = '';

                }

                if(localStorage.truck){

                    truck = localStorage.truck;

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

                            localStorage.anterior = localStorage.anterior + "-movingPaymentView";

                            app.successView();

                        }else{

                            app.pop.alert(data.status);

                        }

                    }else{

                        app.pop.preventLogOut(data.status);

                    }

                });

            }

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

            initData = localStorage.departure;

        }else{

            initData = localStorage.arrival;

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

        var historial = localStorage.anterior;
        var nuevoHistorial = "";
        var target;

        if(historial != ""){

            historial = historial.split("-");

            var long = historial.length-1;
            target = historial[long];

            for(var i=1; i<long; i++){

                nuevoHistorial = nuevoHistorial + "-" + historial[i];

            }

        }

        if(!target){

            if(localStorage.usr){

                app.menuView();

            }else{

                app.firstUserView();

            }

            navigator.app.exitApp();
            return true;

        }else{

            $(".nxt-btn").fadeOut();

            localStorage.anterior = nuevoHistorial;

            if(parameter){

                window['app'][target](parameter);

            }else{

                window['app'][target]();

            }

        }

    },
    
    pop: {
    
        alert: function(text, tittle){
            
            if(tittle){
            
                $(".alert-tittle").html(tittle);
            
            }else{
                
                $(".alert-tittle").html("Alert!");

            }
            
            $(".alert-content").html(text);
            $("#id-modal-alert-disp").modal("toggle");

        
        },

        preventLogOut: function(text){

            app.pop.alert(text, "Caution!");
            app.logOut();

        }
    
    },

    logOut: function(){

        var usr = localStorage.usr;
        var url = $("#urlapp").val();

        localStorage.clear();

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
