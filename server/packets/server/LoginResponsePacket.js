import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, id, players) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
            id: id,
            players: players
        });
    }
}