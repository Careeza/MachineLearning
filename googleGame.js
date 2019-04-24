const googleImg = new Image();
googleImg.src = "perso.png";

const googleCanvas = document.getElementById('canvas'); // <= Initialisation canvas memoire
const gctx = googleCanvas.getContext('2d');
googleCanvas.width = window.innerWidth; // <= taille du canvas en largeur adapter a la fenetre
googleCanvas.height = window.innerHeight; // <= taille du canvas en hauteur adapter a la fenetre

function	googleGetKey() {
	document.addEventListener('keydown', (event) => {
		googleDealKey(event.key);
		event.preventDefault()
	})
}

function	googleGetTactile() {
	document.addEventListener('touchstart', (event) => {
		googleDealKey("ArrowUp");
		event.preventDefault()
	})
}

const googleGround = Math.round(googleCanvas.height / 4) * 3;
const googleEnnemies = []
let googleDist = 600;
let googleEnnemySpeed = -10;

const dino = {
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
		y: googleGround
	},
	size: {
		x: 50,
		y: 50
	},
	ground: googleGround,
	newground: googleGround,
	jump: false,
	dbjump: false,
	score: 0,
	gameOn: true,
	bestscore: 0
}

function createBird(x) {
	let birdHeight = Math.round(Math.random() * 100) + 300;

	const obj = {
		acc: {
			x: 0,
			y: 2
		},
		speed: {
			x: googleEnnemySpeed - 5,
			y: 0
		},
		pos: {
			x: x,
			y: googleGround - birdHeight
		},
		size: {
			x: 50,
			y: 50
		},
		bird: true,
		ground: googleGround - birdHeight,
		newground: googleGround - birdHeight,
		jump: false,
		dbjump: false,
	}
	googleEnnemies.push(obj);
}

function createDinoEnnemy(x) {
	let size = Math.round(Math.random() * 200);

	const obj = {
		acc: {
			x: 0,
			y: 2
		},
		speed: {
			x: googleEnnemySpeed,
			y: 0
		},
		pos: {
			x: x,
			y: googleGround - size
		},
		size: {
			x: 50,
			y: 50 + size
		},
		bird: false,
		ground: googleGround - size,
		newground: googleGround - size,
		saveframe: 0,
		jump: false,
		dbjump: false,
	}
	googleEnnemies.push(obj);
}

function googleCollision(ennemy) {
	if (dino.pos.x < ennemy.pos.x + ennemy.size.x &&
	dino.pos.x + dino.size.x > ennemy.pos.x &&
	dino.pos.y < ennemy.pos.y + ennemy.size.y &&
	dino.pos.y + dino.size.y > ennemy.pos.y) {
		return (false);
	}
	return (true);
}

function googleDealKey(key) {
	if ((key === "ArrowUp" || key === " " || key === "z") && !dino.jmp) {
		if (dino.gameOn) {
			dino.jmp = true;
			dino.speed.y = -30;
		} else {
			googleResetGame();
		}
	} else if ((key === "ArrowUp" || key === " " || key === "z") && dino.jmp && !dino.dbjump) {
		dino.speed.y = -30;
		dino.dbjump = true;
	}
	if (key === "ArrowDown" || key === "Shift") {
		dino.acc.y = 50;
		dino.jmp = false;
		dino.dbjump = false;
	}
	console.log(key);
}

function googleMouvement(mvt) {
	mvt.speed.x += mvt.acc.x;
	mvt.pos.x += mvt.speed.x;
	mvt.speed.y += mvt.acc.y;
	mvt.pos.y += mvt.speed.y;
	if (mvt.pos.y > mvt.ground) {
		mvt.jmp = false
		mvt.dbjump = false;
		mvt.acc.y = 2;
		mvt.pos.y = mvt.ground;
		if (mvt.speed.y > 0)
			mvt.speed.y = 0;
	}
}

function dinoMouvement() {
	gctx.clearRect(dino.pos.x, dino.pos.y, dino.size.x, dino.size.y);
	googleMouvement(dino);
	gctx.fillStyle = 'black';
	gctx.drawImage(googleImg, dino.pos.x, dino.pos.y, dino.size.x, dino.size.y);
}

function googleEnnemyMouvement() {
	for (const [ index, ennemy ] of googleEnnemies.entries()) {
		ennemy.speed.x = Math.round(googleEnnemySpeed - (0.015 * dino.score));
		if (ennemy.bird) {
			ennemy.speed.x = Math.round(ennemy.speed.x * 1.5);
		}
		if (ennemy.pos.x < 0) {
			if (googleEnnemies[index].bird !== true) {
				createDinoEnnemy(Math.round(googleEnnemies[googleEnnemies.length - 1].pos.x + googleDist + (0.33 * dino.score)));
			} else {
				createBird(Math.round(googleEnnemies[googleEnnemies.length - 1].pos.x + googleDist + (0.33 * dino.score)));
			}
			googleEnnemies.splice(index, 1);
		} else {
			if (!ennemy.bird || dino.score > 500) {
					gctx.clearRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
					googleMouvement(ennemy)
					gctx.fillStyle = 'red';
					ennemy.pos.x > 0 && gctx.fillRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
				}
			}
		if (!googleCollision(ennemy)) {
			return (false);
		}
	}
	return (true);
}

function googleResetGame() {
	gctx.clearRect(0, 0, googleCanvas.width, googleCanvas.height);
	googleEnnemies.splice(0, googleEnnemies.length);
	let distance = 0;
	let num = 1200;
	while (num <= 7200) {
		createDinoEnnemy(num);
		num += googleDist + (distance * 50);
		distance++;
	}
	distance = 0;
	num = 3000;
	while (num <= 7200) {
		createBird(num);
		num += Math.round((googleDist * 1.5) + (distance * 25));
		distance++;
	}
	gctx.fillStyle = 'black';
	gctx.fillRect(0, googleGround + 50, googleCanvas.width, 10);
	dino.score = 0;
	dino.gameOn = true;
	googleGame();
}

function googleGameOver() {
	dino.dbjump = false;
	dino.jmp = false;
	dino.size.y = 50;
	dino.pos.y = googleGround;
	dino.speed.y = 0;
	dino.newground = googleGround;
	gctx.clearRect(0, 0, googleCanvas.width, googleCanvas.height);
	gctx.font = '100px Quicksand';
	gctx.fillStyle = 'red';
	gctx.textAlign = "center"; 
	gctx.fillText(`Game Over Score = ${dino.score}`, googleCanvas.width / 2, googleCanvas.height / 2);
	if (dino.score > dino.bestscore) {
		dino.bestscore = dino.score;
	}
}

function googleScore() {
	gctx.fillStyle = 'black';
	gctx.clearRect(0, 0, 300, 21);
	gctx.font = '20px Quicksand';
	dino.score++;
	gctx.textAlign = "left"; 
	if (dino.score < dino.bestscore) {
		gctx.fillText(`Score: ${dino.score}, Bestscore: ${dino.bestscore}`, 0, 18)
	} else {
		gctx.fillText(`Score: ${dino.score}, Bestscore: new best`, 0, 18)
	}
}

function googleGame() {
	googleScore();
	dinoMouvement();
	if (!googleEnnemyMouvement()) {
		googleGameOver();
		dino.gameOn = false;
	}
	dino.gameOn && requestAnimationFrame(googleGame);
}


function googleStartGame() {
	const menu = document.getElementById("menuhtml")
	menu.style.display = "none";
	googleCanvas.style.display = "block";
	googleGetKey();
	googleGetTactile();
	googleImg.onload = googleResetGame();
}
