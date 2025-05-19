// game.js



updatePlayerShootInterval();
function playerShoot() {

    if (nukeActive){
        if (bullets[bullets.length-1].isPlayerBullet){
            bullets.splice(bullets.length-1);
        }
        createPlayerNuke(player.x + player.width / 2,player.y,0);
        nukeActive = false;
        
    }
    let isGPUupActive = (gpuLevel > 0);
    if (Date.now() - player.lastShotTime >= playerShootInterval) {
        if (gunLevel === 0) {
            createPlayerBullet(player.x + player.width / 2,player.y,0);
        } else if (gunLevel === 1) {
            createPlayerBullet(player.x + player.width / 4,player.y,0);
            createPlayerBullet(player.x + 3 * player.width / 4,player.y,0);
        } else if (gunLevel >= 2) {

            const angles = [-Math.PI / 48, 0, Math.PI / 48] ;
            angles.forEach(angle => {
                createPlayerBullet(player.x + player.width / 2, player.y, angle);
            });
          
        } 
        
     /*   else if (gunLevel === 4) {
            for (let i = 0; i < 4; i++) {
                createPlayerBullet(player.x + player.width / 4 * (i + 1),player.y,0);
            }
        } else if (gunLevel >= 5) {
            const angles = [-Math.PI / 32, -Math.PI / 48, 0, Math.PI / 48, Math.PI / 32];
            angles.forEach(angle => {
                createPlayerBullet(player.x + player.width / 2,player.y,angle);
            });
        }*/

        player.lastShotTime = Date.now();
        if (soundEnabled) {
            laserSound.play(); // Jouer le son de tir du joueur
        }
    }
}

function createPlayerBullet(bx,by,bangle){

    let isGPUupActive = (gpuLevel > 0);
    bullets.push({
        x:bx,
        y:by,
        width: isGPUupActive ? 3 : 2,
        height: isGPUupActive ? 15 : 10, // Augmenter la hauteur si GPUup est actif
        color: '#fff',
        isPlayerBullet: true,
        angle: bangle, // Angle par défaut
        image: isGPUupActive ? images.gpuBulletImage : images.playerBulletImage, // Initialiser la propriété image
        guidance: gpuLevel === 2, // Initialiser la propriété guidance
        initialDirection: rightPressed ? 1 : leftPressed ? -1 : 0, // Initialiser la direction initiale
        speed: playerBulletSpeed, // Vitesse initiale de la bullet
        friction: 0.01 // Force de frottement
    });
}


function createPlayerNuke(bx,by,bangle){
    bullets.push({
        x:bx,
        y:by,
        width: 4,
        height: 20, // Augmenter la hauteur si GPUup est actif
        color: '#fff',
        isPlayerBullet: true,
        type:'nuke',
        angle: bangle, // Angle par défaut
        image:  images.nukeBulletImage, // Initialiser la propriété image
        guidance: false, // Initialiser la propriété guidance
        initialDirection: rightPressed ? 1 : leftPressed ? -1 : 0, // Initialiser la direction initiale
        speed: playerBulletSpeed *1.5, // Vitesse initiale de la bullet
        friction: 0.01 // Force de frottement
    });
    nuke--;
}

function movePlayer() {
    if (isPaused) return;
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
}

function moveBullets() {
    if (isPaused) return;
    bullets.forEach(bullet => {
       
        if (bullet.isPlayerBullet) {
            if (bullet.guidance) {
                // Calculer l'influence du joueur sur la trajectoire de la bullet
                const influence = Math.max(0, 1 - (canvas.height - bullet.y) / canvas.height);
                const playerDirection = rightPressed ? 1 : leftPressed ? -1 : 0;
                bullet.x += (playerDirection * player.speed * influence * 0.15) * Math.cos(bullet.angle);
            }
            // Appliquer la force de frottement
            bullet.speed -= bullet.friction;
            bullet.speed = Math.max(0, bullet.speed); // Assurez-vous que la vitesse ne descend pas en dessous de 0

            bullet.y -= bullet.speed * Math.cos(bullet.angle);
            bullet.x += bullet.speed * Math.sin(bullet.angle);
        } else {
            bullet.x += bullet.speed * Math.cos(bullet.angle);
            bullet.y += bullet.speed * Math.sin(bullet.angle);
        }
  
    });
}

