import GameObject from 'universe/GameObject'
import Utility from 'utility'

const MASS_DIFF = 0.10; // mass can differ by at most +-10%

const BODIES = {
    stars: {
        star1: [1000, 350] // mass, radius
    },
    planets: {
        planet1: [500, 120]
    },
    blackHoles: {
        blackHole1: [1500, 110]
    },
    moons: {
        moon1: [100, 90]
    }
};

function randomMass(mass, diff) {
    return mass * (1 - Utility.randomFloat(-diff, diff));
}

function randomPosition(zone, radius, parent=null) {
    let x, y;
    if (parent == null) {
        x = Utility.randomInt(zone.left + radius*2, zone.right - radius*2);
        y = Utility.randomInt(zone.top + radius*2, zone.bottom - radius*2);
    } else {
        const distance = parent.radius + Utility.randomFloat(radius, 3*radius);
        const angle = Utility.randomFloat(0, 2*Math.PI);

        x = distance * Math.cos(angle) + parent.x;
        y = distance * Math.sin(angle) + parent.y;
    }
    return [x, y];
}

export default
class CelestialBody extends GameObject {
    constructor(id, type, x, y, mass, radius) {
        super(id, type, x, y, 0, 2*radius, 2*radius);

        this.data.radius = radius;
        this.data.mass = mass;
    }

    get radius() {
        return this.data.radius;
    }

    get mass() {
        return this.data.mass;
    }

    static randomStar(id, zone, parent=null) {
        return CelestialBody.random(id, 'stars', zone, parent);
    }

    static randomBlackHole(id, zone, parent=null) {
        return CelestialBody.random(id, 'blackHoles', zone, parent);
    }

    static randomPlanet(id, zone, parent=null) {
        return CelestialBody.random(id, 'planets', zone, parent);
    }

    static randomMoon(id, zone, parent) {
        return CelestialBody.random(id, 'moons', zone, parent);
    }

    static random(id, t, zone, parent) {
        const type = Utility.randomElement(Object.keys(BODIES[t]));
        const [mass, radius] = BODIES[t][type];
        const [x, y] = randomPosition(zone, radius, parent);

        return new CelestialBody(id, type, x, y, randomMass(mass, MASS_DIFF), radius);
    }
}