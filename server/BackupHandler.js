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

            let players = _this.server.universe.players;
            let users = _this.db.collection('users');
            for (let player_key in players) {
                let db_id = players[player_key].dbId;
                let player = players[player_key].data;
                let player_info = {x: player.x,
                    y: player.y,
                    angle: player.angle,
                    score: player.score};
                console.log(player_info);
                console.log(db_id);
                users.findOneAndUpdate({userid: db_id},
                    {$set: {player_info: player_info}});
            }
        }, 5000);
    }

    stopBackup() {
        clearInterval(this.timeout);
    }
}