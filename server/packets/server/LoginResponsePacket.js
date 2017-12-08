import Packet from 'packets/Packet';

export default
class LoginResponsePacket extends Packet {
    constructor(isValid, player, players, cows) {
        super('login-response', {
            success: isValid,
            message: isValid ? null : "Invalid password",
<<<<<<< HEAD
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
=======
            id: player ? player.id : null,
            x: player ? player.x : null,
            y: player ? player.y : null,
            angle: player ? player.angle : null,
            velocity: player ? player.velocity : null,
            acceleration: player ? player.acceleration : null,
            angularVelocity: player ? player.angularVelocity : null,
            angularAcceleration: player ? player.angularAcceleration : null,
            players: player ? players : null
>>>>>>> server/db
        });
    }
}