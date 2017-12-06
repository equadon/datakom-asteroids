import Packet from 'packets/Packet';

export default
class UserUpdatePacket extends Packet {
    constructor(player, type) {
        super('user-update', {
            type: type,
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle
        });
    }
}