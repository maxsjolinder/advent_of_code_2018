if (require.main == module) {
    var records = readRecordsFromFileSortedByDate()
    var guardRecords = buildGuardRecords(records)
    let guardSleptMost = getGuardThatSleptTheMost(guardRecords)
    let minuteMostSlept = guardSleptMost.getMinuteWithHighestSleepFrequency()
    console.log(`Part 1, guard id x most slept minute: ${guardSleptMost.guardId} x ${minuteMostSlept} = ${guardSleptMost.guardId * minuteMostSlept}`)

    let guardSleptMostOnMin = getGuardThatSleptTheMostOnTheSameMinute(guardRecords)
    let minuteMostFreqSlept = guardSleptMostOnMin.getMinuteWithHighestSleepFrequency()
    console.log(`Part 2, guard id x most slept minute: ${guardSleptMostOnMin.guardId} x ${minuteMostFreqSlept} = ${guardSleptMostOnMin.guardId * minuteMostFreqSlept}`)
}

function getGuardThatSleptTheMost(guardRecords) {
    let mostSleptTime = 0
    let highetsGuard;
    for (let [guardId, guard] of guardRecords) {
        let sleptTime = guard.getTotalSleptTime()
        if (sleptTime > mostSleptTime) {
            mostSleptTime = sleptTime
            highetsGuard = guard
        }
    }
    return highetsGuard
}

function getGuardThatSleptTheMostOnTheSameMinute(guardRecords) {
    let highestFrequency = -1
    var highestGuard
    for (let [guardId, guard] of guardRecords) {
        let minute = guard.getMinuteWithHighestSleepFrequency()
        var currentFreq = guard.getMinutesSleepFrequencyArray()[minute]
        if (currentFreq > highestFrequency) {
            highestFrequency = currentFreq
            highestGuard = guard
        }
    }
    return highestGuard
}

function readRecordsFromFileSortedByDate() {
    let fs = require('fs');
    let records = fs.readFileSync('input', 'utf8').split(/\r?\n/)
    var structs = records.map(x => new Record(x))
    var sortedStructs = structs.sort((a, b) => a.time - b.time)
    return sortedStructs
}

function buildGuardRecords(records) {
    var map = new Map()
    let currentGuardId = -1
    for (let record of records) {
        if (record.type == "starts") {
            currentGuardId = record.id
        }

        if (!map.has(currentGuardId)) {
            var guard = new Guard(currentGuardId)
            map.set(currentGuardId, guard)
        } else {
            var guard = map.get(currentGuardId)
        }
        guard.addRecord(record)
    }
    return map
}

function parseGuardId(recordString) {
    if (parseType(recordString) != "starts") {
        return ""
    }

    let hashtagIndex = recordString.indexOf("#")
    let idEndindex = recordString.indexOf(" ", hashtagIndex)
    let id = recordString.substring(hashtagIndex + 1, idEndindex);
    return id
}

function parseType(recordString) {
    let startIndex = recordString.indexOf("]") + 2
    let endIndex = recordString.indexOf(" ", startIndex)
    let type = recordString.substring(startIndex, endIndex);
    switch (type) {
        case "falls":
            return "sleeps"
        case "wakes":
            return "awakes"
        case "Guard":
            return "starts"
        default:
            return "unkown";
    }
}

function parseTime(recordString) {
    // Convert to utc
    let dateTimeString = recordString.substring(1, 17)
    dateTimeString = dateTimeString.replace(" ", "T") + "Z"
    return new Date(dateTimeString)
}

function Guard(id) {
    return {
        guardId: id,
        records: [],

        addRecord: function (record) {
            this.records.push(record)
        },

        getTotalSleptTime: function () {
            let totalSleepTime = 0
            for (let record of this.records) {
                if (record.type == "sleeps") {
                    var startedSleepingTime = record.time
                } else if (record.type == "awakes") {
                    let sleepTime = record.time.getUTCMinutes() - startedSleepingTime.getUTCMinutes()


                    totalSleepTime += sleepTime
                }
            }
            return totalSleepTime
        },

        getMinutesSleepFrequencyArray: function () {
            let minutes = Array(60).fill(0)
            for (let record of this.records) {
                if (record.type == "sleeps") {

                    var startedSleepingTime = record.time
                } else if (record.type == "awakes") {
                    let startMin = startedSleepingTime.getUTCMinutes()
                    let endTime = record.time.getUTCMinutes()

                    for (let i = startMin; i < endTime; i++) {
                        minutes[i] = minutes[i] + 1
                    }
                }
            }

            return minutes
        },

        getMinuteWithHighestSleepFrequency: function () {
            var minutes = this.getMinutesSleepFrequencyArray()
            let highestFrequency = 0
            let highestIndex = -1
            for (let i = 0; i < minutes.length; i++) {
                let currentFreq = minutes[i]
                if (currentFreq > highestFrequency) {
                    highestFrequency = currentFreq
                    highestIndex = i
                }
            }

            return highestIndex
        }
    }
}

function Record(recordString) {
    return {
        type: parseType(recordString),
        time: parseTime(recordString),
        id: parseGuardId(recordString)
    };
}