export default
class Utility {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomElement(elements) {
        const index = Utility.randomInt(0, elements.length-1);
        return elements[index];
    }

    static randomElements(elements, n) {
        let random = [];
        while (random.length < n) {
            let e = Utility.randomElement(elements);
            while (random.includes(e)) {
                e = Utility.randomElement(elements);
            }
            random.push(e);
        }

        return random;
    }

    static delay(delay, value) {
        return new Promise(resolve => setTimeout(resolve, delay, value));
    }

    static euclidean(a, b) {
        let x = Math.abs(b[0] - a[0]);
        let y = Math.abs(b[1] - a[1]);

        return Math.sqrt(x*x + y*y);
    }
}
