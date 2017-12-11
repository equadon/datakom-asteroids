export default
class KMeans {
    constructor(centroids) {
        this.centroids = centroids || [];

        this.distance = (v1, v2) => {
            let total = 0;
            for (let i = 0; i < v1.length; i++) {
                total += Math.pow(v2[i] - v1[i], 2);
            }
            return Math.sqrt(total);
        };
    }

    randomCentroids(points, k) {
        let centroids = points.slice(0); // copy
        centroids.sort(() => {
            return (Math.round(Math.random()) - 0.5);
        });
        return centroids.slice(0, k);
    }

    classify(point) {
        let min = Infinity, index = 0;

        for (let i = 0; i < this.centroids.length; i++) {
            let dist = this.distance(point, this.centroids[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        return index;
    }

    cluster(points, k) {
        k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

        this.centroids = this.randomCentroids(points, k);

        let assignment = new Array(points.length);
        let clusters = new Array(k);

        let movement = true;
        while (movement) {
            // update point-to-centroid assignments
            for (let i = 0; i < points.length; i++) {
                assignment[i] = this.classify(points[i]);
            }

            // update location of each centroid
            movement = false;
            for (let j = 0; j < k; j++) {
                let assigned = [];
                for (let i = 0; i < assignment.length; i++) {
                    if (assignment[i] === j) {
                        assigned.push(points[i]);
                    }
                }
                if (!assigned.length) {
                    continue;
                }
                let centroid = this.centroids[j];
                let newCentroid = new Array(centroid.length);

                for (let g = 0; g < centroid.length; g++) {
                    let sum = 0;
                    for (let i = 0; i < assigned.length; i++) {
                        sum += assigned[i][g];
                    }
                    newCentroid[g] = sum / assigned.length;

                    if (newCentroid[g] !== centroid[g]) {
                        movement = true;
                    }
                }
                this.centroids[j] = newCentroid;
                clusters[j] = assigned;
            }
        }
        return clusters;
    }
}
