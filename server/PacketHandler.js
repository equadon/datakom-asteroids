import LoginResponsePacket from 'packets/server/LoginResponsePacket';
import UserUpdatePacket from 'packets/server/UserUpdatePacket';
import GameUpdateResponsePacket from 'packets/server/GameUpdateResponsePacket';
import CowUpdatePacket from 'packets/server/CowUpdatePacket'
import ScoreUpdatePacket from 'packets/server/ScoreUpdatePacket'

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
        this.loginHandler.login(data, (isValid, user_data) => {
            if (isValid) {
                let id = user_data.id;
                if (user_data.info) {
                    let info = user_data.info;
                    // Create player
                    socket.player = this.universe.createPlayer(socket, id, info.x, info.y, info.angle, info.score);
                } else {
                    socket.player = this.universe.createPlayer(socket, id);
                }
                console.log('Player ' + socket.player.id + ' has joined!');

                this.userUpdate(socket, 'connect');
            }

            // Send login response
            new LoginResponsePacket(isValid, socket.player, this.universe.getPlayers(), this.universe.getCows()).send(socket);
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

    onCowUpdate(socket, data) {
        let cow = this.universe.removeCow(data.id);

        if (cow != undefined) {
            const packet = new CowUpdatePacket({id: cow.id}, false);

            this.server.io.emit(packet.name, packet.data);

            // Update score for player that was first to remove the cow
            socket.player.score += cow.score;
            new ScoreUpdatePacket(socket.player).send(socket);
        }
    }

    sendCowUpdate(cow) {
        const packet = new CowUpdatePacket(cow, true);
        this.server.io.emit(packet.name, packet.data);

        console.log(`spawned cow (id=${cow.id})`);
    }

    userUpdate(socket, type) {
        if (type === 'disconnect') {
            this.loginHandler.logout(socket.player, function() {
                new UserUpdatePacket(socket.player, type).broadcast(socket);
            });
        } else {
            new UserUpdatePacket(socket.player, type).broadcast(socket);
        }
    }
}