function moveUfo() {
    if (ufo.active) {
        ufo.x += ufo.speed * ufo.direction;

        // Vérifier si l'UFO atteint les bords de l'écran
        if (ufo.x + ufo.width >= canvas.width) {
            ufo.x = canvas.width - ufo.width; // Limiter la position à la bordure droite
            ufo.direction *= -1; // Changer de direction
            ufo.y += 10 * Math.random(); // Descendre légèrement
            // Changer de direction aléatoirement
            if (Math.random() < 0.8) {
                ufo.direction *= -1;
            }
            if (ufo.ufoType === 'flyingAliens') {
                ufo.hasCrossedScreen = true; // Marquer que l'UFO a traversé l'écran
            }
        } else if (ufo.x <= 0) {
            ufo.x = 0; // Limiter la position à la bordure gauche
            ufo.direction *= -1; // Changer de direction
            ufo.y += 10 * Math.random(); // Descendre légèrement
            // Changer de direction aléatoirement
            if (Math.random() < 0.8) {
                ufo.direction *= -1;
            }
            if (ufo.ufoType === 'flyingAliens') {
                ufo.hasCrossedScreen = true; // Marquer que l'UFO a traversé l'écran
            }
            // Désactiver l'UFO après avoir traversé l'écran
        if (ufo.ufoType === 'flyingAliens' && ufo.hasCrossedScreen) {
            ufoActivate(false);
            ufo.x = 0;
            ufo.y = 50;
        }
        }

        // Limiter la position verticale de l'UFO à la moitié du canvas
        if (ufo.y > canvas.height / 2) {
            ufo.y = canvas.height / 2;
        }
    }
}

function moveUfoBombs() {
    if (isPaused) return;
    ufoBombs.forEach(bomb => {
        bomb.y += 5;
    });
}

function resetUfo() {
    ufoActivate(false);
    //ufo.x = Math.random() * (canvas.width - ufo.width); // Position aléatoire horizontale
    ufo.x = -20; // Position verticale initiale
    ufo.y = 50; // Position verticale initiale
   // ufo.direction = Math.random() < 0.5 ? 1 : -1; // Direction aléatoire
   ufo.direction = 1;
    ufo.hasCrossedScreen =false;
    ufo.ufoType = 'bombs'; 
    linesDescended =0;
    
    ufo.bonusCount = 0; // Réinitialiser le compteur de bonus
}


function endStage() {

    if (! gameOver && ufo.active && ufo.ufoType === 'bombs') {
        // Si l'UFO de type 'bombs' est encore actif, ne pas terminer le stage
        return;
    }

    if (! gameOver && flyingAliens.length > 0) {
        // Si des flyingAliens sont encore actifs, ne pas terminer le stage
        return;
    }
    stageCleared = true;
    isPaused = true;
    mineDropped = false; // Réinitialiser la variable mineDropped
    resetUfo(); // Réinitialiser la position de l'UFO
    // Autres actions de fin de stage
}



