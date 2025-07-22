class BalloonPopGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.timerElement = document.getElementById('timer');
        this.levelElement = document.getElementById('level');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalHighScoreElement = document.getElementById('finalHighScore');
        this.finalTimeElement = document.getElementById('finalTime');
        
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.level = 1;
        this.gameTime = 0;
        this.isGameRunning = false;
        this.isPaused = false;
        this.isMuted = false;
        this.balloons = [];
        this.gameInterval = null;
        this.timerInterval = null;
        this.spawnInterval = null;
        
        this.balloonColors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
        this.baseSpawnRate = 2000; // milliseconds
        this.baseSpeed = 1; // pixels per frame
        
        this.initializeEventListeners();
        this.updateHighScoreDisplay();
        this.showStartScreen();
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('balloonPopHighScore');
        return saved ? parseInt(saved) : 0;
    }
    
    saveHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('balloonPopHighScore', score.toString());
            this.updateHighScoreDisplay();
            return true;
        }
        return false;
    }
    
    updateHighScoreDisplay() {
        this.highScoreElement.textContent = this.highScore;
    }
    
    initializeEventListeners() {
        // Start game button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Restart game button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // Mute button
        document.getElementById('muteBtn').addEventListener('click', () => {
            this.toggleMute();
        });
        
        // Game area click for popping balloons
        this.gameArea.addEventListener('click', (e) => {
            if (this.isGameRunning && !this.isPaused) {
                this.handleBalloonClick(e);
            }
        });
        
        // Block right-click context menu on game area
        this.gameArea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Block right-click on entire game container
        document.querySelector('.game-container').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            } else if (e.code === 'KeyM') {
                this.toggleMute();
            } else if (e.code === 'KeyR') {
                this.restartGame();
            }
        });
    }
    
    showStartScreen() {
        this.startScreen.style.display = 'flex';
        this.gameOverlay.classList.remove('show');
    }
    
    hideStartScreen() {
        this.startScreen.style.display = 'none';
    }
    
    startGame() {
        this.hideStartScreen();
        this.resetGame();
        this.isGameRunning = true;
        this.isPaused = false;
        
        // Start timer
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.gameTime++;
                this.timerElement.textContent = this.gameTime;
                this.updateLevel();
            }
        }, 1000);
        
        // Start balloon spawning
        this.spawnBalloons();
        
        // Start game loop
        this.gameInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateBalloons();
            }
        }, 16); // ~60 FPS
        
        console.log('Game started!');
    }
    
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.gameTime = 0;
        this.balloons = [];
        
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.gameTime;
        this.levelElement.textContent = this.level;
        
        // Clear existing balloons
        const existingBalloons = this.gameArea.querySelectorAll('.balloon');
        existingBalloons.forEach(balloon => balloon.remove());
        
        // Clear intervals
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.spawnInterval) clearInterval(this.spawnInterval);
    }
    
    spawnBalloons() {
        const spawnBalloon = () => {
            if (!this.isGameRunning || this.isPaused) return;
            
            const balloon = this.createBalloon();
            this.balloons.push(balloon);
            this.gameArea.appendChild(balloon);
            
            console.log(`Balloon spawned at level ${this.level}`);
        };
        
        // Initial spawn
        spawnBalloon();
        
        // Set up recurring spawns with dynamic rate
        const updateSpawnRate = () => {
            const spawnRate = Math.max(500, this.baseSpawnRate - (this.level - 1) * 100);
            console.log(`Spawn rate updated to ${spawnRate}ms at level ${this.level}`);
            
            if (this.spawnInterval) clearInterval(this.spawnInterval);
            this.spawnInterval = setInterval(spawnBalloon, spawnRate);
        };
        
        updateSpawnRate();
        
        // Update spawn rate when level changes
        this.updateSpawnRate = updateSpawnRate;
    }
    
    createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Random color
        const color = this.balloonColors[Math.floor(Math.random() * this.balloonColors.length)];
        balloon.classList.add(color);
        
        // Add string knot element
        const stringKnot = document.createElement('div');
        stringKnot.className = 'string-knot';
        balloon.appendChild(stringKnot);
        
        // Add string tail element
        const stringTail = document.createElement('div');
        stringTail.className = 'string-tail';
        balloon.appendChild(stringTail);
        
        // Random position at bottom
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const x = Math.random() * (gameAreaRect.width - 60);
        const y = gameAreaRect.height;
        
        balloon.style.left = x + 'px';
        balloon.style.top = y + 'px';
        
        // Store balloon data
        balloon.dataset.speed = this.baseSpeed + (this.level - 1) * 0.5;
        balloon.dataset.points = this.level * 10;
        
        return balloon;
    }
    
    updateBalloons() {
        this.balloons.forEach((balloon, index) => {
            const currentTop = parseFloat(balloon.style.top);
            const speed = parseFloat(balloon.dataset.speed);
            const newTop = currentTop - speed;
            
            balloon.style.top = newTop + 'px';
            
            // Check if balloon reached the top (game over)
            if (newTop < -80) {
                this.gameOver();
                return;
            }
            
            // Remove balloons that are off screen (accounting for longer tails)
            if (newTop < -120) {
                balloon.remove();
                this.balloons.splice(index, 1);
            }
        });
    }
    
    handleBalloonClick(e) {
        if (e.target.classList.contains('balloon')) {
            const balloon = e.target;
            const points = parseInt(balloon.dataset.points);
            
            // Add score
            this.score += points;
            this.scoreElement.textContent = this.score;
            
            // Show score popup
            this.showScorePopup(balloon, points);
            
            // Pop animation
            balloon.classList.add('popped');
            
            // Play pop sound (if not muted)
            if (!this.isMuted) {
                this.playPopSound();
            }
            
            // Remove balloon after animation
            setTimeout(() => {
                balloon.remove();
                const index = this.balloons.indexOf(balloon);
                if (index > -1) {
                    this.balloons.splice(index, 1);
                }
            }, 300);
            
            console.log(`Balloon popped! +${points} points. Total: ${this.score}`);
        }
    }
    
    showScorePopup(balloon, points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        
        const rect = balloon.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        popup.style.left = (rect.left - gameAreaRect.left + rect.width / 2) + 'px';
        popup.style.top = (rect.top - gameAreaRect.top) + 'px';
        
        this.gameArea.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.gameTime / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.levelElement.textContent = this.level;
            
            // Update spawn rate for new level
            if (this.updateSpawnRate) {
                this.updateSpawnRate();
            }
            
            console.log(`Level up! Now at level ${this.level}`);
        }
    }
    
    togglePause() {
        if (!this.isGameRunning) return;
        
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isPaused) {
            pauseBtn.textContent = 'Resume';
            console.log('Game paused');
        } else {
            pauseBtn.textContent = 'Pause';
            console.log('Game resumed');
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteBtn = document.getElementById('muteBtn');
        
        if (this.isMuted) {
            muteBtn.textContent = '🔇';
            console.log('Sound muted');
        } else {
            muteBtn.textContent = '🔊';
            console.log('Sound unmuted');
        }
    }
    
    playPopSound() {
        // Create a simple pop sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }
    
    gameOver() {
        this.isGameRunning = false;
        
        // Clear intervals
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        
        // Check and save high score
        const isNewHighScore = this.saveHighScore(this.score);
        
        // Update final score display
        this.finalScoreElement.textContent = this.score;
        this.finalHighScoreElement.textContent = this.highScore;
        this.finalTimeElement.textContent = this.gameTime;
        
        // Show game over screen
        this.gameOverlay.classList.add('show');
        
        // Show new high score celebration
        if (isNewHighScore) {
            this.showNewHighScoreCelebration();
        }
        
        console.log(`Game Over! Final Score: ${this.score}, High Score: ${this.highScore}, Time: ${this.gameTime}s`);
    }
    
    showNewHighScoreCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'high-score-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <h3>🎉 NEW HIGH SCORE! 🎉</h3>
                <p>Congratulations! You beat your previous best!</p>
            </div>
        `;
        
        this.gameArea.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    
    restartGame() {
        this.gameOverlay.classList.remove('show');
        this.startGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Balloon Pop Game initializing...');
    const game = new BalloonPopGame();
    
    // Make game globally accessible for debugging
    window.balloonGame = game;
}); 