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
                socket.player = new Player(this.server.lastPlayerID++, 0, 0, 0);
                console.log('Player ' + socket.player.id + ' has joined!');

                this.userUpdate(socket.player, 1);
            }

            // Send login response
            new LoginResponsePacket(isValid, socket.player.id, this.server.getPlayers()).send(socket);
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    updateRequest(socket, data) {
    }

    userUpdate(player, type) {
        const sockets = this.server.io.sockets.connected;

        for (let socketId of Object.keys(sockets)) {
            const s = sockets[socketId];

            if (s.player.id != player.id) {
                new UserUpdatePacket(player, type).send(s);
            }
        }
    }
}