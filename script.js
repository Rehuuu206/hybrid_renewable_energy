// --- Simulated energy data ---
let solarPower = 3.5;
let windPower = 2.1;
let batteryLevel = 78;
let co2Saved = 12.4;
let moneySaved = 540;

const history = [];
const MAX_HISTORY = 20;

let updateIntervalMs = 3000;
let updateIntervalId = null;

// Update all UI values
function updateUI() {
  const totalPower = +(solarPower + windPower).toFixed(2);

  // Dashboard cards
  document.getElementById("solarPower").textContent =
    solarPower.toFixed(2) + " kW";
  document.getElementById("windPower").textContent =
    windPower.toFixed(2) + " kW";
  document.getElementById("batteryLevel").textContent =
    batteryLevel.toFixed(0) + "%";
  document.getElementById("totalPower").textContent = totalPower + " kW";

  // Savings
  document.getElementById("co2Saved").textContent =
    co2Saved.toFixed(1) + " kg";
  document.getElementById("moneySaved").textContent = "₹ " + moneySaved;

  // Battery bar
  const batteryFill = document.getElementById("batteryFill");
  const batteryText = document.getElementById("batteryText");
  if (batteryFill && batteryText) {
    batteryFill.style.width = batteryLevel + "%";
    batteryText.textContent = batteryLevel.toFixed(0) + "% charged";
  }

  // Contribution bars
  const solarBar = document.getElementById("solarBar");
  const windBar = document.getElementById("windBar");
  const solarValue = document.getElementById("solarValue");
  const windValue = document.getElementById("windValue");

  if (solarBar && windBar && solarValue && windValue) {
    let solarPercent = totalPower > 0 ? (solarPower / totalPower) * 100 : 0;
    let windPercent = totalPower > 0 ? (windPower / totalPower) * 100 : 0;

    solarBar.style.width = solarPercent + "%";
    windBar.style.width = windPercent + "%";

    solarValue.textContent = solarPower.toFixed(2) + " kW";
    windValue.textContent = windPower.toFixed(2) + " kW";
  }

  // History chart
  updateHistoryChart(totalPower);

  // Year
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Update trend history bars
function updateHistoryChart(totalPower) {
  const container = document.getElementById("powerHistory");
  if (!container) return;

  history.push(totalPower);
  if (history.length > MAX_HISTORY) history.shift();

  container.innerHTML = "";
  const maxValue = Math.max(...history, 1);

  history.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "history-bar";
    const heightPercent = (value / maxValue) * 100;
    bar.style.height = heightPercent + "%";
    container.appendChild(bar);
  });
}

// Randomly change data
function randomUpdate() {
  solarPower = +(solarPower + (Math.random() - 0.5)).toFixed(2);
  windPower = +(windPower + (Math.random() - 0.5)).toFixed(2);

  if (solarPower < 0) solarPower = 0;
  if (windPower < 0) windPower = 0;

  batteryLevel += Math.random() * 4 - 2;
  if (batteryLevel > 100) batteryLevel = 100;
  if (batteryLevel < 0) batteryLevel = 0;

  co2Saved = +(co2Saved + Math.random()).toFixed(1);
  moneySaved += Math.floor(Math.random() * 10);

  updateUI();
}

function startSimulation() {
  if (updateIntervalId) clearInterval(updateIntervalId);
  updateIntervalId = setInterval(randomUpdate, updateIntervalMs);
}

// Clock
function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const el = document.getElementById("currentTime");
  if (el) el.textContent = `${h}:${m}`;
}

// Navigation (Dashboard / Analytics / Reports / Team / Settings)
function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".page-section");
  const body = document.body;

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // active button
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const targetId = btn.getAttribute("data-section");

      // show correct section only
      sections.forEach((sec) => {
        if (sec.id === targetId) sec.classList.add("active-section");
        else sec.classList.remove("active-section");
      });

      // change theme on body
      body.classList.remove(
        "theme-dashboard",
        "theme-analytics",
        "theme-reports",
        "theme-team",
        "theme-settings"
      );
      body.classList.add("theme-" + targetId);
    });
  });
}

// Settings (speed + theme label text)
function setupSettings() {
  const speedRadios = document.querySelectorAll('input[name="speed"]');
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  const msg = document.getElementById("settingsMessage");

  speedRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const v = radio.value;
      if (v === "slow") updateIntervalMs = 4000;
      else if (v === "normal") updateIntervalMs = 3000;
      else if (v === "fast") updateIntervalMs = 1500;

      const themeVal =
        document.querySelector('input[name="theme"]:checked')?.value || "eco";

      if (msg) {
        msg.textContent = `Current mode: ${
          v.charAt(0).toUpperCase() + v.slice(1)
        } simulation • ${
          themeVal === "eco"
            ? "Eco Green"
            : themeVal === "cool"
            ? "Cool Blue"
            : "Storm Mode"
        } label (visual only).`;
      }

      startSimulation();
    });
  });

  themeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const speedVal =
        document.querySelector('input[name="speed"]:checked')?.value || "slow";
      const themeVal = radio.value;

      if (msg) {
        msg.textContent = `Current mode: ${
          speedVal.charAt(0).toUpperCase() + speedVal.slice(1)
        } simulation • ${
          themeVal === "eco"
            ? "Eco Green"
            : themeVal === "cool"
            ? "Cool Blue"
            : "Storm Mode"
        } label (visual only).`;
      }
    });
  });
}

// Initial
updateUI();
updateTime();
setupNavigation();
setupSettings();
startSimulation();

// Clock refresh
setInterval(updateTime, 30000);