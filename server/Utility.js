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

    static delay(delay, value) {
        return new Promise(resolve => setTimeout(resolve, delay, value));
    }
}