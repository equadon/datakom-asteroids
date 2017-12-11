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
            vel: player ? player.velocity : null,
            acc: player ? player.acceleration : null,
            aVel: player ? player.angularVelocity : null,
            aAcc: player ? player.angularAcceleration : null
        });
    }
}