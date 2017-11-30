import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, id) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
            id: id
        });
    }
}