import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, player, players) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle,
            players: players
        });
    }
}