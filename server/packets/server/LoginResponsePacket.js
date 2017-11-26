import Packet from 'packets/Packet'

export default
class LoginResponsePacket extends Packet {
    constructor(request) {
        super('login-response', {
            success: request.valid,
            message: request.message
        });
    }
}