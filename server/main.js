import GameServer from 'GameServer'
import WebServer from 'WebServer'
import Database from 'Database'


var database = new Database();

database.connect(function (err, db) {
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
