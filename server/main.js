import GameServer from 'GameServer'
import WebServer from 'WebServer'

// Start game server
const game = new GameServer();
game.start(3000);

// Start web server
const web = new WebServer();
web.start(8080);
