import Packet from 'packets/Packet';

export default
class GameUpdateResponsePacket extends Packet {
    constructor(objects) {
        super('game-update', {
            objects
        });
    }
}