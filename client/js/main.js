import Game from 'Game';



let game = new Game();
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
        setTimeout(function() { $(".milk-bottle").hide();  }, 3500);
        setTimeout(function() { $("#main").show();  }, 4000);
        setTimeout(function() {   game.start(); }, 4500);


        setTimeout(function() {game.client.login(username, password); }, 6000);
    });
});

function showGame() {

    //document.getElementById("gameContainer").style.display = "block";
    window.scroll({
        top: 2800,
        left: 0,
        behavior: 'smooth'
    });

    //setTimeout(function() {  new Game().start(); }, 10);

};

