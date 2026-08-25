// Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand();

// User
const user = tg.initDataUnsafe.user;

if (user) {
    document.getElementById("username").innerText =
        user.first_name || "SHARM User";

    document.getElementById("userid").innerText =
        user.id;
}

// Game Data
let balance =
    Number(localStorage.getItem("balance")) || 0;

let energy =
    Number(localStorage.getItem("energy")) || 1500;

const MAX_ENERGY = 1500;

// Elements
const balanceEl =
    document.getElementById("balance");

const energyText =
    document.getElementById("energyText");

const energyFill =
    document.getElementById("energyFill");

const coin =
    document.getElementById("coin");

const tapButton =
    document.getElementById("tapButton");

// Update UI
function updateUI() {

    balanceEl.innerHTML =
        balance + " SHARM";

    energyText.innerHTML =
        energy + " / " + MAX_ENERGY;

    energyFill.style.width =
        (energy / MAX_ENERGY * 100) + "%";

    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "energy",
        energy
    );

}

updateUI();

// Tap
tapButton.addEventListener(
    "click",
    function () {

        if (energy <= 0)
            return;

        balance += 1;

        energy -= 1;

        coin.style.transform =
            "scale(.9)";

        setTimeout(function () {

            coin.style.transform =
                "scale(1)";

        },100);

        updateUI();

    }
);

// Auto Recharge
setInterval(function(){

    if(
        energy < MAX_ENERGY
    ){

        energy++;

        updateUI();

    }

},1000);
// ==========================================
// SHARM MINI APP
// Coin Animation + Floating +1 + Haptic
// ==========================================

// Telegram Mini App
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ==========================================
// TELEGRAM USER
// ==========================================

const user = tg.initDataUnsafe?.user;

if (user) {

    document.getElementById("username").textContent =
        user.first_name || "SHARM User";

    document.getElementById("userid").textContent =
        user.id;

}


// ==========================================
// GAME DATA
// ==========================================

let balance =
    Number(localStorage.getItem("balance")) || 0;

let energy =
    Number(localStorage.getItem("energy")) || 1500;

const MAX_ENERGY = 1500;
const TAP_REWARD = 1;


// ==========================================
// ELEMENTS
// ==========================================

const balanceEl =
    document.getElementById("balance");

const energyText =
    document.getElementById("energyText");

const energyFill =
    document.getElementById("energyFill");

const coin =
    document.getElementById("coin");

const tapButton =
    document.getElementById("tapButton");


// ==========================================
// UPDATE UI
// ==========================================

function updateUI() {

    balanceEl.textContent =
        balance + " SHARM";

    energyText.textContent =
        energy + " / " + MAX_ENERGY;

    const percentage =
        (energy / MAX_ENERGY) * 100;

    energyFill.style.width =
        percentage + "%";


    // Save locally
    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "energy",
        energy
    );


    // Disable button when energy is empty
    if (energy <= 0) {

        tapButton.disabled = true;
        tapButton.style.opacity = "0.5";

    } else {

        tapButton.disabled = false;
        tapButton.style.opacity = "1";

    }

}


// ==========================================
// COIN BOUNCE ANIMATION
// ==========================================

function animateCoin() {

    coin.classList.remove("coin-tap");

    // Force browser to restart animation
    void coin.offsetWidth;

    coin.classList.add("coin-tap");

}


// ==========================================
// FLOATING +1
// ==========================================

function createFloatingNumber() {

    const floating =
        document.createElement("div");

    floating.className =
        "floating-reward";

    floating.textContent =
        "+" + TAP_REWARD;


    // Position around the coin
    const rect =
        coin.getBoundingClientRect();

    const randomX =
        (Math.random() * 80) - 40;

    floating.style.left =
        (rect.left + rect.width / 2 + randomX)
        + "px";

    floating.style.top =
        (rect.top + 20)
        + "px";


    document.body.appendChild(
        floating
    );


    // Remove after animation
    setTimeout(function () {

        floating.remove();

    }, 800);

}


// ==========================================
// HAPTIC FEEDBACK
// ==========================================

function hapticFeedback() {

    try {

        if (
            tg.HapticFeedback &&
            tg.HapticFeedback.impactOccurred
        ) {

            tg.HapticFeedback.impactOccurred(
                "light"
            );

        }

    } catch (error) {

        console.log(
            "Haptic feedback unavailable"
        );

    }

}


// ==========================================
// TAP FUNCTION
// ==========================================

function performTap() {

    if (energy <= 0) {
        return;
    }


    // Add SHARM
    balance += TAP_REWARD;


    // Reduce Energy
    energy -= 1;


    // UI
    updateUI();


    // Animations
    animateCoin();

    createFloatingNumber();


    // Vibration
    hapticFeedback();

}


// ==========================================
// BUTTON TAP
// ==========================================

tapButton.addEventListener(
    "click",
    performTap
);


// ==========================================
// MULTI-TOUCH
// ==========================================

coin.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        const touches =
            event.changedTouches.length;

        for (
            let i = 0;
            i < touches;
            i++
        ) {

            performTap();

        }

    },
    { passive: false }
);


// ==========================================
// COIN CLICK
// ==========================================

coin.addEventListener(
    "click",
    performTap
);


// ==========================================
// AUTO ENERGY RECHARGE
// ==========================================

setInterval(
    function() {

        if (
            energy < MAX_ENERGY
        ) {

            energy += 1;

            updateUI();

        }

    },
    1000
);


// ==========================================
// START
// ==========================================

updateUI();
