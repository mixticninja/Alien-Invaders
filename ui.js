// ui.js

async function initGame() {
    images = await loadImages();
    initState();
    showWelcomeScreen();
    resetInvaders(); // Appeler resetInvaders au début du jeu
}

initGame();

startButton.addEventListener('touchstart', startGame);
restartButton.addEventListener('touchstart', restartGame);
restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);

        saveScoreBtn.addEventListener('click', () => {
   
            const name = nameInput.value;
            if (name) {
                saveHighScore(name, score);
                gameOverScoreInput.style.visibility = 'hidden';
                displayHighScores(gameOverScoreList);
            }else{
                alert('Please enter a name to save your score.');
            }
        });

introSound.addEventListener('loadeddata', () => {
    console.log('introSound chargé avec succès');
});

introSound.addEventListener('error', () => {
    console.error('Erreur de chargement de introSound');
});

soundButton.addEventListener('touchstart', toggleSound);
soundButton.addEventListener('click', toggleSound);
soundButton.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
soundButton2.addEventListener('touchstart', toggleSound);
soundButton2.addEventListener('click', toggleSound);
soundButton2.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';

function playIntroMusic() {
    if (soundEnabled && userInteracted && !introPlayed) {
    introSound.loop = true;
    introSound.play();
    introPlayed = true; // Marquer le son d'intro comme joué
    }
}

function stopIntroMusic() {
    introSound.pause();
    introSound.currentTime = 0;
    userInteracted=false;
    introPlayed = false;
}

function playBackgroundMusic() {
    stopIntroMusic();
    if (soundEnabled) {
        playSound.loop = true;
        playSound.play();
    }
}

function stopBackgroundMusic() {
    playSound.pause();
    playSound.currentTime = 0;
}

function playGameOverMusic() {
    if (soundEnabled) {
        overSound.loop = true;
        overSound.play();
        ufoSound.pause();
        ufoSound.currentTime = 0;
    }
}

function stopGameOverMusic() {
    overSound.pause();
    overSound.currentTime = 0;
}

function playPlayerExplodeSound() {
    if (soundEnabled) {
        playerExplodeSound.play();
    }
}

function ufoActivate(ufoActif) {
    ufo.active = ufoActif;
    if (soundEnabled && ufo.active) {
        ufoSound.loop = true;
        ufoSound.play();
    } else {
        ufoSound.pause();
        ufoSound.currentTime = 0;
    }
}

function playLifeUpSound() {
        if (soundEnabled) {
            document.getElementById('lifeUpSound').play(); // Jouer le son de récupération de vie
        }
}

function playGunPowerUpSound() {
    if (soundEnabled) {
        document.getElementById('gunPowerUpSound').play(); // Jouer le son 
    }
}
function playGunLevelUpSound() {
    if (soundEnabled) {
        document.getElementById('gunLevelUpSound').play(); // Jouer le son 
    }
}
function playGpuUpSound() {
    if (soundEnabled) {
        document.getElementById('gpuUpSound').play(); // Jouer le son 
    }
}

function playWaterUpSound() {
    if (soundEnabled) {
        document.getElementById('waterUpSound').play(); // Jouer le son 
    }
}
function playNewAlienSound() {
    if (soundEnabled) {
        document.getElementById('newAlienSound').play(); // Jouer le son 
    }
}
function playKillAlienSound() {
    if (soundEnabled) {
        document.getElementById('killAlienSound').play(); // Jouer le son 
    }
}
function playShieldWarnSound() {
    if (soundEnabled) {
        document.getElementById('shieldWarnSound').play(); // Jouer le son 
    }
}
function playNukeLaunchSound() {
    if (soundEnabled) {
        document.getElementById('nukeLaunchSound').play(); // Jouer le son 
    }
}

function playGameOverSound() {
    if (soundEnabled) {
        document.getElementById('gameOverSound').play(); // Jouer le son 
    }
}