function moveInvaders() {
    if (isPaused) return;

    if (invaders.length === 0) {
        if (!ufo.active ) {
            // Activer l'UFO pour larguer des bombes
            ufo.ufoType = 'bombs';
            ufo.x = 0;
            ufo.y = 50;
            ufo.direction = 1;
            ufoActivate(true);
        } 
        return;
    }
   
        let moveDown = false;
        let changeDirection = false;
    
        invaders.forEach(invader => {
            if (invader.x + invader.width >= canvas.width || invader.x <= 0) {
                changeDirection = true;
            }
            if (invader.y + invader.height >= canvas.height - player.height) {
                moveDown = true;
            }
        });
    
        if (changeDirection) {
            invaderDirection *= -1;
            linesDescended++;
            if (linesDescended >= 1 && linesDescended <= 6) {
                const randomChance = Math.random();
                const appearanceProbability = Math.min(0.1 + stage * 0.05, 0.5); // Probabilité d'apparition qui augmente avec les stages
                if (randomChance < appearanceProbability) {
                    ufo.ufoType = 'flyingAliens';
                    ufo.x = 0;
                    ufo.y = 10;
                    ufo.direction = 1;
                    ufoActivate(true);
                }
            }
        }
        invaders.forEach(invader => {
            invader.x += invaderSpeed * invaderDirection;
            if (moveDown) {
                invader.y += invaderHeight;
                if (invader.y + invader.height >= player.y) {
                    player.lives = 0;
                    gameOver = true;
                    endGame();
                }
            }
        });
    
        if (moveDown) {
            invaderSpeed *= 1.1; // Augmenter la vitesse des invaders après chaque descente
        }
    
}
function moveFlyingAliens() {
    if (isPaused) return;
    flyingAliens.forEach((flyingAlien, index) => {
        // Mettre à jour la position en fonction de l'angle et de la vitesse
        flyingAlien.x += flyingAlien.speed * Math.cos(flyingAlien.angle);
        flyingAlien.y += flyingAlien.speed * Math.sin(flyingAlien.angle);

        // Gérer les collisions avec les bords du canvas en laissant une marge de 10 pixels
        if (flyingAlien.x <= 10 || flyingAlien.x + flyingAlien.width >= canvas.width - 10) {
            // Rebondir horizontalement
            flyingAlien.angle = Math.PI - flyingAlien.angle;
        }
        if (flyingAlien.y <= 10 || flyingAlien.y + flyingAlien.height >= canvas.height - (canvas.height/3)) {
            // Rebondir verticalement
            flyingAlien.angle = -flyingAlien.angle;
        }

        // Assurer un mouvement à la fois en x et en y
        if (Math.abs(Math.cos(flyingAlien.angle)) < 0.1 || Math.abs(Math.sin(flyingAlien.angle)) < 0.1) {
            // Si l'angle est trop proche de l'axe horizontal ou vertical, ajuster l'angle
            flyingAlien.angle = Math.random() * 2 * Math.PI;
        }
    });
}

function remainingBonusCount(){
    invaders.forEach((invader, invaderIndex) => {
        handleBonusCount(invader);
    });
}
// counting bonus totals only
function handleBonusCount(invader) {
 
    const randomSpeed = Math.floor(Math.random() * 5) + 1; // Vitesse aléatoire entre 1 et 5
    if (invader.isBonus) {
    
        gunPowerUpTot++;   
    } else if (invader.isBonus2) {
        const randomBonus = Math.random();
        if (randomBonus < 0.66) {
           
            gunLevelUpTot ++;
        } else {
           
            gpuLevelUpTot ++;
        }
    } else if (invader.isBonus3) {
        waterLevelUpTot++;
    }
}

function handleBonusDrop(invader) {
 
    const randomSpeed = Math.floor(Math.random() * 5) + 1; // Vitesse aléatoire entre 1 et 5
    if (invader.isBonus) {
        bonuses.push({
            x: invader.x,
            y: invader.y,
            width: powerBonusSize.width,
            height: powerBonusSize.height,
            type: 'gunpower',
            speed: randomSpeed
        });
        gunPowerUpTot++;
        bonusInvader = null;
        clearTimeout(bonusTimer);
        bonusTimer = setTimeout(setBonusInvader, bonusInterval);
    } else if (invader.isBonus2) {
        const randomBonus = Math.random();
        if (randomBonus < 0.66) {
            bonuses.push({
                x: invader.x,
                y: invader.y,
                width: levelBonusSize.width,
                height: levelBonusSize.height,
                type: 'gunlevelup',
                speed: randomSpeed
            });
            gunLevelUpTot ++;
        } else {
            bonuses.push({
                x: invader.x,
                y: invader.y,
                width: gpuBonusSize.width,
                height: gpuBonusSize.height,
                type: 'GPUup',
                speed:randomSpeed
            });
            gpuLevelUpTot ++;
        }
        bonusInvader2 = null;
        clearTimeout(bonusTimer2);
        bonusTimer2 = setTimeout(setBonusInvader2, bonusInterval2);
    } else if (invader.isBonus3) {
        bonuses.push({
            x: invader.x,
            y: invader.y,
            width: waterBonusSize.width,
            height: waterBonusSize.height,
            type: 'waterup',
            speed: randomSpeed
        });
        waterLevelUpTot++;
        bonusInvader3 = null;
        clearTimeout(bonusTimer3);
        bonusTimer3 = setTimeout(setBonusInvader3, bonusInterval3);
    }
}

