import Game from 'Game';



//let game = new Game();
new Game().start();

$(document).ready(function(){
    $("#hide").click(function(){
        $("#main").hide();
    });
    $("#show").click(function(){
        $("p").show();
    });
});

/*$(document).ready(function(){
    $("#main").hide();
    $("button").click(function(){
        new Game().start();
        $("#main").show(1000);

    });
});*/


$(document).ready(function() {
    $("button").click(function(event){
        //alert($('#username').val());
        var username = $('#username').val();
        var password = $('#password').val();
 
        event.preventDefault();
        //this.client.login(username, password); //Send login to client

        showGame();
    });
});

function showGame() {

    //document.getElementById("gameContainer").style.display = "block";
    window.scroll({
        top: 2500,
        left: 0,
        behavior: 'smooth'
    });

    //setTimeout(function() {  new Game().start(); }, 10);

};

