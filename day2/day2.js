if (require.main == module) {
    let boxIds = readBoxIdsFromFile()
    let checksum = calculateChecksum(boxIds)
    console.log(`Part 1, checksum: ${checksum}`)

    let commonLetters = getCommonIdLettersFromArray(boxIds)
    console.log(`Part 2, common letters: ${commonLetters}`)
}

function readBoxIdsFromFile() {
    let fs = require('fs');
    return fs.readFileSync('input', 'utf8').split(/\r?\n/)
}

function calculateChecksum(boxIds) {
    let twoLetterComponent = 0
    let threeLetterComponent = 0
    for (let boxId of boxIds) {
        let components = getChecksumComponents(boxId)
        twoLetterComponent += components[0]
        threeLetterComponent += components[1]
    }

    return twoLetterComponent * threeLetterComponent
}

function getChecksumComponents(boxId) {
    var map = new Map()
    for (let char of boxId) {
        let newValue = map.has(char) ? map.get(char) + 1 : 1
        map.set(char, newValue)
    }

    let values = Array.from(map.values())
    let has2LetterComponent = values.filter(x => x == 2).length > 0
    let has3LetterComponent = values.filter(x => x == 3).length > 0
    let twoLetterComponent = has2LetterComponent ? 1 : 0
    let threeLetterComponent = has3LetterComponent ? 1 : 0

    return [twoLetterComponent, threeLetterComponent]
}

function getCommonIdLettersFromArray(boxIds) {

    for (let i = 0; i < boxIds.length; i++) {
        let boxId = boxIds[i]

        for (let j = i + 1; j < boxIds.length; j++) {
            let commonLetters = getCommonIdLetters(boxId, boxIds[j])
            if (commonLetters != "") {
                return commonLetters
            }
        }
    }
}

function getCommonIdLetters(boxId1, boxId2) {
    let mismatchIndex = -1
    for (let i = 0; i < boxId1.length; i++) {
        if (boxId1[i] != boxId2[i]) {
            if (mismatchIndex == -1) {
                mismatchIndex = i;
            } else {
                return ""
            }
        }
    }

    let commonLetters = ""
    if (mismatchIndex >= 0) {
        commonLetters += boxId1.substring(0, mismatchIndex)
        commonLetters += boxId1.substring(mismatchIndex + 1)
    }

    return commonLetters
}