function showBonusSticker(image, text, width, height,bonusApplied) {
    clearTimeout(stickerTimeout);
    currentSticker = {
        image: image,
        text: text,
        width: width,
        height: height,
        duration: 3000 ,// Durée d'affichage du sticker en millisecondes
        bonusApplied :bonusApplied
    };

    stickerTimeout = setTimeout(() => {
        currentSticker = null;
    }, currentSticker.duration);
}



function checkCollisions() {
    if (isPaused) return;
    let isGPUupActive = (gpuLevel > 0);
    bullets.forEach((bullet, bulletIndex) => {
        let bulletHit = false;
        if (ufo.active) {
            if (
                bullet.isPlayerBullet &&
                bullet.x < ufo.x + ufo.width &&
                bullet.x + bullet.width > ufo.x &&
                bullet.y < ufo.y + ufo.height &&
                bullet.y + bullet.height > ufo.y
            ) {
                bullets.splice(bulletIndex, 1);
                ufo.active = false;
                ufoExplode();
                if (ufo.ufoType==='bombs'){
                    endStage(); 
                }
                 
            }
        }
        
        invaders.forEach((invader, invaderIndex) => {
            if (
                !bulletHit &&
                bullet.isPlayerBullet &&
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y
            ) {
                bulletHit = true;
                bullets.splice(bulletIndex, 1);

                if (bullet.type === 'nuke') {
                    nukeExplode(invader, invaderIndex);
                } else if (isGPUupActive) {
                    invaderKill(invader, invaderIndex);
                    const proximityThreshold = 80; // Distance de proximité
                    invaders.forEach((nearbyInvader, nearbyInvaderIndex) => {
                        if (
                            Math.abs(bullet.x - nearbyInvader.x) < proximityThreshold &&
                            Math.abs(bullet.y - nearbyInvader.y) < proximityThreshold
                        ) {
                            invaderKill(nearbyInvader, nearbyInvaderIndex);
                        }
                    });
                } else {
                    invaderKill(invader, invaderIndex);
                }
            }
        });

        flyingAliens.forEach((flyingAlien, flyingAlienIndex) => {
            if (
                !bulletHit &&
                bullet.isPlayerBullet &&
                bullet.x < flyingAlien.x + flyingAlien.width &&
                bullet.x + bullet.width > flyingAlien.x &&
                bullet.y < flyingAlien.y + flyingAlien.height &&
                bullet.y + bullet.height > flyingAlien.y
            ) {
                bulletHit = true;
                bullets.splice(bulletIndex, 1);
                flyingAlienKill(flyingAlien, flyingAlienIndex);
            }
        });

        bonuses.forEach((bonus, bonusIndex) => {
            if (bonus.type === 'mine') {
                if (
                    !bulletHit &&
                    bullet.isPlayerBullet &&
                    bullet.x < bonus.x + bonus.width &&
                    bullet.x + bullet.width > bonus.x &&
                    bullet.y < bonus.y + bonus.height &&
                    bullet.y + bullet.height > bonus.y
                ) {
                    bulletHit = true;
                    bullets.splice(bulletIndex, 1);
                    explodeMine(bonusIndex);
                    bonuses.splice(bonusIndex);
                }
            }
        });

        if (bullet.isPlayerBullet && bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }

        if (!bullet.isPlayerBullet && bullet.y > canvas.height) {
            bullets.splice(bulletIndex, 1);
        }

        if (
            !bullet.isPlayerBullet &&
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            bullets.splice(bulletIndex, 1);
            playerKill(1);
        }

       
    });

    if (ufo.active) {
        ufoBombs.forEach((bomb, bombIndex) => {
            if (
                bomb.x < player.x + player.width &&
                bomb.x + bomb.width > player.x &&
                bomb.y < player.y + player.height &&
                bomb.y + bomb.height > player.y
            ) {
                ufoBombs.splice(bombIndex, 1);
                playerKill(1);
            }

            if (bomb.y > canvas.height) {
                ufoBombs.splice(bombIndex, 1);
            }
        });
    }

    bonuses.forEach((bonus, bonusIndex) => {
        if (
            bonus.x < player.x + player.width &&
            bonus.x + bonus.width > player.x &&
            bonus.y < player.y + player.height &&
            bonus.y + bonus.height > player.y
        ) {
           addBonusLevel(bonus,bonusIndex);
            
            bonuses.splice(bonusIndex, 1);
        }
    });

    
   
        invaders.forEach(invader => {
            if (invader.y + invader.height >= player.y) {
                player.lives = 0;
                gameOver = true;
                endGame();
                return;
            }
        });
    
    

    if (shieldActive ) {
        if (!blinkInterval && Date.now() - shieldStartTime >= shieldDuration - 2000) {
            blinkPlayer();
        }
        if (Date.now() - shieldStartTime >= shieldDuration) {
            deactivateShield();
        }
    }

   
}
function flyingAlienKill(flyingAlien, flyingAlienIndex) {
    flyingAliens.splice(flyingAlienIndex, 1);
    score += 50;
    explode(flyingAlien);
    playKillAlienSound();
}


