import GameServer from 'GameServer'
import WebServer from 'WebServer'
import Database from 'Database'

require('../node_modules/dotenv').config();

// Start web server
const web = new WebServer();

var database = new Database();

database.connect(function (err, db) {
    if (err) {
        throw err;
    } else {
        // Start game server
        const game = new GameServer(web, db);
        web.start(process.env.COWS_PORT || process.env.PORT);
    }
});