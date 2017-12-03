import GameServer from 'GameServer'
import LoginResponsePacket from 'packets/server/LoginResponsePacket';
import UserUpdatePacket from 'packets/server/UserUpdatePacket';
import GameUpdateResponsePacket from 'packets/server/GameUpdateResponsePacket';
import GameUpdateRequestPacket from 'packets/client/GameUpdateRequestPacket';
import Player from 'universe/Player';

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

    get universe() {
        return this.server.universe;
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
                socket.player = this.universe.createPlayer(socket);
                console.log('Player ' + socket.player.id + ' has joined!');

                this.userUpdate(socket.player, 1);
                this.universe.addPlayer(socket.player);
            }

            // Send login response
            console.log(this.universe.getPlayers());
            new LoginResponsePacket(isValid, socket.player, this.universe.getPlayers()).send(socket);
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    gameUpdate(socket, data) {
        this.universe.updatePlayer(data);

        new GameUpdateResponsePacket({
            players: this.universe.getPlayers(),
            cows: []
        }).send(socket);
    }

    cowUpdate(socket, data) {
        this.universe.removeCow(data.id);
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