function playNukedSound() {
    if (soundEnabled) {
        document.getElementById('nukedSound').play(); // Jouer le son 
    }
}

function playNukeAckSound() {
    if (soundEnabled) {
        document.getElementById('nukeAckSound').play(); // Jouer le son 
    }
}

function playShieldAckSound() {
    if (soundEnabled) {
        document.getElementById('shieldAckSound').play(); // Jouer le son 
    }
}

function playUfoExplodeSound() {
    if (soundEnabled) {
        document.getElementById('ufoExplodeSound').play(); // Jouer le son 
    }
}

function drawPlayer() {
    if (shieldActive) {
        if (playerBlinking) {
            if (Date.now() % 1000 < 250) {
                ctx.drawImage(images.playerImage, player.x, player.y, player.width, player.height);
            } else {
                ctx.drawImage(images.playerImageShield, player.x, player.y, player.width, player.height);
            }
        } else {
            ctx.drawImage(images.playerImageShield, player.x, player.y, player.width, player.height);
        }
    } else {
        ctx.drawImage(images.playerImage, player.x, player.y, player.width, player.height);
    }
}
function drawInvaders() {
  
        invaders.forEach(invader => {
            ctx.drawImage(invader.image, invader.x, invader.y, invader.width, invader.height);
        });
}


