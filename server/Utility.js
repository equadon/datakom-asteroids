export default
class Utility {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static delay(delay, value) {
        return new Promise(resolve => setTimeout(resolve, delay, value));
    }
}