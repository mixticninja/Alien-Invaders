document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousedown', mouseDownHandler);
document.addEventListener('mouseup', mouseUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener('touchstart', touchStartHandler, { passive: false });
document.addEventListener('touchend', touchEndHandler);
document.addEventListener('touchmove', touchMoveHandler);
document.addEventListener('dblclick', doubleClickHandler);

const DOUBLE_TAP_THRESHOLD = 300; // Temps en millisecondes pour considérer un double tap
const PAUSE_DELAY = 1500; // Temps en millisecondes pour mettre en pause le jeu

const DOUBLE_PRESS_THRESHOLD = 500; // Temps en millisecondes pour considérer un double press
let lastSpacePressTime = 0;
let pauseStartTime = 0;
function keyDownHandler(e) {

if (isPaused && Date.now() - pauseStartTime >= 300) {
    
    if (stageCleared) {
            stageCleared = false;
            isPaused = false;
            stage++;
            invaderSpeed = invaderSpeedInit * stage; // Doubler la vitesse de déplacement des envahisseurs
            resetInvaders(); // Réinitialiser les envahisseurs
    }else{
        if (gameOver) {
            isPaused = false;
            showGameOverScreen();
        }
    }
}

    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        const currentTime = Date.now();
        if (currentTime - lastSpacePressTime < DOUBLE_PRESS_THRESHOLD && currentTime - lastSpacePressTime > DOUBLE_PRESS_THRESHOLD-300) {
            activateShield();
        }
        lastSpacePressTime = currentTime;
        spacePressed = true;
    } else if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused;
        if (isPaused) {
            stopBackgroundMusic();
            pauseStartTime = Date.now();
        } else {
            playBackgroundMusic();
        }
    } else if (e.key === 's' || e.key === 'S') {
        activateShield();
    }   // Annuler le timer de pause si une touche est enfoncée


   

   clearTimeout(pauseTimer);
   if (isPaused && Date.now() - pauseStartTime >= 500) {
        isPaused = false;
        pauseStartTime=0;
        playBackgroundMusic();
    }


}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
    }
    pauseTimer = setTimeout(() => {
        if (!isPaused && !spacePressed) { // Vérifier si le jeu n'est pas déjà en pause
            isPaused = true;
            pauseStartTime = Date.now();
            stopBackgroundMusic();
        }
    }, PAUSE_DELAY);
}


function getCanvasRelativeCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function mouseDownHandler(e) {
    if (stageCleared) {

        if (gameOver) {
            showGameOverScreen();
        }else{
            stageCleared = false;
            isPaused = false;
            stage++;
            invaderSpeed = invaderSpeedInit * stage; // Doubler la vitesse de déplacement des envahisseurs
            resetInvaders(); // Réinitialiser les envahisseurs
        } 
    }
    if(!gameStarted) return;
    isMouseDown = true;
    clearTimeout(pauseTimer); // Annuler le timer de pause
    isPaused = false;
    pauseStartTime=0;
    playBackgroundMusic();
  //  player.x = e.clientX - player.width / 2; // Centrer le joueur sur la position de la souris
}

function mouseUpHandler(e) {
    if(!gameStarted) return;
    isMouseDown = false;
    pauseTimer = setTimeout(() => {
        if (!isPaused) { // Vérifier si le jeu n'est pas déjà en pause
            isPaused = true;
            stopBackgroundMusic();
        }
    }, PAUSE_DELAY);
}


function mouseMoveHandler(e) {
    if(!gameStarted) return;
    const { x, y } = getCanvasRelativeCoords(e);
    if (isMouseDown) {
        player.x = x- player.width / 2; // Mettre à jour la position du joueur en fonction de la position de la souris
    }
}

function doubleClickHandler(e) {
    if(!gameStarted) return;
    
        activateShield();
    
}

function touchStartHandler(e) {
    if (stageCleared) {
        if (gameOver) {
            showGameOverScreen();
        } else {
            stageCleared = false;
            isPaused = false;
            stage++;
            invaderSpeed = invaderSpeedInit * stage; // Doubler la vitesse de déplacement des envahisseurs
            resetInvaders(); // Réinitialiser les envahisseurs
        }
    }
    if (!gameStarted) return;
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation de l'événement

    const touch = e.touches[0];
    const currentTime = new Date().getTime();

    if (currentTime - lastTouchTime < DOUBLE_TAP_THRESHOLD) {
        activateShield();
    }

    lastTouchTime = currentTime;
    isTouching = true;
    clearTimeout(pauseTimer); // Annuler le timer de pause
    isPaused = false;
}

function touchEndHandler(e) {
    if (e.target === nameInput || e.target === saveScoreBtn) {
        e.preventDefault();
    }
    if (!gameStarted) return;
    e.preventDefault();
    e.stopPropagation();
    isTouching = false;
    pauseTimer = setTimeout(() => {
        if (!isPaused) { // Vérifier si le jeu n'est pas déjà en pause
            isPaused = true;
            stopBackgroundMusic();
        }
    }, PAUSE_DELAY);
}

function touchMoveHandler(e) {
    if (gameOverScreen.style.display === 'flex') {
        e.preventDefault();
    }
    if (!gameStarted) return;
    const touch = e.touches[0];
    const { x } = getCanvasRelativeCoords(touch);
    if (isTouching) {
        player.x = x - player.width / 2; // Mettre à jour la position du joueur en fonction de la position du toucher
    }
   
}