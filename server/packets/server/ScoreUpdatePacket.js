import Packet from 'packets/Packet';

export default
class ScoreUpdatePacket extends Packet {
    constructor(player) {
        super('score-update', {
            id: player.id,
            score: player.score
        });
    }
}