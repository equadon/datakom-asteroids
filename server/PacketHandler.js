import LoginResponsePacket from 'packets/server/LoginResponsePacket';
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
                this.server.loggedInPlayers[id] = socket.player;
                console.log(id);
                console.log('Player ' + socket.player.id + ' has joined!');
            }
            // Send login response
            new LoginResponsePacket(isValid, socket.player.id).send(socket);
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    updateRequest(socket, data) {
        const request = new GameUpdateRequestPacket(data);
        let status = request.data;
        socket.player.update(status);
        let gameState = this.server.getState();
        console.log(status);
        new GameUpdateResponsePacket(gameState).send(socket);
    }

    playerInit(socket) {
        const gameState = this.server.getState();
        new GameUpdateResponsePacket(gameState).send(socket);
    }



}