function drawBullets() {
    bullets.forEach(bullet => {
        if (bullet.isPlayerBullet) {
            ctx.save();
            ctx.translate(bullet.x, bullet.y);
            ctx.rotate(bullet.angle);
            ctx.drawImage(bullet.image, -bullet.width / 2, -bullet.height / 2, bullet.width * 4, bullet.height * 1.5);
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(bullet.x, bullet.y);
            ctx.rotate((bullet.angle / 2) - 1);
            ctx.drawImage(bullet.image, -bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
            ctx.restore();
        }
    });
}

function drawUfo() {
   
    if (ufo.active) {
        ctx.drawImage(images.ufoImage, ufo.x, ufo.y, ufo.width, ufo.height);
    }
}

function drawUfoBombs() {
    if (ufo.active) {
        ufoBombs.forEach(bomb => {
            ctx.drawImage(images.ufoBombImage, bomb.x, bomb.y, bomb.width, bomb.height);
        });
    }
}

function ufoDrop() {
    if (ufo.active && ufo.ufoType === 'bombs') {
        const currentTime = Date.now();
        if (currentTime - ufo.lastShotTime >= 500) { // Tirer toutes les secondes
            ufoBombs.push({
                x: ufo.x + ufo.width / 2,
                y: ufo.y + ufo.height,
                width: 10,
                height: 20
            });
            ufo.lastShotTime = currentTime;
            const bonusNum = Math.floor(Math.random() * 2); 
            // Lancer des bonus aléatoires
            if (ufo.bonusCount < bonusNum) {
                const bonusTypes = ['gunpower', 'gunlevelup', 'GPUup', 'waterup'];
                const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
                const randomSpeed = Math.floor(Math.random() * 6) + 1; // Vitesse aléatoire entre 1 et 6

                let bonusWidth = 25;
                let bonusHeight = 16;
               
                // Définir la taille du bonus en fonction de son type
                if (randomBonusType === 'gunpower') {
                    bonusWidth = powerBonusSize.width;
                    bonusHeight = powerBonusSize.height;
                    gunPowerUpTot++;
                } else if (randomBonusType === 'gunlevelup') {
                    gunLevelUpTot ++;
                    bonusWidth = levelBonusSize.width;
                    bonusHeight = levelBonusSize.height;
                } else if (randomBonusType === 'GPUup') {
                    gpuLevelUpTot ++;
                    bonusWidth = gpuBonusSize.width;
                    bonusHeight = gpuBonusSize.height;
                } else if (randomBonusType === 'waterup') {
                    waterLevelUpTot++;
                    bonusWidth = waterBonusSize.width;
                    bonusHeight = waterBonusSize.height;
                }

                bonuses.push({
                    x: ufo.x + ufo.width / 2,
                    y: ufo.y + ufo.height,
                    width: bonusWidth,
                    height: bonusHeight,
                    type: randomBonusType,
                    speed: randomSpeed
                });
                ufo.bonusCount++;
            }
        }
    }

    if (!mineDropped && flyingAliens.length === 0 && ufo.active && ufo.ufoType === 'flyingAliens') {
        // Vérifier la position x de l'UFO avant de larguer les flyingAliens
        if (ufo.x >= 100 && ufo.x <= canvas.width - 100) {
            let numberOfFlyingAliens;
            if (stage === 1) {
                numberOfFlyingAliens = 1;
            } else if (stage >= 2 && stage <= 3) {
                numberOfFlyingAliens = Math.floor(Math.random() * 2) + 1; // Entre 1 et 2
            } else if (stage >= 4 && stage <= 5) {
                numberOfFlyingAliens = Math.floor(Math.random() * 3) + 1; // Entre 1 et 4
            } else {
                numberOfFlyingAliens = Math.floor(Math.random() * 5) + 1; // Entre 1 et 5
            }

            for (let i = 0; i < numberOfFlyingAliens; i++) {

                let angle;
                const segment = Math.floor(Math.random() * 3); // Choisir un segment parmi les trois possibles
                if (segment === 0) {
                    angle = Math.random() * Math.PI / 2; // Segment [0, π/2]
                } else if (segment === 1) {
                    angle = Math.PI / 2 + Math.random() * Math.PI / 2; // Segment [π/2, π]
                } else {
                    angle = Math.PI + Math.random() * Math.PI / 2; // Segment [π, 3π/2]
                }
                flyingAliens.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height / 4,
                    width: 30,
                    height: 30,
                    speed: 2,
                    angle: angle,
                    lastShotTime: 0,
                    image: images.flyingAlienImage
                });
                playNewAlienSound();
            }
            
            if (!mineDropped) {
                const randomSpeed = Math.floor(Math.random() * 5) + 1; // Vitesse aléatoire entre 1 et 5
                const randomX = Math.random() * (canvas.width - 50); // Position X aléatoire
                bonuses.push({
                    x: randomX,
                    y: ufo.y + ufo.height,
                    width: mineBonusSize.width,
                    height: mineBonusSize.height,
                    type: 'mine',
                    speed: randomSpeed,
                    image: images.mineImage // Assurez-vous que l'image de la mine est chargée dans images.mineImage
                });
                mineDropped = true; // Marquer que la mine a été larguée
            }
        }
    }
}


// ui.js

function nukeExplode(invader, invaderIndex) {
    handleBonusCount(invader); // exploded bonus are counted as totals
    const explosionFrames = 10; // Reduced number of frames
    let frame = 0;

    function drawExplosion() {
        if (frame < explosionFrames) {
            ctx.save();
            ctx.globalAlpha = 1 - (frame / (explosionFrames - 2)); // Rendre l'explosion plus transparente au fil du temps
            // Créer un gradient radial pour l'effet d'explosion
            const gradient = ctx.createRadialGradient(
                invader.x + invader.width / 2,
                invader.y + invader.height / 2,
                0,
                invader.x + invader.width / 2,
                invader.y + invader.height / 2,
                50 + frame * 2
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 1)'); // Couleur centrale
            gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.7)'); // Couleur intermédiaire
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)'); // Couleur extérieure
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(invader.x + invader.width / 2, invader.y + invader.height / 2, 25 + frame * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            frame++;
            requestAnimationFrame(drawExplosion);
        } else {
            // Supprimer l'invader après l'explosion
            invaders.splice(invaderIndex, 1);
            // Détruire les invaders contigus avec un délai
            setTimeout(() => {
                destroyContiguousInvaders(invader);
            }, 50); // Délai de 50 ms entre chaque explosion
        }
    }

    drawExplosion();
}

