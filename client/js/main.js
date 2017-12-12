import Game from 'Game';
import GameClient from 'network/GameClient';



let game = new Game();
let client = new GameClient();
//game.start();

$(document).ready(function(){
    $("#hide").click(function(){
        $("#main").hide();
    });
    $("#show").click(function(){
        $("p").show();
    });
});



$(document).ready(function() {

    client.on('login-response', (obj) => {
        onLoginResponse(obj)
    });

    $("#main").hide();
    $("#empty-box").hide();
    $(".milk-bottle").hide();

    $("button").click(function(event){
        $(".milk-bottle").show();

        $("#empty-box").show();
        $(".login-box").hide();
        //$(".login-box").hide();
        var username = $('#username').val();
        var password = $('#password').val();
 
        event.preventDefault();
        //game.client.login(username, password); //Send login to client
        showGame();

        //game.start();
        setTimeout(function() { $(".milk-bottle").hide();  }, 4000);
        // setTimeout(function() { $("#main").show();  }, 4000);
        // setTimeout(function() {   game.start(); }, 4000);
        setTimeout(function() {game.client.login(username, password); }, 4500);





        /*setTimeout(function() { $(".milk-bottle").hide();  }, 3500);
        setTimeout(function() { $("#main").show();  }, 4000);
        setTimeout(function() {   game.start(); }, 4500);


        setTimeout(function() {game.client.login(username, password); }, 6000);*/


    });
});

function onLoginResponse(login) {
    if (login.success) {
        console.log('MAIN: Login successful!');
        $("#main").show();
        setTimeout(function() {   game.start(login); }, 1000);
    } else {
        console.log('Login failed: ' + login.message);
        $(".login-box").show();
    }
};

function showGame() {

    //document.getElementById("gameContainer").style.display = "block";
    window.scroll({
        top: 2800,
        left: 0,
        behavior: 'smooth'
    });

    //setTimeout(function() {  new Game().start(); }, 10);

};

