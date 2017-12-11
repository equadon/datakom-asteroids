import Packet from 'packets/Packet';

export default
class PlanetCollisionPacket extends Packet {
    constructor(id, x, y, score) {
        super('planet-collision', {
            id: id,
            x: x,
            y: y,
            score: score
        });
    }
}