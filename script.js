// ===============================
// SHARM Mini App - Script Part 1
// ===============================

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    // Telegram Mini App startapp / referral parameter
    const startParam = tg.initDataUnsafe?.start_param || null;

    console.log("SHARM start_param:", startParam);
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

let pendingTaps = 0;
let syncTimer = null;

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
// Auto Energy Recharge
setInterval(() => {

    if (energy < maxEnergy) {

        energy++;

        updateUI();

    }

}, 3000);
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

    tapBtn.addEventListener("click", async () => {

        if (energy <= 0) return;

        try {

            balance++;
            energy--;
            pendingTaps++;

            showFloatingPlus();

            if (window.Telegram?.WebApp?.HapticFeedback) {
                Telegram.WebApp.HapticFeedback.impactOccurred("light");
            }

            updateUI();

        } catch (err) {

            console.error(err);

        }

    });

}
// ===============================
// SHARM Mini App - Script Part 3
// ===============================

// Referral Link
const referralInput = document.getElementById("referralLink");
const copyReferralBtn = document.getElementById("copyReferralBtn");
const shareReferralBtn = document.getElementById("shareReferralBtn");

if (user && referralInput) {

    const referralLink =
        `https://t.me/SHARMTokenBot?start=ref_${user.id}`;

    referralInput.value = referralLink;

}

// Copy Referral Link
if (copyReferralBtn) {

    copyReferralBtn.addEventListener("click", async () => {

        if (!referralInput) return;

        try {

            await navigator.clipboard.writeText(
                referralInput.value
            );

            tg?.showAlert("Referral link copied!");

        } catch (err) {

            referralInput.select();
            document.execCommand("copy");

            tg?.showAlert("Referral link copied!");

        }

    });

}

// Share Referral Link
if (shareReferralBtn) {

    shareReferralBtn.addEventListener("click", () => {

        if (!referralInput) return;

        const referralLink = referralInput.value;

        const shareUrl =
            `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join SHARM and start mining! 🚀")}`;

        if (tg?.openTelegramLink) {

            tg.openTelegramLink(shareUrl);

        } else {

            window.open(shareUrl, "_blank");

        }

    });

}
// Backend Connection
async function syncAccount() {

    if (!user) return;

    try {

        // Get referral ID from Telegram start parameter
        const startParam =
            tg?.initDataUnsafe?.start_param || "";

        const referrerId =
            startParam.startsWith("ref_")
                ? startParam.replace("ref_", "")
                : startParam;
        
       console.log("Start Param:", startParam);
       console.log("Referrer ID:", referrerId);
        
        const response = await fetch(`${API_URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegram_id: user.id,
                username: user.username || "",
                first_name: user.first_name || "",
                referrer_id: referrerId || null
            })
        });

        const data = await response.json();

        console.log("Backend:", data);

    } catch (err) {

        console.error("Auth error:", err);

    }

}

syncAccount();
async function loadAccount() {

    if (!user) return;

    try {

        const response = await fetch(`${API_URL}/api/me`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegram_id: user.id
            })
        });

        const data = await response.json();

        if (data.success && data.user) {

            balance = Number(data.user.balance) || 0;
            energy = Number(data.user.energy) || 0;

            updateUI();

        }

    } catch (err) {

        console.error("Load account error:", err);

    }

}

// Load account immediately when Mini App opens
if (user) {
    loadAccount();
}
// Fast Tap Sync
setInterval(async () => {

    if (!user) return;
    if (pendingTaps <= 0) return;

    const taps = pendingTaps;
    pendingTaps = 0;

    try {

        const response = await fetch(`${API_URL}/api/tap`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegram_id: user.id,
                amount: taps
            })
        });

        const data = await response.json();

        if (data.success) {

            balance = data.balance;
            updateUI();

        } else {

            pendingTaps += taps;

        }

    } catch (err) {

        pendingTaps += taps;
        console.error(err);

    }

}, 2000);

// Placeholder Leaderboard
const leaderboard = document.getElementById("leaderboardList");

if (leaderboard) {

    leaderboard.innerHTML = `
        <p>🥇 Player 1 - 5000 SHARM</p>
        <p>🥈 Player 2 - 4500 SHARM</p>
        <p>🥉 Player 3 - 4200 SHARM</p>
    `;

}
