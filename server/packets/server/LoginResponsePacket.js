import Packet from 'packets/Packet'

export default
class LoginResponsePacket extends Packet {
    constructor(isValid) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password"
        });
    }
}