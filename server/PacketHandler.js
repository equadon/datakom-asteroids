import LoginRequestPacket from 'packets/client/LoginRequestPacket'

import LoginResponsePacket from 'packets/server/LoginResponsePacket'


/**
 * Packet handler handles what to do with incoming packets.
 */
export default
class PacketHandler {
    constructor(server) {
        this.server = server;
    }

    /**
     * User requested to login.
     * @param request Request data with username and password
     */
    loginRequest(socket, data) {
        const request = new LoginRequestPacket(data);

        if (request.valid) {
            // TODO: Keep track of logged in users
        }

        // Send login response
        new LoginResponsePacket(request).send(socket);
    }
}