function blinkPlayer() {
    let blinkCount = 0;
    const blinkDuration = 2000; // Durée totale du clignotement en millisecondes
    const blinkIntervalDuration = 250; // Intervalle entre chaque changement d'image en millisecondes

    playerBlinking = true;

    blinkInterval = setInterval(() => {
        blinkCount++;
        if (blinkCount >= blinkDuration / blinkIntervalDuration) {
            clearInterval(blinkInterval);
            playerBlinking = false;
          
        }
    }, blinkIntervalDuration);
}




function activateShield() {
    if (nuke>0){
        playNukeLaunchSound();
        nukeActive =true;
    }else{
        if (shield > 0) {
            playShieldWarnSound();
            shield--;
            shieldActive = true;
            shieldStartTime = Date.now();
        }
    }
}
function deactivateShield() {
    playShieldWarnSound();
    playerBlinking=false;
    shieldActive = false;
    shieldStartTime = 0;
    
}


function playerKill(livesTaken){
    if (!shieldActive) {
        player.lives -= livesTaken;
        if (player.lives <= 0) {
            playerExplode();
            gameOver = true;
            endGame();
        } else {
            playerExplode();
        }
    }
}

function invaderKill(invader,invaderIndex){
    handleBonusDrop(invader);
    score += 10;
    explode(invader);
    if (soundEnabled) {
        explosionSound.play(); // Jouer le son d'explosion
    }
     invaders.splice(invaderIndex, 1);
}


function updateInvaderShootInterval() {
    // Réduire la cadence de tir des invaders à chaque stage
    invaderShootInterval = Math.max(200, invaderShootIntervalInit - stage  * 100);
}


function resetInvaders() {
    if (!ufo.active) {

        flyingAliens.splice(0,flyingAliens.length);
        //bonuses.splice(0,bonuses.length);
        bullets.splice(0,bullets.length);

        const maxInvaderWidth = invaderWidth + (invaderRows - 1) * invaderWidth * invaderSizeIncreasePercentage;
        const totalColumnWidth = invaderCols * (maxInvaderWidth + invaderPadding) - invaderPadding;
        const startX = (canvas.width - totalColumnWidth) / 2;
        invaders.length = 0; // Vider le tableau des envahisseurs
        for (let c = 0; c < invaderCols; c++) {
            for (let r = 0; r < invaderRows; r++) {
                let newWidth = invaderWidth + (r * invaderWidth * invaderSizeIncreasePercentage); // Augmenter la taille en fonction de la ligne
                let newHeight = invaderHeight + (r * invaderHeight * invaderSizeIncreasePercentage); // Augmenter la taille en fonction de la ligne
                const x = startX + c * (maxInvaderWidth + invaderPadding) + maxInvaderWidth / 2 - newWidth / 2;
                const y = r * (newHeight + invaderPadding) + invaderOffsetTop;
                invaders.push({
                    x: x,
                    y: y,
                    width: newWidth,
                    height: newHeight,
                    color: '#f00',
                    lastShotTime: 0,
                    row: r,
                    isBonus: false,
                    image: images.invaderImage // Initialiser la propriété image
                });
            }
        }
        setBonusInvader();
        setBonusInvader2();
        setBonusInvader3();
        gameStarted = true; 
        updateInvaderShootInterval(); // Mettre à jour la cadence de tir des invaders
    }
}




