let readingSeconds = 0;
let playSeconds = 0;
let readingInterval;
let playingInterval;
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
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Start reading timer
startReadingBtn.addEventListener('click', () => {
    isReading = true;
    startReadingBtn.disabled = true;
    stopReadingBtn.disabled = false;
    startPlayingBtn.disabled = true;

    readingInterval = setInterval(() => {
        readingSeconds++;
        readingTimeDisplay.textContent = formatTime(readingSeconds);
        
        // Add 3 minutes of play time for every 1 minute of reading
        if (readingSeconds % 60 === 0) {
            playSeconds += 180; // 3 minutes = 180 seconds
            playTimeDisplay.textContent = formatTime(playSeconds);
        }
    }, 1000);
});

// Stop reading timer
stopReadingBtn.addEventListener('click', () => {
    isReading = false;
    startReadingBtn.disabled = false;
    stopReadingBtn.disabled = true;
    startPlayingBtn.disabled = false;

    clearInterval(readingInterval);
});

// Start playing timer (countdown)
startPlayingBtn.addEventListener('click', () => {
    if (playSeconds > 0) {
        isPlaying = true;
        startPlayingBtn.disabled = true;
        stopPlayingBtn.disabled = false;
        startReadingBtn.disabled = true;

        playingInterval = setInterval(() => {
            if (playSeconds > 0) {
                playSeconds--;
                playTimeDisplay.textContent = formatTime(playSeconds);
            } else {
                clearInterval(playingInterval);
                startPlayingBtn.disabled = true;
                stopPlayingBtn.disabled = true;
                startReadingBtn.disabled = false;
                isPlaying = false;
            }
        }, 1000);
    }
});

// Stop playing timer
stopPlayingBtn.addEventListener('click', () => {
    isPlaying = false;
    startPlayingBtn.disabled = false;
    stopPlayingBtn.disabled = true;
    startReadingBtn.disabled = false;

    clearInterval(playingInterval);
}); 