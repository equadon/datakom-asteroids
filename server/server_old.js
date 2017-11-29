var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.lastPlayerID = 0;

io.on('connection', function (socket) {

    socket.on('newplayer', function (data) {

        //Send out all other players positions to client
        players = getAllPlayers();
        socket.emit('allplayers', players);

        //Add the new player
        socket.player = {
            id: server.lastPlayerID++,
            x: data.x,
            y: data.y,
            angle: data.angle
        };

        //Send id client
        socket.emit('newplayer', socket.player);
        console.log('Player ' + socket.player.id + ' has joined!')

        //Broadcast to other that a new player has joined
        console.log('Sending out new player...');
        socket.broadcast.emit('addplayer', socket.player);

        socket.on('move', function (data) {
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.angle = data.angle;
        });

        socket.on('update', function () {

            socket.emit('update', getAllPlayers());
        });

        socket.on('disconnect', function () {
            io.emit('remove', socket.player.id);
            console.log('Player ' + socket.player.id + ' has left');
        });

    });

    socket.on('test', function () {
        console.log('test received');
    });

});

function sendUpdate(socket) {

}

function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}