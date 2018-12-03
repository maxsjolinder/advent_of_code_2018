if (require.main == module) {
    let claims = readClaimsFromFile()
    let claimedCoordinates = buildClaimedCoordinate2dArray(claims)
    let nrOfSquareInches = calculateMultipleClaimedSquareInches(claimedCoordinates)
    console.log(`Part 1, number of square inches: ${nrOfSquareInches}`)

    let claim = getClaimWithoutOverlap(claims, claimedCoordinates)
    console.log(`Part 2, ID of claim without overlap: ${claim.id}`)
}

function getClaimWithoutOverlap(claims, claimedCoordinates) {

    for (let claim of claims) {
        let foundOverlap = false
        for (let coord of claim.getClaimedCoordinates()) {

            if (claimedCoordinates[coord.x][coord.y] != 1) {
                foundOverlap = true
                break
            }
        }

        if (!foundOverlap) {
            return claim
        }
    }
}

function buildClaimedCoordinate2dArray(claims) {
    let claimedCoordinates = Array(1000).fill().map(() => Array(1000).fill(0));
    for (let claim of claims) {
        for (let coord of claim.getClaimedCoordinates()) {
            claimedCoordinates[coord.x][coord.y] = claimedCoordinates[coord.x][coord.y] + 1
        }
    }
    return claimedCoordinates
}

function calculateMultipleClaimedSquareInches(claimedCoordinates) {
    let result = 0;
    for (let x = 0; x < 1000; x++) {
        for (let y = 0; y < 1000; y++) {
            if (claimedCoordinates[x][y] > 1) {
                result++
            }
        }
    }
    return result
}

function readClaimsFromFile() {
    let fs = require('fs');
    let claimStrings = fs.readFileSync('input', 'utf8').split(/\r?\n/)
    return claimStrings.map(x => toClaimStruct(x))
}

// Parse string on format: #123 @ 3,2: 5x4
function toClaimStruct(claimString) {

    let components = claimString.split(" ");
    let id = components[0].substring(1)

    let offsets = components[2].split(",")
    let leftOffset = offsets[0]
    let topOffset = offsets[1].substring(0, offsets[1].length - 1)

    let dimensions = components[3].split("x")
    let width = dimensions[0]
    let height = dimensions[1]

    return new Claim(id, leftOffset, topOffset, width, height)
}

function Claim(id, leftOffset, topOffset, width, height) {
    return {
        id: id,
        leftOffset: Number(leftOffset),
        topOffset: Number(topOffset),
        width: Number(width),
        height: Number(height),

        getClaimedCoordinates: function () {
            let coordinates = []

            for (let x = this.leftOffset; x < this.leftOffset + this.width; x++) {
                for (let y = this.topOffset; y < this.topOffset + this.height; y++) {
                    coordinates.push({
                        x: x,
                        y: y
                    })
                }
            }
            return coordinates
        }
    };
}