function destroyContiguousInvaders(invader) {
    const proximityThreshold = 80; // Distance de proximité
    invaders.forEach((nearbyInvader, nearbyInvaderIndex) => {
        if (
            Math.abs(invader.x - nearbyInvader.x) < proximityThreshold &&
            Math.abs(invader.y - nearbyInvader.y) < proximityThreshold
        ) {
            playNukedSound();
            nukeExplode(nearbyInvader, nearbyInvaderIndex);
           /* setTimeout(() => {
                destroyContiguousInvaders(nearbyInvader); // Appeler récursivement pour les invaders contigus avec un délai
            }, 50); // Délai de 50 ms entre chaque explosion
            */
        }
    });
}
function ufoExplode() {
    ufoActivate(false);
    const ufoX = ufo.x; // Sauvegarder la position actuelle de l'UFO
    const ufoY = ufo.y; // Sauvegarder la position actuelle de l'UFO
    
    const explosionFrames = 20;
    let frame = 0;

    function drawExplosion() {
        if (frame < explosionFrames) {
            ctx.save();
            ctx.globalAlpha = 1 - (frame / (explosionFrames-5)); // Rendre l'explosion plus transparente au fil du temps
              // Créer un gradient radial pour l'effet d'explosion
              const gradient = ctx.createRadialGradient(
                ufoX+ ufo.width/2 ,
                ufoY+ ufo.height/2,
                0,
                ufoX + ufo.width /2,
                ufoY + ufo.height/2,
                50 + frame * 2
            );
            gradient.addColorStop(0, 'rgb(253, 137, 28)'); // Couleur centrale
            gradient.addColorStop(0.5, 'rgba(98, 0, 255, 0.8)'); // Couleur intermédiaire
            gradient.addColorStop(1, 'rgba(56, 3, 3, 0.53)'); // Couleur extérieure
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(ufoX + ufo.width/2 , ufoY + ufo.height /2, 25 + frame * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            frame++;
            requestAnimationFrame(drawExplosion);
        } else {
          
            // Si l'UFO est de type 'bombs', lancer un nouveau bonus
            if (ufo.ufoType === 'bombs') {
                let bonusPB = Math.random();
                const randomSpeed = Math.floor(Math.random() * 5) + 1; // Vitesse aléatoire entre 1 et 5
            if (bonusPB>0.75){
                bonuses.push({
                    x: ufoX + ufo.width / 2,
                    y: ufoY + ufo.height,
                    width: lifeBonusSize.width,
                    height: lifeBonusSize.height,
                    type: 'lifeup',
                    speed: randomSpeed
                });
            }else{
                if (!mineDropped) {
                    const randomSpeed = Math.floor(Math.random() * 5) + 1; // Vitesse aléatoire entre 1 et 5
                    const randomX = Math.random() * (canvas.width - 50); // Position X aléatoire
                    bonuses.push({
                        x: randomX,
                        y: ufo.y + ufo.height,
                        width: mineBonusSize.width,
                        height: mineBonusSize.height,
                        type: 'mine',
                        speed: randomSpeed,
                        image: images.mineImage // Assurez-vous que l'image de la mine est chargée dans images.mineImage
                    });
                    mineDropped = true; // Marquer que la mine a été larguée
                }

            }
           
            }
            
        }
    }

    drawExplosion();
    playUfoExplodeSound();
      // Réinitialiser la soucoupe après l'explosion
      resetUfo();
}


function bonusZigZag(bonus){
    if (!bonus.direction) {
        bonus.direction = 1; // Initialiser la direction à 1 (vers la droite)
    }

    if (!bonus.lastDirectionChangeTime) {
        bonus.lastDirectionChangeTime = Date.now(); // Initialiser le temps du dernier changement de direction
    }

    const currentTime = Date.now();
    if (currentTime - bonus.lastDirectionChangeTime >= (Math.random()*600 ) +Math.floor(1000/bonus.speed) + 100*stage) {
        bonus.direction *= -1; // Inverser la direction
        bonus.lastDirectionChangeTime = currentTime; // Mettre à jour le temps du dernier changement de direction
    }

    bonus.x += bonus.direction; // Déplacement horizontal régulier
}

function moveBonuses() {
    if (isPaused) return;
    bonuses.forEach((bonus, bonusIndex) => {
        bonus.y += bonus.speed; // Utiliser la vitesse de descente du bonus

  // Ajouter un décalage horizontal régulier pour les bonus 
    if (stage<3){
        if (bonus.type === 'lifeup' || bonus.type === 'mine') {
            bonusZigZag(bonus);
        }
    }else{
            bonusZigZag(bonus);       
    }
   
    if (bonus.y > player.y +player.height) {
        if (bonus.type === 'mine' ) {
            bonus.y = player.y; // Fixer la mine à la bordure basse
            bonus.speed = 0; // Arrêter la mine
            bonus.startTime = Date.now(); // Enregistrer le temps de début
        }
    }

        // Vérifier si le bonus sort de l'écran
    if (bonus.y > canvas.height) {

           
            bonuses.splice(bonusIndex, 1);
            // Diminuer la valeur du bonus correspondant si la valeur est supérieure à la valeur minimale
            if (bonus.type === 'gunpower' && gunPower > gunPowerUpMin) {
                updateGunPower(gunPower - 1);
            } else if (bonus.type === 'gunlevelup' && gunLevel > gunLevelUpMin) {
                updateGunLevel(gunLevel - 1);
            } else if (bonus.type === 'GPUup' && gpuLevel > gpuLevelUpMin) {
                updateGpuLevel(gpuLevel - 1);
            } else if (bonus.type === 'waterup' && waterLevel > waterLevelUpMin) {
                updateWaterLevel(waterLevel - 1);
            }
        }

        if (bonus.type === 'mine' && bonus.startTime && Date.now() - bonus.startTime >= mineDelay) {
            bonuses.splice(bonusIndex, 1); // Supprimer la mine après 20 secondes
        }
    });
}

function explodeMine(bonusIndex) {
    const mine = bonuses[bonusIndex];
    const explosionFrames = 20;
    let frame = 0;


    function drawExplosion() {
        if (frame < explosionFrames) {
            ctx.save();
            ctx.globalAlpha = 1 - (frame / explosionFrames); // Rendre l'explosion plus transparente au fil du temps
              // Créer un gradient radial pour l'effet d'explosion
              const gradient = ctx.createRadialGradient(
                mine.x + mine.width / 2,
                mine.y + mine.height / 2,
                0,
                mine.x + mine.width / 2,
                mine.y + mine.height / 2,
                50 + frame * 2
            );
            gradient.addColorStop(0, 'rgb(0, 255, 115)'); // Couleur centrale
            gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.7)'); // Couleur intermédiaire
            gradient.addColorStop(1, 'rgba(76, 0, 255, 0.53)'); // Couleur extérieure
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mine.x + mine.width / 2, mine.y + mine.height / 2, 20 + frame * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            frame++;
            requestAnimationFrame(drawExplosion);
        } 
    }

    drawExplosion();
    mineDropped = false;
}

