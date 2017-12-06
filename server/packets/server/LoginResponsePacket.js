import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, player, players, cows) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle,
            velocity: player.velocity,
            acceleration: player.acceleration,
            angularVelocity: player.angularVelocity,
            angularAcceleration: player.angularAcceleration,
            players: players,
            cows: cows
        });
    }
}