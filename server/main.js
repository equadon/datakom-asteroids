import GameServer from 'GameServer'
import WebServer from 'WebServer'

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function (err, db) {
    if (err) {
        throw err;
    } else {
        // Start game server
        const game = new GameServer(db);
        game.start(3000);

        // Start web server
        const web = new WebServer();
        web.start(8080);
    }
});