function setBonusInvader() {
    if (invaders.length > 0) {
        if (bonusInvader) {
            bonusInvader.isBonus = false; // Désactiver le bonus invader précédent
            bonusInvader.image = images.invaderImage;
        }
        const randomIndex = Math.floor(Math.random() * invaders.length);
        bonusInvader = invaders[randomIndex];
        bonusInvader.isBonus = true;
        bonusInvader.image = images.bonusInvaderImage;
        bonusTimer = setTimeout(setBonusInvader, bonusInterval);
    }
}
function setBonusInvader2() {
    if (invaders.length > 0) {
        if (bonusInvader2) {
            bonusInvader2.isBonus2 = false; // Désactiver le bonus invader précédent
            bonusInvader2.image = images.invaderImage;
        }
        const randomIndex = Math.floor(Math.random() * invaders.length);
        bonusInvader2 = invaders[randomIndex];
        bonusInvader2.isBonus2 = true;
        bonusInvader2.image = images.bonusInvader2Image;
        bonusTimer2 = setTimeout(setBonusInvader2, bonusInterval2);
    }
}

function setBonusInvader3() {
    if (invaders.length > 0) {
        if (bonusInvader3) {
            bonusInvader3.isBonus3 = false; // Désactiver le bonus invader précédent
            bonusInvader3.image = images.invaderImage;
        }
        const randomIndex = Math.floor(Math.random() * invaders.length);
        bonusInvader3 = invaders[randomIndex];
        bonusInvader3.isBonus3 = true;
        bonusInvader3.image = images.bonusInvader3Image;
        bonusTimer2 = setTimeout(setBonusInvader3, bonusInterval3);
    }
}



function explode(alien) {
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(alien.x + alien.width / 2, alien.y + alien.height / 2, alien.width/2, 0, Math.PI * 2);
    ctx.fill();


}

function invaderShoot() {
    const currentTime = Date.now();
    if (currentTime - globalShootDelay >= invaderShootInterval) {
        const frontRowInvaders = invaders.filter(invader => invader.row === 0);
        const randomInvader = frontRowInvaders[Math.floor(Math.random() * frontRowInvaders.length)];
        if (randomInvader) {
            const dx = player.x + player.width / 2 - (randomInvader.x + randomInvader.width / 2);
            const dy = player.y - (randomInvader.y + randomInvader.height);
            const angle = Math.atan2(dy, dx);

            bullets.push({
                x: randomInvader.x + randomInvader.width / 2,
                y: randomInvader.y + randomInvader.height,
                width: 4,
                height: 15,
                color: '#f00',
                isPlayerBullet: false,
                angle: angle,
                speed: bulletSpeed,
                image: images.alienBulletImage
            });
            globalShootDelay = currentTime + Math.random() * 500 + 500;
        }
    }
}


function flyingAlienShoot() {
    const currentTime = Date.now();
    flyingAliens.forEach(flyingAlien => {
        if (currentTime - flyingAlien.lastShotTime >= 1000) { // Tirer en continu
            const dx = player.x + player.width / 2 - (flyingAlien.x + flyingAlien.width / 2);
            const dy = player.y - (flyingAlien.y + flyingAlien.height);
            const angle = Math.atan2(dy, dx);

            bullets.push({
                x: flyingAlien.x + flyingAlien.width / 2,
                y: flyingAlien.y + flyingAlien.height,
                width: 4, // Deux fois la largeur de alienBulletImage
                height: 15, // Deux fois la hauteur de alienBulletImage
                isPlayerBullet: false,
                angle: angle,
                speed: bulletSpeed,
                image: images.flyingBulletImage // Utiliser la bonne image pour les balles des flyingAliens
            });
            flyingAlien.lastShotTime = currentTime;
        }
    });
}


// Fonction pour l'animation d'explosion du joueur
function playerExplode() {
    playPlayerExplodeSound(); // Jouer le son d'explosion du joueur
    const explosionFrames = 20;
    let frame = 0;

    function drawExplosion() {
        if (frame < explosionFrames) {
            ctx.save();
            ctx.globalAlpha = 1 - (frame / explosionFrames); // Rendre l'explosion plus transparente au fil du temps
              // Créer un gradient radial pour l'effet d'explosion
              const gradient = ctx.createRadialGradient(
                player.x + player.width / 2,
                player.y + player.height / 2,
                0,
                player.x + player.width / 2,
                player.y + player.height / 2,
                50 + frame * 2
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 1)'); // Couleur centrale
            gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.7)'); // Couleur intermédiaire
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)'); // Couleur extérieure
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 40 + frame * 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            frame++;
            requestAnimationFrame(drawExplosion);
        } else {
            // Réinitialiser le joueur après l'explosion
            player.x = canvas.width / 2;
            player.y = canvas.height - 100;
            updateLevelsAfterKill();
          
        }
    }

    drawExplosion();
}

