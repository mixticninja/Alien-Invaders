const startButton = document.getElementById('startButton');
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const explosionSound = document.getElementById('explosionSound');
const laserSound = document.getElementById('laserSound');
const introSound = document.getElementById('introSound');
const playSound = document.getElementById('playSound');
const overSound = document.getElementById('overSound');
const restartButton = document.getElementById('restartButton');
const gameOverScoreList = document.getElementById('gameOverScoreList');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverScoreInput = document.getElementById('gameOverScoreInput');
const highScoreMessage = document.getElementById('highScoreMessage');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const nameInput = document.getElementById('nameInput');
const soundButton = document.getElementById('soundButton');
const soundButton2 = document.getElementById('soundButton2');
const playerExplodeSound = document.getElementById('playerExplodeSound');
const ufoSound = document.getElementById('ufoSound');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
};


// Ajout des gestionnaires d'événements tactiles
if (saveScoreBtn) {
    saveScoreBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.click();
    }, false);
}

if (nameInput) {
    // Empêcher le zoom sur focus pour iOS
    nameInput.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.focus();
    }, false);
    
    // Assurer que le clavier virtuel s'affiche
    nameInput.addEventListener('focus', function() {
        // Faire défiler vers l'input si nécessaire
        setTimeout(() => {
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
}

const loadImages = async () => {
    try {
        const images = await Promise.all([
            loadImage('./assets/img/comp/barrel.png'),
            loadImage('./assets/img/comp/invader2.png'),
            loadImage('./assets/img/comp/alienbullet.png'),
            loadImage('./assets/img/comp/playerbullet.png'),
            loadImage('./assets/img/comp/soucoupe.png'),
            loadImage('./assets/img/comp/ufobomb.png'),
            loadImage('./assets/img/comp/fond.jpg'),
            loadImage('./assets/img/comp/heart.png'),
            loadImage('./assets/img/comp/bonusalien.png'),
            loadImage('./assets/img/comp/bonusalien2.png'),
            loadImage('./assets/img/comp/bonusalien3.png'),
            loadImage('./assets/img/comp/nrjup.png'),
            loadImage('./assets/img/comp/lifeup2.png'),
            loadImage('./assets/img/comp/gunlevelup.png'),
            loadImage('./assets/img/comp/GPUup.png'),
            loadImage('./assets/img/comp/waterup.png'),
            loadImage('./assets/img/comp/invader2.png'),
            loadImage('./assets/img/comp/gpubullet.png'),
            loadImage('./assets/img/comp/flyingalien.png'), // Ajouter flyingalien.png
            loadImage('./assets/img/comp/barrelshield.png'),
            loadImage('./assets/img/comp/mine.png'),
            loadImage('./assets/img/comp/flyingbullet.png'),
            loadImage('./assets/img/comp/nuke.png'),
            loadImage('./assets/img/comp/shieldIco.png')
        ]);

        return {
            playerImage: images[0],
            invaderImage: images[1],
            alienBulletImage: images[2],
            playerBulletImage: images[3],
            ufoImage: images[4],
            ufoBombImage: images[5],
            backgroundImage: images[6],
            heartImage: images[7],
            bonusInvaderImage: images[8],
            bonusInvader2Image: images[9],
            bonusInvader3Image: images[10],
            bonusImage: images[11],
            lifeupImage: images[12],
            gunlevelupImage: images[13],
            GPUupImage: images[14],
            waterupImage: images[15],
            targetImage: images[16],
            gpuBulletImage: images[17],
            flyingAlienImage: images[18], // Ajouter flyingalien.png
            playerImageShield: images[19],
            mineImage: images[20],
            flyingBulletImage: images[21],
            nukeBulletImage: images[22],
            shieldImage: images[23]
        };
    } catch (error) {
        console.error(error);
    }
};


const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 80,
    height: 50,
    color: '#00f',
    speed: 10,
    lives: 3,
    lastShotTime: 0 // Ajout pour suivre le dernier tir du joueur
};

const ufo = {
    x: -20,
    y: 50,
    width: 100,
    height: 60,
    speed: 6,
    direction: 1,
    active: false,
    lastShotTime: 0,
    ufoType: 'bombs', // 'bombs' ou 'flyingAliens'
    hasCrossedScreen: false,
    bonusCount: 0 // Ajouter cette propriété pour suivre le nombre de bonus lancés
};
const invaders = [];
const flyingAliens = [];
const bullets = [];
const ufoBombs = [];
const bonuses = [];
const powerBonusSize = {
    width: 25,
    height: 17
};

const levelBonusSize = {
    width: 25,
    height: 17
};

const gpuBonusSize = {
    width: 25,
    height: 27
};

const waterBonusSize = {
    width: 18,
    height: 26
};

const lifeBonusSize = {
    width: 25,
    height: 16
};

const mineBonusSize = {
    width: 40,
    height: 30
};


let invaderRows;
let invaderCols; // nb cols varie si mobile
let invaderWidth = 30;
let invaderHeight = 16;
const invaderSizeIncreasePercentage = 0.2; // Pourcentage d'augmentation de la taille
const invaderPadding = 10;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;

const gunPowerUpMin = 0;
const gunLevelUpMin = 0;
const gpuLevelUpMin = 0;
const waterLevelUpMin = 2;
const waterLevelUpThreshold = 3; // Seuil pour incrémenter le shield
let userInteracted = false;
let soundEnabled = false;
let introPlayed = false; // Ajouter une variable pour suivre si le son d'intro a déjà été joué
let currentSticker = null;
let currentEndStageSticker = null;

let gameStarted; // Variable de contrôle pour indiquer si le jeu a commencé
let bulletSpeed = 5;
let playerBulletSpeed = 5;
let isPaused;
let stage;
let stageCleared;
let images;
let invaderDirection = 1;
let invaderSpeedInit = 0.1;
let invaderSpeed;
let linesDescended;
let playerShootInterval;
const invaderShootIntervalInit = 1500;
let invaderShootInterval;
let gunPower;
let gunLevel;
let waterLevel;
let gpuLevel;
let shield;
let shieldActive;
let shieldStartTime = 0;
let nuke;
let nukeActive;
let shieldDuration;
let rightPressed;
let leftPressed;
let spacePressed;
let score;
let gameOver;
let globalShootDelay;
let bonusInvader;
let bonusTimer;
let bonusInterval;
let bonusInvader2;
let bonusInterval2;
let bonusTimer2;
let bonusInvader3;
let bonusInterval3;
let bonusTimer3;
let stickerTimeout;
let playerBlinking;
let blinkInterval;
let gunPowerUpCount;
let gunLevelUpCount;
let gpuLevelUpCount;
let waterLevelUpCount;
let gunPowerUpTot;
let gunLevelUpTot;
let gpuLevelUpTot;
let waterLevelUpTot;
let mineDelay;
let mineDropped;

let isMouseDown = false;
let isTouching = false;
let touchStartX = 0;
let lastTouchTime = 0;
let pauseTimer;
let lastDirectionChangeTime = 0;
const directionChangeCooldown = 500; // Temps d'attente en millisecondes avant de permettre un nouveau changement de direction



function getBulletsInGrid(x, y) {
    const gridX = Math.floor(x / BULLET_GRID_SIZE);
    const gridY = Math.floor(y / BULLET_GRID_SIZE);
    return bulletGrid[gridX][gridY];
}

function initState() {
    bulletSpeed = 5;
     playerBulletSpeed = 5;
    gameStarted = false;
    stageCleared = false;
    isPaused = false;
    player.lives=3;
    score = 0;
    gameOver = false;
    invaders.length = 0;
    bullets.length = 0;
    bonuses.length=0;
    ufoBombs.length = 0;
    invaderRows =5;
    invaderCols = 8; 
    invaderWidth = 30;
     invaderHeight = 16;
     lastDirectionChangeTime = 0;
    ufo.active = false;
    ufo.x = 0;
    ufo.y = 50;
    ufo.direction = 1;
    ufo.hasCrossedScreen = false;
    ufo.ufoType = 'bombs';
    linesDescended = 0;
    invaderSpeed = invaderSpeedInit;
    stageCleared = false;
    isPaused = false;
    stage = 1;
    gunPower = gunPowerUpMin;
    gunLevel = gunLevelUpMin;
    waterLevel = waterLevelUpMin;
    gpuLevel = gpuLevelUpMin;
    waterLevelUpCount = 0;
    shield = 0;
    shieldActive = false;
    shieldStartTime = 0;
    nuke = 0;
    nukeActive = false;
    shieldDuration = 4000;
    rightPressed = false;
    leftPressed = false;
    spacePressed = false;
    globalShootDelay = 0;
    bonusInvader = null;
    bonusTimer = null;
    // NRJ (speed)
    bonusInterval = 20000 + Math.random() * 40000;
    bonusInvader2 = null;
       // level + gpu
    bonusInterval2 = 30000 + Math.random() * 50000;
    bonusTimer2 = null;
    bonusInvader3 = null;
     // water
    bonusInterval3 = 15000 + Math.random() * 25000;
    bonusTimer3 = null;
    stickerTimeout = null;
    playerBlinking = false;
    blinkInterval = null;
    flyingAliens.length = 0;
    gunPowerUpCount = 0;
    gunLevelUpCount = 0;
    gpuLevelUpCount = 0;
    waterLevelUpCount = 0;
     gunPowerUpTot =0;
     gunLevelUpTot = 0;
     gpuLevelUpTot = 0;
     waterLevelUpTot= 0;
    playerShootInterval = 1000;
    invaderShootInterval = invaderShootIntervalInit;
    mineDelay=5000;
    mineDropped = false;

    adjustCanvasSize(); // Ajouter cette ligne pour ajuster la taille du canvas
    adjustInvaderSize(); // Ajouter cette ligne pour ajuster la taille des envahisseurs
   
    resetInvaders();
    resetSpeeds(); // Réinitialiser les vitesses
}



// ajout resize tab
function adjustTabletCanvasSize() {
   
    const gameScreen = document.getElementById('gameScreen');
    const gameScreenTitle= document.getElementById('gameScreenTitle');
    const margin = 96; // 0,5 pouces en pixels (1 pouce = 96 pixels)

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const canvasWidth = screenWidth - 2 * margin;
    const canvasHeight = screenHeight - 2 * margin;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    gameScreenTitle.style.display = 'none';
    // Centrer le canvas
    gameScreen.style.justifyContent = 'center';
    gameScreen.style.alignItems = 'center';
    gameScreen.style.padding = `${margin}px`;
}

function isTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIpad = /ipad/.test(userAgent);
    const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
    return isIpad || isAndroidTablet;
}



function adjustCanvasSize() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isTablet()){
        adjustTabletCanvasSize() ;
    }
    else if (isMobile && isPortrait) {
        canvas.width = window.innerWidth - 20; // Largeur du canvas avec une marge de 10px de chaque côté
        canvas.height = window.innerHeight - 80; // Hauteur du canvas avec une marge de 10px de chaque côté
    } else if (isMobile) {
        canvas.width = window.innerWidth - 20; // Largeur du canvas avec une marge de 10px de chaque côté
        canvas.height = window.innerHeight * 0.8 - 80; // 80% de la hauteur de l'écran avec une marge de 10px de chaque côté
    } else {
        canvas.width = 800;
        canvas.height = 600;
    }


    // Mettre à jour les positions et tailles des éléments en fonction des nouvelles dimensions du canvas
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    player.width = 80;
    player.height = 50;
    ufo.x = -20;
    ufo.y = 50;
    ufo.width = 100;
    ufo.height = 60;
}

function adjustInvaderSize() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
        invaderRows =7;
        invaderCols = 4; // Réduire le nombre de colonnes sur les mobiles
        invaderWidth = 20; // Réduire la largeur des envahisseurs
        invaderHeight = 12; // Réduire la hauteur des envahisseurs
    } else {
        invaderRows = 5;
        invaderCols = 8; // Nombre de colonnes par défaut
        invaderWidth = 30; // Largeur par défaut des envahisseurs
        invaderHeight = 16; // Hauteur par défaut des envahisseurs
    }
}
function updateLevelsAfterKill(){
    gunPower = gunPowerUpMin;
    gunLevel = gunLevelUpMin;
    waterLevel = waterLevelUpMin;
    gpuLevel = gpuLevelUpMin;

    updateGunPower(gunPower-1);
    updateGunLevel(gunLevel-1); // Réinitialiser le gunLevelUp
    //updateWaterLevel(waterLevel-1);
    updateGpuLevel(gpuLevel-1);
}
window.addEventListener('resize', adjustCanvasSize);