function drawBonuses() {
    bonuses.forEach(bonus => {
        if (bonus.type === 'lifeup') {
            ctx.drawImage(images.lifeupImage, bonus.x, bonus.y, bonus.width, bonus.height);
        } else if (bonus.type === 'gunlevelup') {
            ctx.drawImage(images.gunlevelupImage, bonus.x, bonus.y, bonus.width, bonus.height);
        } else if (bonus.type === 'GPUup') {
            ctx.drawImage(images.GPUupImage, bonus.x, bonus.y, bonus.width, bonus.height);
        } else if (bonus.type === 'waterup') {
            ctx.drawImage(images.waterupImage, bonus.x, bonus.y, bonus.width, bonus.height);
        } else if (bonus.type === 'mine') {
        ctx.drawImage(images.mineImage, bonus.x, bonus.y, bonus.width, bonus.height);
        } else {
            ctx.drawImage(images.bonusImage, bonus.x, bonus.y, bonus.width, bonus.height);
        }
    });
}




function drawScoreOverlay() {
   

    let xdecay=0;
    let cumul=0;
    for (let i = 0; i < player.lives; i++) {
        xdecay = 8 + i * 20;
        ctx.drawImage(images.heartImage, xdecay, canvas.height - 30, 20, 20);
    }
    cumul= 28+(player.lives-1)*20;
    for (let j = 0; j < shield; j++) {

        xdecay = 10 + j * 20;
        xdecay+=cumul;
        ctx.drawImage(images.shieldImage, xdecay, canvas.height - 30, 20, 20);
    }

    cumul+=  28+(shield-1) *20;
    for (let j= 0; j < nuke; j++) {
        xdecay = 10 + j * 20;
        xdecay+=cumul;
        ctx.drawImage(images.nukeBulletImage, xdecay, canvas.height - 30, 20, 20);
    }
    ctx.font = '14px "Press Start 2P", cursive';
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('1P: ' + score, canvas.width - 150, canvas.height - 10);

}