function addBonusLevel(bonus,bonusIndex) {

    let bonusApplied = false;
    switch (bonus.type){
        
        case "gunpower":
            //nrj up
            // check conditions : -1 water apply
            bonusApplied = (waterLevel > 0);
            if (bonusApplied){
                // debit
                updateWaterLevel(waterLevel-1)
                // bonus up
                updateGunPower(gunPower+1);
            }
            gunPowerUpCount++;
            playGunPowerUpSound();
            showBonusSticker(images.bonusImage, `X${gunPower}`, bonus.width , bonus.height,bonusApplied );
            break;
        case "gunlevelup":
             //weapon up
            // check conditions : -2 nrj apply
           
            bonusApplied = (gunPower > 0);
            if (bonusApplied){
                 // debit
                updateGunPower(gunPower-1);
                // bonus up
                updateGunLevel(gunLevel+1);
            }
            gunLevelUpCount++;
            playGunLevelUpSound();
            showBonusSticker(images.gunlevelupImage, `X${gunLevel}`, bonus.width , bonus.height,bonusApplied );
            break;    
       
        case "GPUup":
             //GPU up
            // check conditions : -2 nrj, -1 water, -2 weapon apply
            bonusApplied = (gunPower > 1 && waterLevel > 0 && gunLevel > 0);
            if (bonusApplied){
                 // debit
                 updateGunPower(gunPower-2);
                 updateWaterLevel(waterLevel-1);
                 updateGunLevel(gunLevel-1);
                 // bonus up
                 updateGpuLevel(gpuLevel+1)
            }
            gpuLevelUpCount++;
            playGpuUpSound();
            showBonusSticker(images.GPUupImage, `X${gpuLevel}`, bonus.width , bonus.height,bonusApplied );
            break;
        case "waterup":
            bonusApplied=true;
            updateWaterLevel(waterLevel+1)
            waterLevelUpCount++;
            playWaterUpSound();
            showBonusSticker(images.waterupImage, `X${waterLevel}`, bonus.width , bonus.height,bonusApplied );
            break;
        case "mine":
            explodeMine(bonusIndex);
            playerKill(1); // Faire exploser le joueur
            break;
        case "lifeup":
            bonusApplied=true;
            player.lives++; // Ajouter une vie
            playLifeUpSound();
            showBonusSticker(images.lifeupImage, `X${player.lives}`, bonus.width , bonus.height,bonusApplied );
                break;
        default:
            console.log(`Sorry, we are out of ${bonusType}.`);
    }
}



function updatePlayerShootInterval() {
    playerShootInterval = 1000 - (gunPower - 1) * 200;
    playerShootInterval = Math.max(100, playerShootInterval); // Assurez-vous que la cadence de tir ne descend pas en dessous de 100 ms
}

function updateGunPower(gunPowerValue) {
    
    gunPower = Math.max(0, Math.min(4, gunPowerValue)); 
    updatePlayerShootInterval();
}

function updateGunLevel(gunLevelValue) {
   
    if (gunLevelValue > gunLevel) {
        if ((gunLevelUpCount%5)===0){
            nuke++;
            playNukeAckSound();
           }
    }
   gunLevel = Math.max(0, Math.min(4, gunLevelValue));
}

function updateWaterLevel(waterLevelValue) {
    
    if (waterLevelValue > waterLevel) {
        if ( (waterLevelUpCount % waterLevelUpThreshold)===0) {
            shieldDuration = Math.min(16000, shieldDuration+2000); 
            playShieldAckSound();
            shield++;
        }
    } else {
        shieldDuration =  Math.max(4000,  Math.min(16000, shieldDuration-2000)); 
    }
    waterLevel= Math.max(1, waterLevelValue);;
}

function updateGpuLevel(gpuLevelValue) {
  
    if (gpuLevelValue > gpuLevel) {
        if ((gpuLevelUpCount%5)===0){
            nuke++;
            playNukeAckSound();
        }
    }
    gpuLevel = Math.max(0, Math.min(4, gpuLevelValue));
}