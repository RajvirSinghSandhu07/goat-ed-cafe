/**
 * G.O.A.T Gaming Cafe — Command Center
 * script.js
 *
 * ARCHITECTURE NOTES:
 * ─────────────────────────────────────────────────────────────
 * 1. `APP_STATE`     — dummy object mimicking a Firebase Realtime
 *                      Database JSON payload. Replace with a live
 *                      Firebase onValue() listener when ready.
 *
 * 2. `currentBranch` — reactive variable driving every render.
 *
 * 3. `renderDashboard()` — single source of truth. Call it
 *                      whenever state changes (branch toggle,
 *                      Firebase update, etc.).
 *
 * 4. WhatsApp booking — form submit builds a wa.me deep-link.
 *
 * HOW TO WIRE UP FIREBASE LATER:
 * ─────────────────────────────────────────────────────────────
 *   import { initializeApp }   from 'firebase/app';
 *   import { getDatabase, ref, onValue } from 'firebase/database';
 *
 *   const db = getDatabase(app);
 *   onValue(ref(db, '/'), (snapshot) => {
 *     Object.assign(APP_STATE, snapshot.val());
 *     renderDashboard();
 *   });
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   WHATSAPP BUSINESS NUMBER
   Replace with the actual number (digits only, with country code)
═══════════════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '918884655514'; // +91 8884655514

/* ═══════════════════════════════════════════════════════
   DUMMY STATE — mirrors the Firebase JSON schema
   status: 'available' | 'booked'
   time:   null (if available) | 'HH:MM' string (booked until)
═══════════════════════════════════════════════════════ */
const APP_STATE = {
  belroad: {
    leaderboard: [
      { rank: 1, name: 'WraithX',     branch: 'Bel Road',  pct: 94 },
      { rank: 2, name: 'NightByte',   branch: 'Jayanagar', pct: 88 },
      { rank: 3, name: 'ShadowKing',  branch: 'Bel Road',  pct: 81 },
    ],
    ps5: [
      { id: 'PS5-01', status: 'available', time: null },
      { id: 'PS5-02', status: 'booked',    time: '01:30 AM' },
      { id: 'PS5-03', status: 'booked',    time: '02:00 AM' },
      { id: 'PS5-04', status: 'available', time: null },
      { id: 'PS5-05', status: 'available', time: null },
    ],
    pc: [
      { id: 'PC-01',  status: 'available', time: null },
      { id: 'PC-02',  status: 'booked',    time: '01:00 AM' },
      { id: 'PC-03',  status: 'available', time: null },
      { id: 'PC-04',  status: 'available', time: null },
      { id: 'PC-05',  status: 'booked',    time: '02:30 AM' },
      { id: 'PC-06',  status: 'booked',    time: '01:30 AM' },
      { id: 'PC-07',  status: 'available', time: null },
      { id: 'PC-08',  status: 'available', time: null },
      { id: 'PC-09',  status: 'booked',    time: '03:00 AM' },
      { id: 'PC-10',  status: 'available', time: null },
      { id: 'PC-11',  status: 'available', time: null },
      { id: 'PC-12',  status: 'booked',    time: '01:00 AM' },
      { id: 'PC-13',  status: 'available', time: null },
      { id: 'PC-14',  status: 'available', time: null },
      { id: 'PC-15',  status: 'booked',    time: '02:00 AM' },
      { id: 'PC-16',  status: 'available', time: null },
      { id: 'PC-17',  status: 'booked',    time: '01:30 AM' },
      { id: 'PC-18',  status: 'available', time: null },
      { id: 'PC-19',  status: 'available', time: null },
      { id: 'PC-20',  status: 'booked',    time: '02:00 AM' },
    ],
  },

  jayanagar: {
    leaderboard: [
      { rank: 1, name: 'VoidSlayer',  branch: 'Jayanagar', pct: 97 },
      { rank: 2, name: 'WraithX',     branch: 'Bel Road',  pct: 94 },
      { rank: 3, name: 'NeonRaider',  branch: 'Jayanagar', pct: 85 },
    ],
    ps5: [
      { id: 'PS5-01', status: 'booked',    time: '01:00 AM' },
      { id: 'PS5-02', status: 'booked',    time: '01:30 AM' },
      { id: 'PS5-03', status: 'available', time: null },
      { id: 'PS5-04', status: 'booked',    time: '02:30 AM' },
      { id: 'PS5-05', status: 'available', time: null },
    ],
    pc: [
      { id: 'PC-01',  status: 'booked',    time: '01:30 AM' },
      { id: 'PC-02',  status: 'available', time: null },
      { id: 'PC-03',  status: 'booked',    time: '02:00 AM' },
      { id: 'PC-04',  status: 'booked',    time: '01:00 AM' },
      { id: 'PC-05',  status: 'available', time: null },
      { id: 'PC-06',  status: 'available', time: null },
      { id: 'PC-07',  status: 'booked',    time: '03:30 AM' },
      { id: 'PC-08',  status: 'booked',    time: '01:30 AM' },
      { id: 'PC-09',  status: 'available', time: null },
      { id: 'PC-10',  status: 'booked',    time: '02:00 AM' },
      { id: 'PC-11',  status: 'booked',    time: '01:00 AM' },
      { id: 'PC-12',  status: 'available', time: null },
      { id: 'PC-13',  status: 'booked',    time: '01:30 AM' },
      { id: 'PC-14',  status: 'available', time: null },
      { id: 'PC-15',  status: 'available', time: null },
      { id: 'PC-16',  status: 'booked',    time: '02:30 AM' },
      { id: 'PC-17',  status: 'available', time: null },
      { id: 'PC-18',  status: 'booked',    time: '03:00 AM' },
      { id: 'PC-19',  status: 'available', time: null },
      { id: 'PC-20',  status: 'booked',    time: '01:30 AM' },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   REACTIVE STATE
═══════════════════════════════════════════════════════ */
let currentBranch = 'belroad'; // 'belroad' | 'jayanagar'

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

/**
 * Returns the emoji icon for a station block.
 * @param {string} type   'ps5' | 'pc'
 * @param {string} status 'available' | 'booked'
 */
function stationIcon(type, status) {
  if (type === 'ps5') return status === 'available' ? '🎮' : '🔒';
  return status === 'available' ? '💻' : '🔒';
}

/** Rank medals */
const RANK_META = {
  1: { crown: '👑', label: '1ST', color: '#FFD700' },
  2: { crown: '🥈', label: '2ND', color: '#C0C0C0' },
  3: { crown: '🥉', label: '3RD', color: '#CD7F32' },
};

/** Format branch name for display */
function branchLabel(key) {
  return key === 'belroad' ? 'NEW BEL ROAD' : 'JAYANAGAR';
}

/* ═══════════════════════════════════════════════════════
   RENDER: LEADERBOARD PODIUM
═══════════════════════════════════════════════════════ */
function renderLeaderboard(players) {
  const podium = document.getElementById('leaderboardPodium');
  if (!podium) return;

  podium.innerHTML = players.map((player) => {
    const meta = RANK_META[player.rank];
    const initials = player.name.slice(0, 2).toUpperCase();

    return /* html */ `
      <div class="podium-card podium-card--rank-${player.rank}">
        <span class="podium-card__rank">${player.rank}</span>
        <div class="podium-card__crown">${meta.crown}</div>
        <div class="podium-card__avatar">${initials}</div>
        <div class="podium-card__name">${escapeHtml(player.name)}</div>
        <div class="podium-card__branch-tag">${escapeHtml(player.branch)}</div>
        <div class="podium-card__progress-label">GTA 6 Story Complete</div>
        <div class="podium-card__bar-wrap">
          <div
            class="podium-card__bar"
            style="width: ${player.pct}%"
            role="progressbar"
            aria-valuenow="${player.pct}"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div class="podium-card__pct">${player.pct}%</div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   RENDER: STATION GRID (PS5 or PC)
═══════════════════════════════════════════════════════ */
function renderStationGrid(stations, gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = stations.map((s) => {
    const isAvailable = s.status === 'available';
    const statusText  = isAvailable ? 'OPEN' : `Until ${s.time}`;
    const icon        = stationIcon(type, s.status);

    return /* html */ `
      <div
        class="station-block ${s.status}"
        role="status"
        aria-label="${escapeHtml(s.id)} — ${s.status}${s.time ? ' until ' + s.time : ''}"
        title="${escapeHtml(s.id)}: ${isAvailable ? 'Available' : 'Booked until ' + s.time}"
      >
        <span class="station-block__icon">${icon}</span>
        <span class="station-block__id">${escapeHtml(s.id)}</span>
        <span class="station-block__status">${isAvailable ? 'OPEN' : 'BOOKED'}</span>
        ${!isAvailable ? `<span class="station-block__time">Until ${s.time}</span>` : ''}
      </div>
    `;
  }).join('');

  // Update availability counter
  const availCount = stations.filter(s => s.status === 'available').length;
  const counterId  = gridId === 'ps5Grid' ? 'ps5AvailCount' : 'pcAvailCount';
  const counter    = document.getElementById(counterId);
  if (counter) {
    counter.textContent = `${availCount} / ${stations.length} Available`;
    counter.style.color = availCount > 0 ? 'var(--goat-accent)' : 'var(--goat-red)';
  }
}

/* ═══════════════════════════════════════════════════════
   MAIN RENDER FUNCTION
   Call this whenever branch changes or Firebase pushes data.
═══════════════════════════════════════════════════════ */
function renderDashboard() {
  const data = APP_STATE[currentBranch];
  if (!data) {
    console.error(`[GOAT] No data found for branch: ${currentBranch}`);
    return;
  }

  // 1. Render leaderboard (global across branches — always show full board)
  renderLeaderboard(data.leaderboard);

  // 2. Render PS5 grid
  renderStationGrid(data.ps5, 'ps5Grid', 'ps5');

  // 3. Render PC grid
  renderStationGrid(data.pc, 'pcGrid', 'pc');

  // 4. Update branch indicator
  const indicator = document.getElementById('branchLiveLabel');
  if (indicator) {
    indicator.textContent = `● LIVE: ${branchLabel(currentBranch)}`;
  }

  // 5. Update booking form branch label
  const bookingLabel = document.getElementById('bookingBranchLabel');
  if (bookingLabel) {
    bookingLabel.textContent = branchLabel(currentBranch);
  }
}

/* ═══════════════════════════════════════════════════════
   BRANCH TOGGLE EVENT LISTENERS
═══════════════════════════════════════════════════════ */
function initBranchToggle() {
  const buttons = document.querySelectorAll('.branch-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const branch = btn.dataset.branch;
      if (branch === currentBranch) return; // No-op if already selected

      currentBranch = branch;

      // Update active state on buttons
      buttons.forEach((b) => {
        b.classList.toggle('active', b.dataset.branch === branch);
        b.setAttribute('aria-pressed', b.dataset.branch === branch ? 'true' : 'false');
      });

      // Re-render everything for the new branch
      renderDashboard();

      // Smooth scroll to availability section
      const availSection = document.querySelector('.goat-availability-section');
      if (availSection) {
        availSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   BOOKING FORM — WhatsApp Deep Link
═══════════════════════════════════════════════════════ */
function initBookingForm() {
  const form      = document.getElementById('bookingForm');
  const errorEl   = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    // ── Gather values ──
    const gamerTag    = document.getElementById('gamerTag').value.trim();
    const stationType = document.getElementById('stationType').value;
    const duration    = document.getElementById('duration').value;
    const branch      = branchLabel(currentBranch);

    // ── Validate ──
    const errors = [];
    if (!gamerTag)    errors.push('Please enter your Gamer Tag.');
    if (!stationType) errors.push('Please select a Station Type.');
    if (!duration)    errors.push('Please select a Session Duration.');

    if (errors.length) {
      showError(errors.join(' '));
      // Highlight empty fields
      if (!gamerTag)    document.getElementById('gamerTag').classList.add('error');
      if (!stationType) document.getElementById('stationType').classList.add('error');
      if (!duration)    document.getElementById('duration').classList.add('error');
      return;
    }

    // ── Build WhatsApp message ──
    const message = [
      `🎮 *G.O.A.T Gaming Cafe — VIP Booking Request*`,
      ``,
      `👾 *Gamer Tag:*  ${gamerTag}`,
      `📍 *Branch:*     ${branch}`,
      `🕹️ *Station:*    ${stationType}`,
      `⏱️ *Duration:*   ${duration}`,
      ``,
      `Please confirm my slot! GGz 🔥`,
    ].join('\n');

    const encodedMsg = encodeURIComponent(message);
    const waURL      = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    // Open in new tab
    window.open(waURL, '_blank', 'noopener,noreferrer');

    // Show success feedback
    showSuccess(`Booking opened in WhatsApp! Sending as ${gamerTag} 🎉`);

    // Reset form after short delay
    setTimeout(() => {
      form.reset();
      clearError();
    }, 4000);
  });

  // Clear error on input change
  form.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      clearError();
    });
    el.addEventListener('change', () => {
      el.classList.remove('error');
      clearError();
    });
  });
}

/* Error / Success helpers */
function showError(msg) {
  const el = document.getElementById('formError');
  if (!el) return;
  el.style.color = 'var(--goat-red)';
  el.textContent = `⚠️ ${msg}`;
}

function showSuccess(msg) {
  const el = document.getElementById('formError');
  if (!el) return;
  el.style.color = 'var(--goat-accent)';
  el.textContent = `✅ ${msg}`;
}

function clearError() {
  const el = document.getElementById('formError');
  if (el) el.textContent = '';
}

/* ═══════════════════════════════════════════════════════
   MOBILE NAV BURGER (simple toggle)
═══════════════════════════════════════════════════════ */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const nav    = document.querySelector('.goat-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';

    if (isOpen) {
      nav.style.display = '';
      nav.style.flexDirection = '';
      nav.style.position = '';
      nav.style.top = '';
      nav.style.left = '';
      nav.style.right = '';
      nav.style.background = '';
      nav.style.padding = '';
      nav.style.borderBottom = '';
      nav.style.zIndex = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'fixed';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'rgba(10,10,10,0.98)';
      nav.style.padding = '1.5rem';
      nav.style.gap = '1.2rem';
      nav.style.borderBottom = '1px solid #2a2a2a';
      nav.style.zIndex = '999';
      nav.style.backdropFilter = 'blur(16px)';
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.style.display = '';
    }
  });
}

/* ═══════════════════════════════════════════════════════
   LIVE CLOCK — updates every minute in the header badge
   (optional UX polish)
═══════════════════════════════════════════════════════ */
function initLiveClock() {
  const badge = document.querySelector('.goat-hero__badge');
  if (!badge) return;

  function updateClock() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    badge.textContent = `⚡ LIVE NOW — ${hh}:${mm}`;
  }

  updateClock();
  setInterval(updateClock, 60_000);
}

/* ═══════════════════════════════════════════════════════
   XSS SANITISER
═══════════════════════════════════════════════════════ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ═══════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initBranchToggle();
  initBookingForm();
  initMobileNav();
  initLiveClock();
  renderDashboard(); // Initial render
});

/* ═══════════════════════════════════════════════════════
   FIREBASE INTEGRATION STUB
   Uncomment and fill in your config when ready.
   The rest of the code requires zero changes.
═══════════════════════════════════════════════════════ */
/*
import { initializeApp }              from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-database.js';

const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  databaseURL:       'https://YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId:         'YOUR_PROJECT',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// Listen for real-time updates on the entire database
onValue(ref(db, '/'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    Object.assign(APP_STATE, data);
    renderDashboard();
  }
});
*/
