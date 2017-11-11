let getCoordinates = {
    Lowest: function(array) {

        let lowest = Infinity;
        for (let i = 0, x = array.length; i < x; i++) {
            if (array[i].y < lowest) {
                lowest = array[i].y;
            }
        }

        return lowest;
    },

    Leftest: function(array) {

        let leftest = Infinity;

        for (let i = 0, x = array.length; i < x; i++) {
            if (array[i].x < leftest) {
                leftest = array[i].x;
            }
        }

        return leftest;
    },

    Rightest: function(array) {

        let rightest = 0;

        for (let i = 0, x = array.length; i < x; i++) {
            if (array[i].x > rightest) {
                rightest = array[i].x;
            }
        }

        return rightest;
    }
}

function drawWord(word) {
    let startIndex = 0
    let index = 0;
    let wordWidth = 0;

    for (let k = 0, z = word.letters.split("").length; k < z; k++) {

        let letter = word.letters.split("")[k];

        for(let i = 0, x = savedLetters.length; i < x; i++) {

            if (letter == savedLetters[i].name) {

                for(let j = 0, y = savedLetters[i].coords.length; j < y; j++) {

                    let particleX = Math.round((savedLetters[i].coords[j].x - getCoordinates.Leftest(savedLetters[i].coords) + wordWidth) * 100) / 100;
                    let particleY = Math.round((word.y + savedLetters[i].coords[j].y - getCoordinates.Lowest(savedLetters[i].coords)) * 100) / 100;

                    letterParticles.push({
                        x: particleX,
                        y: particleY,
                        originalX: particleX,
                        originalY: particleY,
                        vx: Math.round((Math.random() * (0.5 - (-0.5)) + -0.5) * 100) / 100,
                        vy: Math.round((Math.random() * (0.5 - (-0.5)) + -0.5) * 100) / 100,
                    })

                    if(wordWidth + 250 > window.innerWidth) {
                        word.y += 120;
                        wordWidth = 0;
                    }
                }

                wordWidth += getCoordinates.Rightest(savedLetters[i].coords) - getCoordinates.Leftest(savedLetters[i].coords) + 20;
            }
        }

        if (letter == ' ') wordWidth += 50;

        if (letter.split("\n").length > 1) {
            word.y += 120;
            let particlesToMeasure = [];

            for(let i = startIndex, x = letterParticles.length; i < x; i++) {
                particlesToMeasure.push(letterParticles[i])
            }

            let offsetTest = (canvas.width - (getCoordinates.Rightest(particlesToMeasure) - getCoordinates.Leftest(particlesToMeasure))) / 2;

            for(let i = startIndex, x = letterParticles.length; i < x; i++) {
                let p = letterParticles[i];
                p.x += offsetTest;
                p.originalX += offsetTest;
            }

            startIndex = letterParticles.length;
            wordWidth = 0;
        }

        index++
    }
}

function spreadParticles() {
    for(let i = 0, x = letterParticles.length; i < x; i++) {
        let p = letterParticles[i];

        p.destination = {
            x: Math.round((Math.random() * (window.innerWidth - 10) + 10) * 100) / 100,
            y: Math.round((Math.random() * (window.innerHeight - 60) + 60) * 100) / 100
        }
        p.speed = 1;
    }
}

function formWord(word, random) {
    let startIndex = 0;
    let newPositions = [];
    let index = 0;
    let wordWidth = 0;

    for (let k = 0, z = word.letters.split("").length; k < z; k++) {
        let letter = word.letters.split("")[k];

        for(let i = 0, x = savedLetters.length; i < x; i++) {

            if (letter == savedLetters[i].name) {

                for(let j = 0, y = savedLetters[i].coords.length; j < y; j++) {

                    let particleX = Math.round((savedLetters[i].coords[j].x - getCoordinates.Leftest(savedLetters[i].coords) + wordWidth) * 100) / 100;
                    let particleY = Math.round((word.y + savedLetters[i].coords[j].y - getCoordinates.Lowest(savedLetters[i].coords)) * 100) / 100;
                    newPositions.push({
                        x: particleX,
                        y: particleY,
                    })

                    if(wordWidth + 250 > window.innerWidth) {
                        word.y += 120;
                        wordWidth = 0;
                    }
                }

                wordWidth += getCoordinates.Rightest(savedLetters[i].coords) - getCoordinates.Leftest(savedLetters[i].coords) + 20;
            }
        }

        if (letter == ' ') wordWidth += 50;

        if (letter.split("\n").length > 1) {
            word.y += 120;
            let particlesToMeasure = [];

            for(let i = startIndex, x = newPositions.length; i < x; i++) {
                particlesToMeasure.push(newPositions[i])
            }

            let offsetTest = (canvas.width - (getCoordinates.Rightest(particlesToMeasure) - getCoordinates.Leftest(particlesToMeasure))) / 2;

            for(let i = startIndex, x = newPositions.length; i < x; i++) {
                let p = newPositions[i];
                p.x += offsetTest;
                p.originalX += offsetTest;
            }

            startIndex = newPositions.length;
            wordWidth = 0;
        }
        index++
    }

    if (random) letterParticles.sort(function() { return 0.5 - Math.random() });

    let moveBackSpeed = moveSpeed;

    if(letterParticles.length < newPositions.length) {
        let index = 0;

        for(let i = 0; i < letterParticles.length; i++) {

            let test = Math.ceil(newPositions.length / letterParticles.length);

            for(let j = 1; j < test; j++) {

                if(letterParticles.length == newPositions.length) break;

                letterParticles.push(JSON.parse(JSON.stringify(letterParticles[i])));
            }
        }
    }

    else if(letterParticles.length > newPositions.length) {

        let index = 0;

        for(let i = 0, x = newPositions.length; i < x; i++) {

            let oldParticlesPerNew = Math.ceil((letterParticles.length - index) / (newPositions.length - i));
            let array = [];

            for(let j = 0, x = oldParticlesPerNew; j < x; j++) {

                letterParticles[j+index].destination = newPositions[i];
                letterParticles[j+index].originalX = newPositions[i].x;
                letterParticles[j+index].originalY = newPositions[i].y;
                letterParticles[j+index].distance = getDistance(letterParticles[j+index], newPositions[i]);
                letterParticles[j+index].speed = moveBackSpeed;

                array.push(letterParticles[j+index]);
            }

            function compare(a,b) {
                if (a.distance < b.distance)
                    return -1;
                if (a.distance > b.distance)
                    return 1;
                return 0;
            }

            array.sort(compare)

            for(let i = 1, x = array.length; i < x; i++) {
                array[i].duplicate = true;
            }

            index += oldParticlesPerNew;
        }
    }

    if(letterParticles.length == newPositions.length) {

        for(let i = 0, x = letterParticles.length; i < x; i++) {
            let p = letterParticles[i];

            if(i >= newPositions.length) {
                return
            }

            p.destination = newPositions[i];
            p.originalX = newPositions[i].x;
            p.originalY = newPositions[i].y;
            p.speed = moveBackSpeed;
        }
    }
}
