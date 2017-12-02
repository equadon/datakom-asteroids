import GameServer from 'GameServer'
import LoginResponsePacket from 'packets/server/LoginResponsePacket';
import UserUpdatePacket from 'packets/server/UserUpdatePacket';
import GameUpdateResponsePacket from 'packets/server/GameUpdateResponsePacket';
import GameUpdateRequestPacket from 'packets/client/GameUpdateRequestPacket';
import Player from 'Player';

import LoginHandler from 'LoginHandler'

/**
 * Packet handler handles what to do with incoming packets.
 */

export default
class PacketHandler {
    constructor(server, db) {
        this.server = server;
        this.db = db;
        this.loginHandler = new LoginHandler(db);
    }

    /**
     * User requested to login.
     * @param socket Socket making the request
     * @param data Request data with username and password
     */
    loginRequest(socket, data) {
        this.loginHandler.login(data, (isValid, id) => {
            if (isValid) {
                // Create player 
                socket.player = new Player(this.server.lastPlayerID++, GameServer.randomInt(100, 400), GameServer.randomInt(100, 400), GameServer.randomInt(0, 359));
                console.log('Player ' + socket.player.id + ' has joined!');

                this.userUpdate(socket.player, 1);
                this.server.universe.addPlayer(socket.player);
            }

            // Send login response
            console.log(this.server.universe.getPlayers());
            new LoginResponsePacket(isValid, socket.player, this.server.universe.getPlayers()).send(socket);
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    gameUpdate(socket, data) {
        this.server.universe.updatePlayer(data);

        new GameUpdateResponsePacket({
            players: this.server.universe.getPlayers(),
            cows: []
        }).send(socket);
    }

    userUpdate(player, type) {
        const sockets = this.server.io.sockets.connected;

        for (let socketId of Object.keys(sockets)) {
            const s = sockets[socketId];

            if (s.player != undefined && s.player.id != player.id) {
                new UserUpdatePacket(player, type).send(s);
            }
        }
    }
}