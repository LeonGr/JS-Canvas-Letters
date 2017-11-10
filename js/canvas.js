let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;

let letterParticles = [];

let lineMaxDistance = 20;

function draw(){
    canvas.width = canvas.width;

    ctx.beginPath();
    for(let i = 0, x = letterParticles.length; i < x; i++){
		let p = letterParticles[i];

		ctx.moveTo(p.x, p.y);

        for(let j = 0, y = letterParticles.length; j < y; j++){
            let q = letterParticles[j];

            if(getDistance(p, q) < lineMaxDistance){
                ctx.lineTo(q.x, q.y);
            }
        }

		ctx.lineWidth = 0.05;
		ctx.strokeStyle = 'grey';
	}
    ctx.stroke();
}

function update(){
    let formingWord;

    for (let i = 0; i < letterParticles.length; i++){
        let p = letterParticles[i];

        let distance = getDistance(p, {x: p.originalX, y: p.originalY});

        if(distance >= 2 && !p.destination){
            p.vx *= -1;
            p.vy *= -1;
        }

        if (p.destination){
            formingWord = true;
            let distanceToDestination = getDistance(p, p.destination)
            let speed = distanceToDestination < 10 ? 1 : p.speed;
            let targetXdistance = p.destination.x - p.x;
            let targetYdistance = p.destination.y - p.y;
            p.vx = (targetXdistance / distanceToDestination) * speed;
            p.vy = (targetYdistance / distanceToDestination) * speed;

            if(distanceToDestination <= 2){
                p.vx = p.vy = Math.random() * (0.5 - (-0.5)) + -0.5
                p.destination = null;
                if (p.duplicate){
                    letterParticles.splice(i, 1);
                }
            }
        }

		p.x += Math.round((p.vx) * 100) / 100;
		p.y += Math.round((p.vy) * 100) / 100;

        p.x = Math.round((p.x) * 100) / 100;
        p.y = Math.round((p.y) * 100) / 100;
    }

    for(let i = 0, x = letterParticles.length; i < x; i++){
        p = letterParticles[i];

        if(p.destination || formingWord) {
            break;
        }

        formingWord = false;
        sequenceChanger();
    }
}

function render(){
	draw();
	update();
    requestAnimationFrame(render);
}

render();

function getDistance(one, two){
	return Math.sqrt(Math.pow((two.x - one.x), 2) + Math.pow((two.y - one.y), 2));
}

savedLetters = letters;
let sequence = [
    {text: "WELCOME\n"},
    {text: "I AM LEON\n"},
    {text: "DEVELOPER\n"},
]

drawWord({x: 300, y: 300, letters: sequence[0].text})

let currentSequence = 1;
let changingWord;
let stopSequence = false;

let sequenceChanger = () => {
    if (changingWord || stopSequence){
        return;
    }
    changingWord = true;
    let part = sequence[currentSequence];
    setTimeout(() => {
        spreadParticles();
        setTimeout(() => {
            formWord({x: 300, y: 300, letters: part.text}, true);
            currentSequence++;
            changingWord = false;
            if(currentSequence == sequence.length){
                currentSequence = 0;
            }
        }, 2000)
    }, 1000)
}

sequenceChanger();

let input = document.getElementById('word_input');

let changeLetters = () => {
    spreadParticles();
    setTimeout(() => {
        formWord({x: 300, y: 300, letters: input.value.toUpperCase() + '\n'}, true);
    }, 500)
}

input.onchange = function(){
    changingWord = true;
    stopSequence = true;
    if(changingWord){
        console.log('test');
        setTimeout(() => {
            changeLetters();
        }, 1000)
    } else {
        changeLetters();
    }
}
