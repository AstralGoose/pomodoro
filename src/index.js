const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
}

const pomodoroControls = document.querySelectorAll('.btn-control')
const minuteElement = document.getElementById('minute');
const secondsElement = document.getElementById('seconds');
const startButton = document.getElementById('start');
let interval;

const setPomodoroSetting = (pomodoroControl) => {
    var currentSelectedSetting = document.querySelector('.btn-active');
    currentSelectedSetting.classList.remove('btn-active');
    pomodoroControl.srcElement.classList.add('btn-active');
    const mode = pomodoroControl.srcElement.dataset.mode;
    if (!mode) return; 
    switchMode(mode);
};

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }
    updateClock();
}

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
    minuteElement.style.setProperty('--value', minutes)
    secondsElement.style.setProperty('--value', seconds)

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;
}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;

    startButton.dataset.action = 'stop';
    startButton.textContent = 'stop';

    interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            //clearInterval(interval);
            stopTimer();
            switchMode('pomodoro');
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    startButton.dataset.action = 'start';
    startButton.textContent = 'start';
}

pomodoroControls.forEach((pomodoroControl) => {
    pomodoroControl.addEventListener('click', setPomodoroSetting, pomodoroControl);
});

startButton.addEventListener('click', () => {
    const { action } = startButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});

window.addEventListener('load', () => {
    switchMode('pomodoro')
})