function flappyGetKey() {
	document.addEventListener('keydown', (event) => {
		flappyDealKey(event.key);
		event.preventDefault();
	})
}

function flappyGetKeyTactile() {
	document.addEventListener('touchstart', (event) => {
		flappyDealKey("ArrowUp");
		event.preventDefault()
	})
}

const	flappyBirdCanvas = document.getElementById('canvas'); // <= Initialisation canvas memoire
const	fctx = flappyBirdCanvas.getContext('2d');

const	flappyGround = Math.round(flappyBirdCanvas.height / 4);
const	flappyEnnemies = []
const	flappy = []

let		difficult = 350;
let		wait = true;

const population = 200;

score = 0;
bestscore = 0;
globalBestLayer = [];
let inlive = population;
let i = 0;

function	machine(mvt) {
	let sum = 0;

	sum += ((mvt.pos.y - flappyEnnemies[1].pos.y) * mvt.layer[0]);
	sum += (flappyEnnemies[0].pos.x - mvt.pos.x) * mvt.layer[1];
	sum += (mvt.speed.y) * mvt.layer[2];
	sum += 0 * mvt.layer[3];
	sum += 1 * mvt.layer[4];
	sum = 1 / (1 + Math.exp(-sum));
	if (sum > 0.5) {
		machineLearnig(1, mvt);
	} else {
		machineLearnig(0, mvt);
	}
}

/*function	machine(mvt) {
	let sum = 0;

	sum += mvt.pos.y * mvt.layer[0];
	sum += (flappyEnnemies[0].pos.x - mvt.pos.x) * mvt.layer[1];
	sum += (flappyEnnemies[1].pos.y) * mvt.layer[2];
	sum += (flappyEnnemies[1].pos.y - difficult) * mvt.layer[3];
	sum += 5 * mvt.layer[4];
	sum = 1 / (1 + Math.exp(-sum));
	if (sum > 0.5) {
		machineLearnig(1, mvt);
	} else {
		machineLearnig(0, mvt);
	}
}*/

while (i < population) {
	const flappyBird = {
		acc: {
			x: 0,
			y: 2
		},
		speed: {
			x: 0,
			y: 0
		},
		pos: {
			x: 100,
			y: flappyGround * (i / 10)
		},
		size: {
			x: 50,
			y: 50
		},
		score: 0,
		gameOn: false,
		bestscore: 0,
		godMode: false,
	}
	flappy.push(flappyBird);
	i++;
}

function flappyCreateEnemy(posX, posY, sizeY) {
	const obj = {
		acc: {
			x: 0,
			y: 0
		},
		speed: {
			x: -7,
			y: 0
		},
		pos: {
			x: posX,
			y: posY
		},
		size: {
			x: 86,
			y: sizeY
		}
	}
	flappyEnnemies.push(obj);
}

function flappyCollision(ennemy) {
	for (const [ index, flappyBird ] of flappy.entries()) {
		if (flappyBird.gameOn) {
			if (flappyBird.pos.x < ennemy.pos.x + ennemy.size.x &&
				flappyBird.pos.x + flappyBird.size.x > ennemy.pos.x &&
				flappyBird.pos.y < ennemy.pos.y + ennemy.size.y &&
				flappyBird.pos.y + flappyBird.size.y > ennemy.pos.y) {
					inlive--;
					flappyBird.gameOn = false;
					fctx.clearRect(flappyBird.pos.x, flappyBird.pos.y, flappyBird.size.x, flappyBird.size.y);
				}
			}
	}
}

/*
function flappyDealKey(key) {
	if (key === "ArrowUp" || key === " " || key === "z") {
		if (flappyBird.gameOn) {
			flappyBird.speed.y = -30;
		} else if (wait == false){
			flappyResetGame(true);
		}
		if (wait == true) {
			flappyBird.gameOn = true;
			wait = false;
			flappyGame ();
		}
	}
	if (key === "G") {
		flappyBird.godMode = true;
	}
}*/

function	machineLearnig(jump, mvt) {
	if (jump == 1) {
		mvt.speed.y = -30;
	}
}

function flappyMouvement(mvt, ennemy) {
	mvt.speed.x += mvt.acc.x;
	mvt.pos.x += mvt.speed.x;
	mvt.speed.y += mvt.acc.y;
	mvt.pos.y += mvt.speed.y;
	if (mvt.pos.y > flappyBirdCanvas.height) {
		fctx.clearRect(mvt.pos.x, mvt.pos.y, mvt.size.x, mvt.size.y);
		mvt.gameOn && inlive--;
		mvt.gameOn = false;
	}
	if (mvt.pos.y < 0 && !ennemy) {
		mvt.pos.y = 0;
		mvt.speed.y = 0;
	}
}

function flappyBirdMouvement() {
	for (const [ index, flappyBird ] of flappy.entries()) {
		machine(flappyBird);
		flappyBird.gameOn && fctx.clearRect(flappyBird.pos.x, flappyBird.pos.y, flappyBird.size.x, flappyBird.size.y);
		flappyMouvement(flappyBird);
		fctx.fillStyle = 'black';
		flappyBird.gameOn && flappyBird.score++;
//	fctx.fillRect(flappyBird.pos.x, flappyBird.pos.y, flappyBird.size.x, flappyBird.size.y);
		flappyBird.gameOn && fctx.drawImage(flappyImg, flappyBird.pos.x, flappyBird.pos.y, flappyBird.size.x, flappyBird.size.y);
	}
}

