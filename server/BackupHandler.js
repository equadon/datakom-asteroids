export default
class BackupHandler {
    constructor(server, db) {
        this.server = server;
        this.db = db;
        this.startBackup();
    }

    startBackup() {
        let _this = this;
        this.timeout = setInterval(function() {
            console.log("Starting backup...");

            let players = _this.server.universe.getPlayers();
            let users = _this.db.collection('users');
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                let player_info = {x: player.x,
                    y: player.y,
                    angle: player.angle,
                    score: player.score};
                users.findOneAndUpdate({userid: player.id},
                    {$set: {player_info: player_info}});
            }
        }, 5000);
    }

    stopBackup() {
        clearInterval(this.timeout);
    }
}