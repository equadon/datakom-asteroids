import Game from 'Game';
import GameClient from 'network/GameClient';



let game = new Game();
let client = new GameClient();


$(document).ready(function() {

    client.on('login-response', (obj) => {
        onLoginResponse(obj)
    });
    //Hide divs which should not be shown on the start screen before login
    $("#main").hide();
    $("#cover-box").hide();
    $(".milk-bottle").hide();  //Loading icon
    $("#failed-login").hide();


    //When the login button is pressed
    $("button").click(function(event){
        $("#failed-login").hide();
        $(".milk-bottle").show();

        $("#cover-box").show();    //Shown to cover up the space by the login-box, otherwise the game screen doesnt show right.
        $("#success-login").hide(); //We don´t want to show the "sucessfull-login" yet
        $(".login-box").hide();    //Hide the loginbox after we've clicked "login"

        var username = $('#username').val();
        var password = $('#password').val();
 
        event.preventDefault();

        showGame(); //Effect so that we scroll down

        setTimeout(function() { $(".milk-bottle").hide();  }, 4000);
        setTimeout(function() {game.client.login(username, password); }, 4500);

    });
});

function onLoginResponse(login) {
    if (login.success) {
        console.log('MAIN: Login successful!');
        $("#main").show();  //display the game-div. Called main when using phaser
        setTimeout(function() {   game.start(login); }, 1500);
        $("#success-login").show();   //Show the "successful login"-cow
    } else {
        console.log('Login failed: ' + login.message);
        $(".login-box").show();
        $("#failed-login").show();
        $("#cover-box").hide();
    }
};

function showGame() {
    window.scroll({
        top: 2800,
        left: 0,
        behavior: 'smooth'
    });
    
};

