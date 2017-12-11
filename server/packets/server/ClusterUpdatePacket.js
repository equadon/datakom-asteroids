import Packet from 'packets/Packet';

export default
class ClusterUpdatePacket extends Packet {
    constructor(clusters) {
        super('cluster-update', {
            clusters: clusters
        });
    }
}