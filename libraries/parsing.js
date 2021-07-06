export default {
    /** Separates string by spaces and returns substring based on given index
     * 
     * @param {Number} text text to be split
     * @param {Number} index substring index to be parsed and returned
     * @returns {String} substring based on given index
     */
    getSplitString(text, index) {
        res = text.split(' ');
        return res[index] ? res[index] : "";
    },

    /** Separates string by spaces and returns substrings based on given indexes
     * 
     * @param {Number} text text to be split
     * @param {Array<Number>} indexes substring indexes to be parsed and returned
     * @returns {Array<String>} array of substrings based on given indexes
     */
    getSplitStrings(text, indexes) {
        substrings = [];
        for (let index in indexes) {
            substrings.push(getSplitString(text, index));
        }

        return substrings;
    }
}