import Packet from 'packets/Packet';

export default
class CowUpdatePacket extends Packet {
    constructor(cow, add) {
        super('cow-updated', {
            id: cow.id,
            x: cow.x,
            y: cow.y,
            status: add ? 'add' : 'remove'
        });
    }
}