function showGameOverScreen() {
   
    exitFullscreen(); // Quitter le mode plein écran
    gameOver=false;
    gameStarted = false; 
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.visibility = 'visible';

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const isTopScore = highScores.length < 5 || score > highScores[highScores.length - 1].score;

    if (isTopScore) {
        gameOverScoreInput.style.visibility = 'visible';
      
    } else {
        gameOverScoreInput.style.visibility = 'hidden';
    }
   
    stopBackgroundMusic(); // Arrêter la musique de fond
    playGameOverMusic(); // Jouer la musique de fin de partie
    displayHighScores(gameOverScoreList); // Afficher les meilleurs scores sur l'écran de fin de partie
}

function resetSpeeds() {
    invaderSpeed = invaderSpeedInit;
    bulletSpeed = 5;
    playerBulletSpeed = 5;
    ufo.speed = 6;
    flyingAliens.forEach(flyingAlien => {
        flyingAlien.speed = 2;
    });
}

function restartGame() {
    initState();
    resetInvaders();
    resetSpeeds(); // Réinitialiser les vitesses
    gameScreen.style.display = 'flex';
    gameOverScreen.style.visibility = 'hidden';
    playBackgroundMusic(); // Jouer la musique de fond
    stopGameOverMusic(); // Arrêter la musique de fin de partie
    const gameElement = document.getElementById('gameScreen');
    enterFullscreen(gameElement);
   // enterFullscreen(); // Mettre le mode plein écran
    draw();
}

function startGame() {
    initState();
    welcomeScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    playBackgroundMusic(); // Jouer la musique de fond au démarrage
    stopGameOverMusic();
    stopIntroMusic(); // Arrêter la musique d'intro
    const gameElement = document.getElementById('gameScreen');
    enterFullscreen(gameElement);
   // enterFullscreen(); // Mettre le mode plein écran
    draw();
}

async function enterFullscreen(element) {
    try {
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            await element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            await element.msRequestFullscreen();
        }
    } catch (error) {
        console.error('Fullscreen request denied', error);
    }
}


