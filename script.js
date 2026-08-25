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
