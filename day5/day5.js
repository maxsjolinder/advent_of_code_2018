if (require.main == module) {
    String.prototype.isUpperCase = function () {
        return this == this.toUpperCase();
    };

    var polymers = readPolymersFromFile();
    var resultingPolymer = calculateReaction(polymers)
    console.log(`Part 1, resulting polymer contains ${resultingPolymer.length} units`)

    var shortestLenth = getShortestPossiblePolymerLengthWhenRemovingUnit(polymers)
    console.log(`Part 2, shortest possible polymer length is ${shortestLenth} units`)
}

function readPolymersFromFile() {
    var fs = require('fs');
    return fs.readFileSync('input', 'utf8')
}

function calculateReaction(polymers) {
    var reactionOccured = false
    for (let i = 1; i < polymers.length; i++) {
        let polymer1 = polymers[i - 1]
        let polymer2 = polymers[i]
        if (doReact(polymer1, polymer2)) {
            polymers = polymers.slice(0, i - 1) + polymers.slice(i + 1)
            reactionOccured = true
            i -= 1
        }
    }
    if (!reactionOccured) {
        return polymers
    } else {
        return calculateReaction(polymers)
    }
}

function doReact(polymer1, polymer2) {
    return getReactingPolymer(polymer1) == polymer2;
}

function getReactingPolymer(polymer) {
    return polymer.isUpperCase() ? polymer.toLowerCase() : polymer.toUpperCase();
}

function getShortestPossiblePolymerLengthWhenRemovingUnit(polymers) {
    var map = new Map()
    for (let unit of polymers) {
        if (!map.has(unit.toLowerCase())) {
            var regex = new RegExp(unit.toLowerCase(), 'gi');
            let polymersWithoutUnit = polymers.replace(regex, "");
            map.set(unit.toLowerCase(), calculateReaction(polymersWithoutUnit).length)
        }
    }
    return Math.min.apply(Math, Array.from(map.values()));
}