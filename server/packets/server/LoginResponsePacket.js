import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, player) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
            id: player ? player.id : null,
            x: player ? player.x : null,
            y: player ? player.y : null,
            angle: player ? player.angle : null,
            velocity: player ? player.velocity : null,
            acceleration: player ? player.acceleration : null,
            angularVelocity: player ? player.angularVelocity : null,
            angularAcceleration: player ? player.angularAcceleration : null
        });
    }
}