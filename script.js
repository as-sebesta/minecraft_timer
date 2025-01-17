let readingSeconds = 0;
let playSeconds = 0;
let readingStartTime = 0;
let playStartTime = 0;
let isReading = false;
let isPlaying = false;

// Get DOM elements
const readingTimeDisplay = document.getElementById('readingTime');
const playTimeDisplay = document.getElementById('playTime');
const startReadingBtn = document.getElementById('startReading');
const stopReadingBtn = document.getElementById('stopReading');
const startPlayingBtn = document.getElementById('startPlaying');
const stopPlayingBtn = document.getElementById('stopPlaying');

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update reading timer
function updateReadingTime() {
    if (isReading) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - readingStartTime) / 1000;
        const totalSeconds = readingSeconds + elapsedSeconds;
        readingTimeDisplay.textContent = formatTime(totalSeconds);
        
        // Add 3 minutes of play time for every 1 minute of reading
        const previousPlayTime = playSeconds;
        const newPlayTime = Math.floor(totalSeconds / 60) * 180; // 3 minutes = 180 seconds
        if (newPlayTime !== previousPlayTime) {
            playSeconds = newPlayTime;
            playTimeDisplay.textContent = formatTime(playSeconds);
        }
        
        requestAnimationFrame(updateReadingTime);
    }
}

// Update playing timer
function updatePlayingTime() {
    if (isPlaying && playSeconds > 0) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - playStartTime) / 1000;
        playSeconds = Math.max(0, playSeconds - elapsedSeconds);
        playTimeDisplay.textContent = formatTime(playSeconds);
        
        if (playSeconds === 0) {
            stopPlaying();
        } else {
            playStartTime = currentTime;
            requestAnimationFrame(updatePlayingTime);
        }
    }
}

// Start reading timer
startReadingBtn.addEventListener('click', () => {
    isReading = true;
    readingStartTime = Date.now();
    startReadingBtn.disabled = true;
    stopReadingBtn.disabled = false;
    startPlayingBtn.disabled = true;
    updateReadingTime();
});

// Stop reading timer
stopReadingBtn.addEventListener('click', () => {
    isReading = false;
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - readingStartTime) / 1000;
    readingSeconds += elapsedSeconds; // Add elapsed time to total
    startReadingBtn.disabled = false;
    stopReadingBtn.disabled = true;
    startPlayingBtn.disabled = false;
});

// Reset all timers
function resetTimers() {
    isReading = false;
    isPlaying = false;
    readingSeconds = 0;
    playSeconds = 0;
    readingTimeDisplay.textContent = formatTime(0);
    playTimeDisplay.textContent = formatTime(0);
    startReadingBtn.disabled = false;
    stopReadingBtn.disabled = true;
    startPlayingBtn.disabled = true;
    stopPlayingBtn.disabled = true;
}

// Add reset button functionality
const resetBtn = document.getElementById('resetButton');
resetBtn.addEventListener('click', resetTimers);

// Start playing timer
startPlayingBtn.addEventListener('click', () => {
    if (playSeconds > 0) {
        isPlaying = true;
        playStartTime = Date.now();
        startPlayingBtn.disabled = true;
        stopPlayingBtn.disabled = false;
        startReadingBtn.disabled = true;
        updatePlayingTime();
    }
});

// Stop playing timer
stopPlayingBtn.addEventListener('click', () => {
    isPlaying = false;
    startPlayingBtn.disabled = false;
    stopPlayingBtn.disabled = true;
    startReadingBtn.disabled = false;
});

// Save timer state before page unload
window.addEventListener('beforeunload', () => {
    if (isReading || isPlaying) {
        localStorage.setItem('timerState', JSON.stringify({
            readingStartTime,
            playStartTime,
            readingSeconds,
            playSeconds,
            isReading,
            isPlaying,
            timestamp: Date.now()
        }));
    } else {
        localStorage.removeItem('timerState');
    }
});

// Restore timer state on page load
window.addEventListener('load', () => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const timePassed = (Date.now() - state.timestamp) / 1000;
        
        if (state.isReading) {
            readingStartTime = Date.now() - (state.readingSeconds * 1000);
            isReading = true;
            startReadingBtn.disabled = true;
            stopReadingBtn.disabled = false;
            startPlayingBtn.disabled = true;
            updateReadingTime();
        }
        
        if (state.isPlaying) {
            playSeconds = Math.max(0, state.playSeconds - timePassed);
            if (playSeconds > 0) {
                isPlaying = true;
                playStartTime = Date.now();
                startPlayingBtn.disabled = true;
                stopPlayingBtn.disabled = false;
                startReadingBtn.disabled = true;
                updatePlayingTime();
            }
        }
    }
}); 