function exitFullscreen() {
    try {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari et Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
} catch (error) {
    console.error('Fullscreen exit request denied', error);
}
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.backgroundImage, 0, 0, canvas.width, canvas.height);// Dessiner l'image de fond
    drawPlayer();
    drawInvaders();
    drawBullets();
    drawUfo();
    drawUfoBombs();
    drawBonuses();
    drawFlyingAliens();
    moveInvaders();
    moveUfo();
    moveBonuses();
    moveFlyingAliens();
    movePlayer();
    moveBullets();
    ufoDrop();
    moveUfoBombs();
    invaderShoot();
    flyingAlienShoot(); 
    checkCollisions();
    if (spacePressed || isMouseDown || isTouching) {
        playerShoot();
    }
    drawScoreOverlay();
    drawStickerOverlay();
    if (isPaused) {
        if (stageCleared) {
            let stickerText;
            let gunPowerPc = (gunPowerUpTot===0) ? 100 : Math.round((gunPowerUpCount*100)/gunPowerUpTot);
            let gunLevelPc =(gunLevelUpTot===0) ? 100 : Math.round((gunLevelUpCount*100)/gunLevelUpTot);
            let waterLevelPc = (waterLevelUpTot===0) ? 100 : Math.round((waterLevelUpCount*100)/waterLevelUpTot);
            let gpuLevelPc =(gpuLevelUpTot===0) ? 100 : Math.round((gpuLevelUpCount*100)/gpuLevelUpTot);
            if (gameOver) {
                playGameOverSound();
                remainingBonusCount();
                stickerText = [
                    `Mission Failed !`,
                    `Score: ${score}`,
                    `Recover  %`,
                    `Power: ${gunPowerPc } %`,
                    `Gun :  ${gunLevelPc } %`,
                    `Water: ${waterLevelPc } %`,
                    `GPU :  ${ gpuLevelPc} %`
                ];

                ctx.font = '14px "Press Start 2P", cursive';
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                let yOffset = canvas.height / 2 - (stickerText.length * 20) / 2;
                stickerText.forEach((line, index) => {
                    if (line.startsWith('Mission Failed !')) {
                        ctx.fillStyle = '#fb00a7'; // Red color for "Mission Failed!"
                    } else if (line.startsWith('Power') && gunPowerPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Power if level < 1
                    } else if (line.startsWith('Gun') && gunLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Gun if level < 1
                    } else if (line.startsWith('Water') && waterLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Water if level < 1
                    } else if (line.startsWith('GPU') && gpuLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for GPU if level < 1
                    } else {
                        ctx.fillStyle = '#00ff00'; // Green color for other text
                    }
                    ctx.fillText(line, canvas.width / 2 - 100, yOffset + index * 20);
                });
                //  requestAnimationFrame(draw);

                return;
            } else {
                stickerText = [
                    `Stage ${stage} Cleared! ` , 
                    `Score: ${score}`,
                    `Reco:    lvl-stat`,
                    `Power:    ${gunPower}-${gunPowerPc } %`,
                    `Gun :     ${gunLevel}-${gunLevelPc } %`,
                    `Water:    ${waterLevel}-${waterLevelPc } %`,
                    `GPU :     ${gpuLevel}-${ gpuLevelPc} %`
                ];

                ctx.font = '14px "Press Start 2P", cursive';
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                let yOffset = canvas.height / 2 - (stickerText.length * 20) / 2;
                stickerText.forEach((line, index) => {
                    if (line.startsWith('Mission Failed !')) {
                        ctx.fillStyle = '#fb00a7'; // Red color for "Mission Failed!"
                    } else if (line.startsWith('Power') && gunPowerPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Power if level < 1
                    } else if (line.startsWith('Gun') && gunLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Gun if level < 1
                    } else if (line.startsWith('Water') && waterLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for Water if level < 1
                    } else if (line.startsWith('GPU') && gpuLevelPc < 50) {
                        ctx.fillStyle = '#ff7300'; // Red color for GPU if level < 1
                    } else {
                        ctx.fillStyle = '#00ff00'; // Green color for other text
                    }
                    ctx.fillText(line, canvas.width / 2 - 100, yOffset + index * 20);
                });
                requestAnimationFrame(draw);
                return;
            }
        } else {
            ctx.font = '48px "Press Start 2P", cursive';
            ctx.fillStyle = '#ff0000';
            ctx.fillText('PAUSE', canvas.width / 2 - 100, canvas.height / 2);
            requestAnimationFrame(draw);
            return;
        }
    }
    
    requestAnimationFrame(draw);
}

