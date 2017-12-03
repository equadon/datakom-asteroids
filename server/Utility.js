export default
class Utility {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}