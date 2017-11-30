import LoginResponsePacket from 'packets/server/LoginResponsePacket';
import GameUpdateResponsePacket from 'packets/server/GameUpdateResponsePacket';
import GameUpdateRequestPacket from 'packets/client/GameUpdateRequestPacket';

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
        this.loginHandler.login(data, function (isValid, id) {
            if (isValid) {
                // Create player 
                socket.player = new Player(id, 0, 0, 0);
                this.server.loggedInPlayers[id] = socket.player;
                console.log('Player ' + socket.id + ' has joined!');
            }
            // Send login response
            new LoginResponsePacket(isValid, id).send(socket);
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    updateRequest(socket, data) {
        const request = new GameUpdateRequestPacket(data);
        status = request.data;
        console.log(status);
        player = socket.player.update(status);
        gameState = server.getState();
        new GameUpdateResponsePacket(gameState).send(socket);
    }

    playerInit(socket) {
        const gameState = this.server.getState();
        new GameUpdateResponsePacket(gameState).send(socket);
    }



}