function drawStickerOverlay(){
    if (currentSticker) {
        ctx.drawImage(currentSticker.image, canvas.width - 60, canvas.height - 200, currentSticker.width, currentSticker.height); // Positionner en bas à droite
        ctx.font = '10px "Press Start 2P", cursive';
        if (currentSticker.bonusApplied){
            ctx.fillStyle = '#00ff00';
        }else{
            ctx.fillStyle = '#ff0000';
        }
        
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(currentSticker.text, canvas.width - 60 + currentSticker.width + 5, canvas.height - 200 + currentSticker.height / 2 + 5); // Positionner le texte à droite de l'image

         // Afficher les images et les niveaux des autres bonus, en excluant l'image et le texte du bonus actuel
         const bonusInfo = [
            { image: images.bonusImage, text: `X${gunPower}`},
            { image: images.gunlevelupImage, text: `X${gunLevel}`},
            { image: images.waterupImage, text: `X${waterLevel}`},
            { image: images.GPUupImage, text: `X${gpuLevel}` }
        ];
        let yOffset = 30;
        bonusInfo.forEach(info => {
            if (info.image !== currentSticker.image) {
                ctx.drawImage(info.image, canvas.width - 60, canvas.height - 200 + yOffset, currentSticker.width, currentSticker.width); // Positionner l'image
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.fillStyle = '#e5fc3b'; // Couleur bleue pour les autres bonus
                ctx.fillText(info.text, canvas.width - 60 + currentSticker.width + 5, canvas.height - 200 + currentSticker.height / 2 + 5+ yOffset ); // Positionner le texte à droite de l'image
                yOffset+=30;
            }
        });


    }
}

function drawFlyingAliens() {
    flyingAliens.forEach(flyingAlien => {
            ctx.drawImage(flyingAlien.image, flyingAlien.x, flyingAlien.y, flyingAlien.width, flyingAlien.height);
    });
}

// Afficher les 5 meilleurs scores
function displayHighScores(listElement) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.sort((a, b) => b.score - a.score);
    listElement.innerHTML = '';
    highScores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name} - ${score.score}`;
        listElement.appendChild(li);
    });
}
function saveHighScore(name, score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 5)));
}

function endGame() {
    endStage();
    //showGameOverScreen();
}

function showWelcomeScreen() {
    welcomeScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    gameOverScreen.style.visibility = 'hidden';
    playIntroMusic(); // Jouer la musique d'intro
}

function toggleSound() {
    userInteracted = true;
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
        playIntroMusic();
        
    } else {
        soundButton.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
        stopIntroMusic();
        stopBackgroundMusic();
        stopGameOverMusic();
    }
}

showWelcomeScreen();



//  fin ajout resize tab

const cards = document.querySelectorAll('.card');
let currentCardIndex = 0;
let intervalId;

function showNextCard() {
    cards[currentCardIndex].classList.remove('active');
    cards[currentCardIndex].classList.add('right');

    currentCardIndex = (currentCardIndex + 1) % cards.length;

    cards[currentCardIndex].classList.add('active');
    cards[currentCardIndex].classList.remove('left');

    setTimeout(() => {
        cards[currentCardIndex].classList.remove('right');
    }, 1000);
}

function startCarousel() {
    intervalId = setInterval(() => {
        showNextCard();
    }, 4000); // 10 secondes de pause au centre + 2 secondes de transition
}

function stopCarousel() {
    clearInterval(intervalId);
}

cards[currentCardIndex].classList.add('active');
startCarousel();
