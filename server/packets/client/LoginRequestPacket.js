import Packet from 'packets/Packet'

export default
class LoginRequestPacket extends Packet {
    constructor(request) {
        super('login-request', request);

        this.valid = false;
        this.message = null;

        // TODO: Get login info from database
        if (request.username == 'admin' && request.password == '123') {
            this.valid = true;
        } else {
            this.message = 'Invalid user and/or pass.';
        }
    }
}