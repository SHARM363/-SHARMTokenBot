// ===============================
// SHARM Mini App - Script Part 1
// ===============================

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

// API URL
const API_URL = "https://sharm-backend-5547.onrender.com";

// Navigation
const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

function showPage(pageId) {
    pages.forEach(page => page.classList.remove("active"));

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    navButtons.forEach(btn => btn.classList.remove("active"));

    const activeButton = document.querySelector(
        `[data-page="${pageId}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

navButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const page = btn.dataset.page;

        showPage(page);

    });

});

// Telegram User
const user = tg?.initDataUnsafe?.user;

if (user) {

    const username = document.getElementById("username");
    const userid = document.getElementById("userid");

    if (username) {
        username.innerText =
            user.first_name || "User";
    }

    if (userid) {
        userid.innerText = user.id;
    }

}
// ===============================
// SHARM Mini App - Script Part 2
// ===============================

let balance = 0;
let energy = 1500;
const maxEnergy = 1500;

const balanceEl = document.getElementById("balance");
const energyText = document.getElementById("energyText");
const energyFill = document.getElementById("energyFill");
const tapBtn = document.getElementById("tapBtn");

function updateUI() {
    if (balanceEl) balanceEl.textContent = balance;

    if (energyText) {
        energyText.textContent = `${energy} / ${maxEnergy}`;
    }

    if (energyFill) {
        energyFill.style.width =
            `${(energy / maxEnergy) * 100}%`;
    }
}

function showFloatingPlus() {

    const plus = document.createElement("div");

    plus.className = "floating-plus";
    plus.innerText = "+1";

    const rect = tapBtn.getBoundingClientRect();

    plus.style.left =
        (rect.left + rect.width / 2) + "px";

    plus.style.top =
        rect.top + "px";

    document.body.appendChild(plus);

    setTimeout(() => {
        plus.remove();
    }, 800);

}

if (tapBtn) {

    tapBtn.addEventListener("click", () => {

        if (energy <= 0) return;

        balance++;
        energy--;

        showFloatingPlus();

        if (window.Telegram?.WebApp?.HapticFeedback) {
            Telegram.WebApp.HapticFeedback
                .impactOccurred("light");
        }

        updateUI();

    });

    }
// ===============================
// SHARM Mini App - Script Part 3
// ===============================

// Referral Link
const referralInput = document.getElementById("referralLink");
const copyReferralBtn = document.getElementById("copyReferralBtn");

if (user && referralInput) {
    referralInput.value =
        `https://t.me/SHARM363_bot?start=${user.id}`;
}

if (copyReferralBtn) {
    copyReferralBtn.addEventListener("click", () => {

        referralInput.select();
        document.execCommand("copy");

        tg?.showAlert("Referral link copied!");

    });
}

// Backend Connection
async function syncAccount() {

    if (!user) return;

    try {

        const response = await fetch(`${API_URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegram_id: user.id,
                username: user.username || "",
                first_name: user.first_name || ""
            })
        });

        const data = await response.json();

        console.log("Backend:", data);

    } catch (err) {

        console.error(err);

    }

}

syncAccount();

// Placeholder Leaderboard
const leaderboard = document.getElementById("leaderboardList");

if (leaderboard) {

    leaderboard.innerHTML = `
        <p>🥇 Player 1 - 5000 SHARM</p>
        <p>🥈 Player 2 - 4500 SHARM</p>
        <p>🥉 Player 3 - 4200 SHARM</p>
    `;

}
