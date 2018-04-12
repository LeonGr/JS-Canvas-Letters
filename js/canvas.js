// Declare canvas stuff
let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

//canvas.width = document.body.offsetWidth;
//canvas.height = document.body.offsetHeight;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store all particles that make up the letters
let letterParticles = [];

// Max distance between points to draw a line between them
let lineMaxDistance = 20;

// Set particle and line colour
let randomColour = false;
let colour = '#DD4620';

function setRandomColour(){
    colour = '#' + (Math.floor(Math.random() * 255) + 128).toString(16) + (Math.floor(Math.random() * 255) + 128).toString(16) + (Math.floor(Math.random() * 255) + 128).toString(16);
}

let moveSpeed = 5;

// Function that draws all particles in letterParticles array
function draw(){
    canvas.width = canvas.width;

    ctx.beginPath();

    for(let i = 0, x = letterParticles.length; i < x; i++){
		let p = letterParticles[i];

		ctx.moveTo(p.x, p.y);

        // Loop through all particles for every particle and draw a line if the distance is close enough
        for(let j = 0, y = letterParticles.length; j < y; j++){
            let q = letterParticles[j];

            if(getDistance(p, q) < lineMaxDistance){
                ctx.lineTo(q.x, q.y);
            }
        }

		ctx.lineWidth = 0.05;

        ctx.strokeStyle = colour;
	}

    ctx.stroke();
}

let particleVibrate = true;

// Function that updates the location of the particles
function update(){
    let formingWord;

    for (let i = 0; i < letterParticles.length; i++){
        let p = letterParticles[i];

        // Get the distance between the old location and the new location of the particle
        let distance = getDistance(p, {x: p.originalX, y: p.originalY});

        // Let particles vibrate in place if they have reached their destination
        if (particleVibrate){
            if(distance >= 2 && !p.destination){
                p.vx *= -1;
                p.vy *= -1;
            }
        }

        // If particle should travel to a destination give it a velocity in the right direction
        if (p.destination){
            formingWord = true;

            let distanceToDestination = getDistance(p, p.destination)
            let speed = distanceToDestination < 10 ? 1 : p.speed; // Change speed based on distance
            let targetXdistance = p.destination.x - p.x;
            let targetYdistance = p.destination.y - p.y;

            p.vx = (targetXdistance / distanceToDestination) * speed;
            p.vy = (targetYdistance / distanceToDestination) * speed;

            // If it is within 2 from the destination stop the movement and remove the destination
            if(distanceToDestination <= 2){
                if (particleVibrate) {
                    p.vx = p.vy = Math.random() * (0.5 - (-0.5)) + -0.5
                } else {
                    p.vx = p.vy = 0;
                }

                p.destination = null;

                // If there were more particles in the old word than the new remove the extra particles
                if (p.duplicate){
                    letterParticles.splice(i, 1);
                }
            }
        }

        // Update location based on velocity
        // Velocity is rounded for better performance
		p.x += Math.round((p.vx) * 100) / 100;
		p.y += Math.round((p.vy) * 100) / 100;

        p.x = Math.round((p.x) * 100) / 100;
        p.y = Math.round((p.y) * 100) / 100;
    }

    // If all particles have reached their destination start the next sequence
    for(let i = 0, x = letterParticles.length; i < x; i++){
        p = letterParticles[i];

        if(p.destination || formingWord) {
            break;
        }

        formingWord = false;
        sequenceChanger();
    }
}

// Render function that uses requestAnimationFrame for smooth refreshing
function render(){
	draw();
	update();
    window.requestAnimationFrame(render);
}

render();

// Return distance between two coordinates
function getDistance(one, two){
	return Math.sqrt(Math.pow((two.x - one.x), 2) + Math.pow((two.y - one.y), 2));
}

// Get all letters from letters.js
savedLetters = letters;

// Define sequence that is drawn before user chooses different word
let sequence = [
    {text: "WELCOME\n"},
    {text: "I AM LEON\n"},
    {text: "DEVELOPER\n"},
]

// Draw first word of sequence
drawWord({x: 300, y: 300, letters: sequence[0].text})
//formWord({x: 300, y: 300, letters: sequence[0].text}, true);

let currentSequence = 1;
let changingWord;
let stopSequence = false;

let randomOrClosest = true;
let shouldSpread = true;

// Method that draws the next word in the sequence
let sequenceChanger = () => {
    // If the word is being changed or should be stopped return
    if (changingWord || stopSequence){
        return;
    }

    changingWord = true;

    // Get word to draw
    let part = sequence[currentSequence];

    // Wait some time then spread out the current word
    setTimeout(() => {
        if (shouldSpread) spreadParticles();

        // Wait again and then move back the particles to form the next word
        setTimeout(() => {
            formWord({x: 300, y: 300, letters: part.text}, randomOrClosest);

            currentSequence++;
            changingWord = false;
            if(currentSequence == sequence.length){
                currentSequence = 0;
            }
        }, 2000)
    }, 1000)
}

// Start the sequence
sequenceChanger();

// Get input element from DOM
let wordInput = document.getElementById('word_input');
let wordColourInput = document.getElementById('word_colour');
let formSpeedInput = document.getElementById('form_speed');
let wordSpreadCheckbox = document.getElementById('word_spread');
let randomColourCheckbox = document.getElementById('random_colour');
let particleVibrateCheckbox = document.getElementById('particle_vibrate');

let inputArray = [wordInput, wordColourInput, formSpeedInput, wordSpreadCheckbox, randomColourCheckbox, particleVibrateCheckbox];

// Form word based on user input
let changeLetters = () => {
    spreadParticles();
    setTimeout(() => {
        formWord({x: 300, y: 300, letters: wordInput.value.toUpperCase() + '\n'}, randomOrClosest);
    }, 500)
}

// React to input change and make sure that it does not generate problems with the sequence
for (let i = 0; i < inputArray.length; i++){
    let input = inputArray[i];
    input.onchange = function(e) {
        switch(e.target){
            case wordInput:
                changeWord();
            case wordColourInput:
                colour = wordColourInput.value;
            case formSpeedInput:
                moveSpeed = formSpeedInput.value;
            case wordSpreadCheckbox:
                shouldSpread = wordSpreadCheckbox.checked;
            case randomColourCheckbox:
                if(randomColourCheckbox.checked) setRandomColour();
                else colour = wordColourInput.value;
            case particleVibrateCheckbox:
                particleVibrate = particleVibrateCheckbox.checked;
        }
    }
}

let changeWord = function(){
    changingWord = true;
    stopSequence = true;
    if(changingWord){
        // Wait if the word is currently changing
        setTimeout(() => {
            changeLetters();
        }, 1000)
    } else {
        changeLetters();
    }
}
