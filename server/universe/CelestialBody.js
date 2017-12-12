import GameObject from 'universe/GameObject'
import Utility from 'Utility'

const MASS_DIFF = 0.10; // mass can differ by at most +-10%

const BASE = 5000000;

const BODIES = {
    stars: {
        sun: [BASE*2, 1000] // mass, radius
    },
    planets: {
        planet1: [BASE*1, 600],
        planet2: [BASE*1.1, 600],
        planet3: [BASE*1.2, 600],
        planet4: [BASE*1.3, 600],
        planet7: [BASE*1.4, 600],
        planet8: [BASE*1.5, 600],
        planet9: [BASE*1.6, 600],
        planet10: [BASE*1.7, 600],
        planet11: [BASE*1.5, 600]
    },
    blackHoles: {
        blackHole1: [BASE*3, 200]
    },
    moons: {
        moon1: [BASE*0.5, 300],
        moon2: [BASE*0.5, 300]
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