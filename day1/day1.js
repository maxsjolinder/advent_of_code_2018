

if ( require.main==module ) 
{
    var frequencyOffsets = readFrequencyOffsetsFromFile()
    var sum = calculateSum(frequencyOffsets)
    console.log(`Result part1: ${sum}`)

    var firstDuplicateFreq = getFirstFrequencyDuplicate( frequencyOffsets )
    console.log(`Result part2: ${firstDuplicateFreq}`)
}

function readFrequencyOffsetsFromFile() 
{
    var fs = require('fs'); 
    return fs.readFileSync('input', 'utf8').split(/\r?\n/).map(Number)
}

function calculateSum( elements ) 
{
    return elements.reduce((a, b) => a + b, 0)
}

function getFirstFrequencyDuplicate( frequencyOffsets ) 
{
    // console.log(frequencyOffsets)
    var previousFrequencies = [0]
    for ( let i = 0; ; i = (i + 1) % frequencyOffsets.length )
    {
        let nextOffset = frequencyOffsets[i]        
        let nextFrequency = + previousFrequencies[ previousFrequencies.length -1 ] + +nextOffset
        if ( previousFrequencies.includes(nextFrequency) )
        {
            return nextFrequency
        }
        else
        {
            previousFrequencies.push(nextFrequency)
        }
    }
}