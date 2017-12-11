import LoginResponsePacket from 'packets/server/LoginResponsePacket';
import ClusterUpdatePacket from 'packets/server/ClusterUpdatePacket';
import GameUpdateResponsePacket from 'packets/server/GameUpdateResponsePacket';
import CowUpdatePacket from 'packets/server/CowUpdatePacket'
import ScoreUpdatePacket from 'packets/server/ScoreUpdatePacket'
import PlanetCollisionPacket from 'packets/server/PlanetCollisionPacket'

import Player from 'universe/Player';


/**
 * Packet handler handles what to do with incoming packets.
 */

export default
class PacketHandler {
    constructor(server, db, loginhandler) {
        this.server = server;
        this.db = db;
        this.loginHandler = loginhandler;
    }

    get universe() {
        return this.server.universe;
    }

    /**
     * User requested to login.
     * @param socket Socket making the request
     * @param data Request data with username and password
     */
    loginRequest(socket, data, onSuccess) {
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
            }
            // Send login response
            new LoginResponsePacket(
                isValid,
                socket.player
            ).send(socket);
            if (isValid) {
                onSuccess();
            }
        });
    }

    /**
     * 
     * @param request Request data with player position 
     */
    playerUpdate(socket, data) {
        const player = this.universe.updatePlayer(data);
        const objects = this.universe.getObjects(player);

        new GameUpdateResponsePacket(objects).send(socket);
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

    onPlanetCollision(socket, data) {
        if (socket.player != undefined) {
            console.log('planet collision');
            const [x, y] = this.universe.respawnPlayer(socket.player);
            socket.player.score = Math.max(socket.player.score - 5, 0);

            new PlanetCollisionPacket(socket.player.id, x, y, socket.player.score).send(socket);
        }
    }

    /**
     * Send updates to all clients where players are clustering.
     * @param clusters coordinates of clusters
     */
    clusterUpdate(clusters) {
        const packet = new ClusterUpdatePacket(clusters);

        this.server.io.emit(packet.name, packet.data);
    }
}