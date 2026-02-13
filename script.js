const hrsInput = document.getElementById('hrs');
const minInput = document.getElementById('min');
const secInput = document.getElementById('sec');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let timerInterval;
let totalSeconds = 0;
let isRunning = false;

// Button State Management
function checkButtonState() {
    const hours = parseInt(hrsInput.value) || 0;
    const minutes = parseInt(minInput.value) || 0;
    const seconds = parseInt(secInput.value) || 0;
    const total = hours * 3600 + minutes * 60 + seconds;

    if (total <= 0) {
        startBtn.disabled = true;
        resetBtn.disabled = true;
        startBtn.classList.add('disabled');
        resetBtn.classList.add('disabled');
    } else {
        startBtn.disabled = false;
        resetBtn.disabled = false;
        startBtn.classList.remove('disabled');
        resetBtn.classList.remove('disabled');
    }
}


// Input Validation and Formatting
function formatInput(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 0) value = 0;
    if (input.id === 'hrs' && value > 99) value = 99;
    if ((input.id === 'min' || input.id === 'sec') && value > 59) value = 59;
    
    // Update input value with leading zero if needed, but only if it's not currently being typed into (to avoid annoying UX)
    // Actually, for a timer, we update the display on blur or when timer runs.
    return value;
}

function updateInputs() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hrsInput.value = String(hours).padStart(2, '0');
    minInput.value = String(minutes).padStart(2, '0');
    secInput.value = String(seconds).padStart(2, '0');
}

function tick() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        alert('Finish');
        resetTimer();
        return;
    }

    totalSeconds--;
    updateInputs();
}

function startTimer() {
    if (isRunning) return;

    // Calculate total seconds from inputs if starting from fresh or paused
    const hours = parseInt(hrsInput.value) || 0;
    const minutes = parseInt(minInput.value) || 0;
    const seconds = parseInt(secInput.value) || 0;

    totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) return;

    isRunning = true;
    
    // UI Updates
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    pauseBtn.classList.remove('hidden'); // Ensure class hidden is managed
    
    // Disable inputs while running
    hrsInput.disabled = true;
    minInput.disabled = true;
    secInput.disabled = true;

    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;

    // UI Updates
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';

    // Verify button text is correct (Start vs Restart?) 
    // Requirement says: "다시 Start를 누르면 재시작됩니다." -> Just show Start button again.
    
    // Enable inputs? Usually paused timers don't allow editing, but let's see. 
    // Requirement doesn't specify, but typical UX is to keep them disabled or allow editing.
    // Let's keep them disabled to avoid confusion, or enable them if user wants to change time.
    // For now, I'll keep them disabled to match typical timer behavior (reset to edit).
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = 0;

    // Reset inputs to 00
    updateInputs();
    
    // Enable inputs
    hrsInput.disabled = false;
    minInput.disabled = false;
    secInput.disabled = false;

    // UI Updates
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    
    // Check button state
    checkButtonState();
}

// Event Listeners
startBtn.addEventListener('click', () => {
    startTimer();
});

pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Input handling
[hrsInput, minInput, secInput].forEach(input => {
    // Add 'input' event for real-time validation as user types
    input.addEventListener('input', checkButtonState);

    input.addEventListener('change', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 0) val = 0; // Handle invalid inputs
        if (val < 10) {
             input.value = String(val).padStart(2, '0');
        } else {
             input.value = val; // Remove leading zeros if > 10 (e.g. 05 -> 5 -> 05 handled above, but 012 -> 12)
        }
        
        // Basic validation bounds
        if (input.id === 'hrs' && val > 99) input.value = 99;
        if ((input.id === 'min' || input.id === 'sec') && val > 59) input.value = 59;
        
        checkButtonState(); // Re-check after formatting
    });

    // Optional: Clear "00" on focus for easier typing
    input.addEventListener('focus', () => {
        if (input.value === '00') {
            input.value = '';
        }
    });

    // Restore "00" on blur if empty
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.value = '00';
            checkButtonState(); // Re-check if it went back to 00
        }
    });
});

// Initialize inputs to 00
updateInputs();
// Initial check
checkButtonState();