function flappyEnnemyMouvement() {
	for (const [ index, ennemy ] of flappyEnnemies.entries()) {
		if (ennemy.pos.x < -100 && index % 2 == 0) {
			let pos = (Math.round((Math.random() * flappyBirdCanvas.height) / 2));
			let length = 11804;
			flappyCreateEnemy(flappyEnnemies[flappyEnnemies.length - 1].pos.x + 600, pos - length, length);
			flappyCreateEnemy(flappyEnnemies[flappyEnnemies.length - 2].pos.x + 600, pos + difficult, length);
			flappyEnnemies.splice(0, 2);
		}
		fctx.clearRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
		flappyMouvement(ennemy, true);
		fctx.fillStyle = 'black';
		if (index % 2 == 0) {
			fctx.drawImage(tuyauHaut, ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
		} else {
			fctx.drawImage(tuyauBas, ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
		}
//		fctx.fillRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
		if (ennemy.pos.x < 150) {
			flappyCollision(ennemy);
		}
	}
	return 42;
}

function createLayer(mvt) {
	let layer = [];

	layer[0] = Math.random() * 10 - 5;
	layer[1] = Math.random() * 10 - 5;
	layer[2] = Math.random() * 10 - 5;
	layer[3] = Math.random() * 10 - 5;
	layer[4] = Math.random() * 10 - 5;
	mvt.layer = layer;
}

function getBestLayer() {
	best = -42;
	bestLayer = [];
	for (let i = 0; i < population; i++) {
		if (flappy[i].score >= bestscore) {
			globalBestLayer = flappy[i].layer;
		}
		if (flappy[i].score > best && i >= 20) {
			best = flappy[i].score;
			bestLayer = flappy[i].layer;
		}
		if (flappy[i].score > bestscore && i < 20) {
			best = flappy[i].score;
			bestLayer = flappy[i].layer;
		}
	}
	return (bestLayer);
}

let pichenette = 0.2;

function createNewLayer(flappy, index, bestLayer) {
	if (index === 42) {
		flappy.layer = globalBestLayer;
	}
	else if (index < 20) {
		createLayer(flappy);
	} else {
		flappy.layer = bestLayer.slice(0);
		flappy.layer[index % 5] = flappy.layer[index % 5] + Math.random() * pichenette * 2 - pichenette;
	}
}

function bigBang(gameOn) {
	bestLayer = getBestLayer();
	for (const [ index, flappyBird ] of flappy.entries()) {
		fctx.clearRect(0, 0, flappyBirdCanvas.width, flappyBirdCanvas.height);
		fctx.fillStyle = 'black';
		flappyBird.score = 0;
		flappyBird.speed.y = 0
		flappyBird.gameOn = true;
		flappyBird.godMode = false;
		createNewLayer(flappyBird, index, bestLayer);
	}
	flappyEnnemies.splice(0, flappyEnnemies.length);
	let num = 800;
	while (num <= 4800){
		let pos = (Math.round((Math.random() * flappyBirdCanvas.height) / 2));
		let length = 11804;
		flappyCreateEnemy(num, pos - length, length);
		flappyCreateEnemy(num, pos + difficult, length);
		num += 600;
	}
	flappyGame();
}


function flappyResetGame(gameOn) {
	for (const [ index, flappyBird ] of flappy.entries()) {
		fctx.clearRect(0, 0, flappyBirdCanvas.width, flappyBirdCanvas.height);
		fctx.fillStyle = 'black';
		flappyBird.score = 0;
		flappyBird.pos.y = flappyGround;
		flappyBird.speed.y = 0
		flappyBird.gameOn = true;
		flappyBird.godMode = false;
		createLayer(flappyBird);
	}
	flappyEnnemies.splice(0, flappyEnnemies.length);
	let num = 800;
	while (num <= 4800){
		let pos = (Math.round((Math.random() * flappyBirdCanvas.height) / 2));
		let length = 11804;
		flappyCreateEnemy(num, pos - length, length);
		flappyCreateEnemy(num, pos + difficult, length);
		num += 600;
	}
	flappyGame();
}

function flappyGame() {
	flappyEnnemyMouvement();
	flappyBirdMouvement();
	console.log('score =', score);
	if (inlive === 0) {
		if (score > bestscore) {
			bestscore = score;
		}
		score = 0;
		inlive = population;
		bigBang();
	} else {
	score++;
	requestAnimationFrame(flappyGame);
	}
}

const	menu = document.getElementById('menuhtml');
const	level = document.getElementById('menuLevel');
const	test = document.getElementById('test');

const	flappyImg = new Image();
flappyImg.src = "flappyBird.png";

const	tuyauHaut = new Image();
tuyauHaut.src = "tuyauHaut.png";

const	tuyauBas = new Image();
tuyauBas.src = "tuyauBas.png";

function flappyBirdStartGame() {
	level.style.display = "none";
	flappyBirdCanvas.width = window.innerWidth;
	flappyBirdCanvas.height = window.innerHeight;
	flappyBirdCanvas.style.display = "block";
	tuyauHaut.onload = tuyauBas.onload = flappyImg.onload = flappyResetGame(false);
}

function easyStart() {
	difficult = 400;
	flappyBirdStartGame();
}

function mediumStart() {
	difficult = 350;
	flappyBirdStartGame();
}

function hardStart() {
	difficult = 300;
	flappyBirdStartGame();
}

function selectDifficulty() {
	menu.style.display = "none";
	level.style.display = "flex";
}
