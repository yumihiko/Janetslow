const ageToTime = {
    10: 13.8,
    20: 8.2,
    40: 5.83,
    60: 3.67,
    70: 2.36,
};

const state = {
    running: false,
    startTime: 0,
    animationFrameId: null,
};

function resetAgeState() {
    Object.keys(ageToTime).forEach(age => {
        const progressBar = document.getElementById(`progress-${age}`);
        const clockHand = document.getElementById(`hand-${age}`);

        if (!progressBar || !clockHand) return;

        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        clockHand.style.transform = "rotate(-90deg)";
    });
}

function startProgress() {
    if (state.running) return;

    state.running = true;
    state.startTime = performance.now();

    Object.keys(ageToTime).forEach(age => {
        const progressBar = document.getElementById(`progress-${age}`);
        if (!progressBar) return;

        progressBar.style.transition = `width ${ageToTime[age]}s linear`;
        progressBar.style.width = "100%";
    });

    state.animationFrameId = requestAnimationFrame(updateProgress);
}

function updateProgress() {
    if (!state.running) return;

    const elapsedSeconds = (performance.now() - state.startTime) / 1000;
    let allCompleted = true;

    Object.keys(ageToTime).forEach(age => {
        const clockHand = document.getElementById(`hand-${age}`);
        const duration = ageToTime[age];
        const progress = Math.min((elapsedSeconds / duration) * 100, 100);
        const rotation = (progress / 100) * 720 - 90;

        if (clockHand) {
            clockHand.style.transform = `rotate(${rotation}deg)`;
        }

        if (progress < 100) {
            allCompleted = false;
        }
    });

    if (!allCompleted) {
        state.animationFrameId = requestAnimationFrame(updateProgress);
        return;
    }

    state.running = false;
    state.animationFrameId = null;
    console.log("=== Animation Complete ===");
}

function resetProgress() {
    state.running = false;

    if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
    }

    resetAgeState();
    console.log("=== Animation Reset ===");
}

function bindControls() {
    const startButton = document.getElementById("start-button");
    const resetButton = document.getElementById("reset-button");

    if (startButton) {
        startButton.addEventListener("click", startProgress);
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetProgress);
    }
}

function init() {
    resetAgeState();
    bindControls();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
