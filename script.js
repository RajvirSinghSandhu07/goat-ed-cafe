/**
 * G.O.A.T Gaming Cafe — Command Center
 * script.js  |  Shared by index.html (public) & admin.html (owner)
 *
 * ─────────────────────────────────────────────────────────────────
 * ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────
 * 1. APP_STATE   — single source of truth (mimics Firebase JSON).
 *                  Replace with Firebase onValue() listener later.
 * 2. PAGE_MODE   — 'public' | 'admin', detected on DOMContentLoaded.
 * 3. currentBranch — drives all renders reactively.
 * 4. renderDashboard() — public render.
 * 5. renderAdmin()     — admin render.
 *
 * ─────────────────────────────────────────────────────────────────
 * FIREBASE STUB (uncomment when ready)
 * ─────────────────────────────────────────────────────────────────
 * import { initializeApp }              from 'firebase/app';
 * import { getDatabase, ref, onValue, set } from 'firebase/database';
 * const db = getDatabase(initializeApp(firebaseConfig));
 * onValue(ref(db, '/'), snap => { Object.assign(APP_STATE, snap.val()); renderPage(); });
 * // To persist admin toggles:
 * set(ref(db, `/branches/${branch}/ps5/${idx}`), newStation);
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '918884655514'; // Replace with actual number

/* ═══════════════════════════════════════════════════════
   APP STATE  —  mirrors Firebase JSON schema
   Structure:
   {
     globalRecords: [ { rank, name, branch, pct, achievedIn } ],
     branches: {
       belroad:   { leaderboard: [...], ps5: [...3], pc: [...20] },
       jayanagar: { leaderboard: [...], ps5: [...3], pc: [...20] }
     }
   }
═══════════════════════════════════════════════════════ */
const APP_STATE = {

  /* ── GLOBAL ALL-TIME RECORD HOLDERS ── */
  globalRecords: [
    { rank: 1, name: 'VoidSlayer',  branch: 'Jayanagar', pct: 100, achievedIn: '14h 22m' },
    { rank: 2, name: 'WraithX',     branch: 'Bel Road',  pct: 97,  achievedIn: '—'       },
    { rank: 3, name: 'NightByte',   branch: 'Jayanagar', pct: 94,  achievedIn: '—'       },
  ],

  branches: {

    /* ── BEL ROAD ── */
    belroad: {
      leaderboard: [
        { rank: 1, name: 'WraithX',    pct: 97 },
        { rank: 2, name: 'ShadowKing', pct: 81 },
        { rank: 3, name: 'DeltaForce', pct: 73 },
      ],
      ps5: [
        { id: 'PS5-01', status: 'available', time: null },
        { id: 'PS5-02', status: 'booked',    time: '01:30 AM' },
        { id: 'PS5-03', status: 'available', time: null },
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

    /* ── JAYANAGAR ── */
    jayanagar: {
      leaderboard: [
        { rank: 1, name: 'VoidSlayer', pct: 100 },
        { rank: 2, name: 'NightByte',  pct: 94  },
        { rank: 3, name: 'NeonRaider', pct: 85  },
      ],
      ps5: [
        { id: 'PS5-01', status: 'booked',    time: '01:00 AM' },
        { id: 'PS5-02', status: 'available', time: null },
        { id: 'PS5-03', status: 'booked',    time: '02:30 AM' },
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
  },
};

/* ═══════════════════════════════════════════════════════
   REACTIVE STATE
═══════════════════════════════════════════════════════ */
let currentBranch = 'belroad'; // 'belroad' | 'jayanagar'
let PAGE_MODE     = 'public';  // 'public' | 'admin'

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str ?? '')));
  return d.innerHTML;
}

function branchLabel(key) {
  return key === 'belroad' ? 'NEW BEL ROAD' : 'JAYANAGAR';
}

/** Average pct across a leaderboard array */
function avgPct(players) {
  if (!players || !players.length) return 0;
  return Math.round(players.reduce((s, p) => s + p.pct, 0) / players.length);
}

function stationIcon(type, status) {
  if (type === 'ps5') return status === 'available' ? '🎮' : '🔒';
  return status === 'available' ? '💻' : '🔒';
}

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

/* ═══════════════════════════════════════════════════════
   PUBLIC RENDERS
═══════════════════════════════════════════════════════ */

/* A: Global Record Holders */
function renderGlobalRecords() {
  const el = document.getElementById('globalRecordsList');
  if (!el) return;
  el.innerHTML = APP_STATE.globalRecords.map(p => /* html */`
    <div class="global-record-row">
      <span class="global-record-row__medal">${MEDAL[p.rank] || p.rank}</span>
      <div class="global-record-row__info">
        <div class="global-record-row__name">${escapeHtml(p.name)}</div>
        <div class="global-record-row__meta">${escapeHtml(p.branch)} · ${p.achievedIn !== '—' ? 'Completed in ' + escapeHtml(p.achievedIn) : 'In Progress'}</div>
      </div>
      <span class="global-record-row__pct">${p.pct}%</span>
    </div>
  `).join('');
}

/* B: Inter-Branch Rivalry */
function renderRivalryBars() {
  const el = document.getElementById('rivalryBars');
  if (!el) return;

  const belAvg = avgPct(APP_STATE.branches.belroad.leaderboard);
  const jayAvg = avgPct(APP_STATE.branches.jayanagar.leaderboard);
  const winner = belAvg >= jayAvg ? 'NEW BEL ROAD' : 'JAYANAGAR';

  el.innerHTML = /* html */`
    <div class="rivalry-row rivalry-row--belroad">
      <div class="rivalry-row__header">
        <span class="rivalry-row__name">📍 New Bel Road</span>
        <span class="rivalry-row__pct">${belAvg}%</span>
      </div>
      <div class="rivalry-bar-track">
        <div class="rivalry-bar-fill" style="width: ${belAvg}%"></div>
      </div>
      <span class="rivalry-row__sub">Top 3 Average Story %</span>
    </div>

    <div class="rivalry-row rivalry-row--jayanagar">
      <div class="rivalry-row__header">
        <span class="rivalry-row__name">📍 Jayanagar</span>
        <span class="rivalry-row__pct">${jayAvg}%</span>
      </div>
      <div class="rivalry-bar-track">
        <div class="rivalry-bar-fill" style="width: ${jayAvg}%"></div>
      </div>
      <span class="rivalry-row__sub">Top 3 Average Story %</span>
    </div>

    <div class="rivalry-winner">
      ⚔️ Currently Leading: <span>${escapeHtml(winner)}</span>
    </div>
  `;
}

/* C: Local Branch Top 3 */
function renderLocalLeaderboard() {
  const el  = document.getElementById('localLeaderboard');
  const sub = document.getElementById('localLbSub');
  if (!el) return;

  const players = APP_STATE.branches[currentBranch].leaderboard;
  if (sub) sub.textContent = `${branchLabel(currentBranch)} Branch Leaders`;

  el.innerHTML = players.map(p => /* html */`
    <div class="local-lb-row">
      <span class="local-lb-row__rank">${p.rank}</span>
      <div class="local-lb-row__info">
        <div class="local-lb-row__name">${escapeHtml(p.name)}</div>
        <div class="local-lb-row__bar-wrap">
          <div class="local-lb-row__bar" style="width:${p.pct}%"></div>
        </div>
      </div>
      <span class="local-lb-row__pct">${p.pct}%</span>
    </div>
  `).join('');
}

/* Station grid (public read-only) */
function renderStationGrid(stations, gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = stations.map(s => {
    const avail = s.status === 'available';
    return /* html */`
      <div class="station-block ${s.status}"
        role="status"
        aria-label="${escapeHtml(s.id)} — ${s.status}${s.time ? ' until ' + s.time : ''}">
        <span class="station-block__icon">${stationIcon(type, s.status)}</span>
        <span class="station-block__id">${escapeHtml(s.id)}</span>
        <span class="station-block__status">${avail ? 'OPEN' : 'BOOKED'}</span>
        ${!avail ? `<span class="station-block__time">Until ${escapeHtml(s.time)}</span>` : ''}
      </div>
    `;
  }).join('');

  const avail   = stations.filter(s => s.status === 'available').length;
  const countId = gridId === 'ps5Grid' ? 'ps5AvailCount' : 'pcAvailCount';
  const counter = document.getElementById(countId);
  if (counter) {
    counter.textContent = `${avail} / ${stations.length} Available`;
    counter.style.color = avail > 0 ? 'var(--goat-accent)' : 'var(--goat-red)';
  }
}

/** Master public render — call on branch change or data push */
function renderDashboard() {
  const data = APP_STATE.branches[currentBranch];
  if (!data) return;

  renderGlobalRecords();
  renderRivalryBars();
  renderLocalLeaderboard();
  renderStationGrid(data.ps5, 'ps5Grid', 'ps5');
  renderStationGrid(data.pc,  'pcGrid',  'pc');

  const liveLabel = document.getElementById('branchLiveLabel');
  if (liveLabel) liveLabel.textContent = `● LIVE: ${branchLabel(currentBranch)}`;

  const bookingLabel = document.getElementById('bookingBranchLabel');
  if (bookingLabel) bookingLabel.textContent = branchLabel(currentBranch);
}


/* ═══════════════════════════════════════════════════════
   ADMIN RENDERS
═══════════════════════════════════════════════════════ */

/* Stats summary bar */
function renderAdminStats() {
  const el = document.getElementById('adminStatsBar');
  if (!el) return;

  const data      = APP_STATE.branches[currentBranch];
  const ps5Avail  = data.ps5.filter(s => s.status === 'available').length;
  const ps5Booked = data.ps5.length - ps5Avail;
  const pcAvail   = data.pc.filter(s => s.status === 'available').length;
  const pcBooked  = data.pc.length - pcAvail;
  const totalAvail = ps5Avail + pcAvail;
  const totalBooked = ps5Booked + pcBooked;
  const occupancy   = Math.round((totalBooked / (data.ps5.length + data.pc.length)) * 100);

  el.innerHTML = /* html */`
    <div class="admin-stat-card">
      <span class="admin-stat-card__label">PS5 Available</span>
      <span class="admin-stat-card__value avail">${ps5Avail}</span>
      <span class="admin-stat-card__sub">of ${data.ps5.length} stations</span>
    </div>
    <div class="admin-stat-card">
      <span class="admin-stat-card__label">PS5 Booked</span>
      <span class="admin-stat-card__value booked-v">${ps5Booked}</span>
      <span class="admin-stat-card__sub">of ${data.ps5.length} stations</span>
    </div>
    <div class="admin-stat-card">
      <span class="admin-stat-card__label">PC Available</span>
      <span class="admin-stat-card__value avail">${pcAvail}</span>
      <span class="admin-stat-card__sub">of ${data.pc.length} stations</span>
    </div>
    <div class="admin-stat-card">
      <span class="admin-stat-card__label">PC Booked</span>
      <span class="admin-stat-card__value booked-v">${pcBooked}</span>
      <span class="admin-stat-card__sub">of ${data.pc.length} stations</span>
    </div>
    <div class="admin-stat-card">
      <span class="admin-stat-card__label">Occupancy</span>
      <span class="admin-stat-card__value" style="color: ${occupancy >= 70 ? 'var(--goat-red)' : 'var(--goat-accent)'}">${occupancy}%</span>
      <span class="admin-stat-card__sub">${totalBooked} of ${data.ps5.length + data.pc.length} occupied</span>
    </div>
  `;
}

/* Admin station toggle grid */
function renderAdminStationGrid(stations, gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = stations.map((s, idx) => {
    const avail = s.status === 'available';
    return /* html */`
      <button
        class="admin-station-btn ${s.status}"
        data-type="${type}"
        data-idx="${idx}"
        data-branch="${currentBranch}"
        aria-pressed="${!avail}"
        title="Click to toggle ${escapeHtml(s.id)}"
      >
        <span class="admin-station-btn__icon">${stationIcon(type, s.status)}</span>
        <span>${escapeHtml(s.id)}</span>
        <span class="admin-station-btn__time">${s.time ? 'Until ' + escapeHtml(s.time) : avail ? 'OPEN' : ''}</span>
      </button>
    `;
  }).join('');

  // Count badge
  const avail   = stations.filter(s => s.status === 'available').length;
  const countId = gridId === 'adminPs5Grid' ? 'adminPs5Count' : 'adminPcCount';
  const counter = document.getElementById(countId);
  if (counter) {
    counter.textContent = `${avail} / ${stations.length} Available`;
    counter.style.color = avail > 0 ? 'var(--goat-accent)' : 'var(--goat-red)';
  }

  // Attach click handlers
  grid.querySelectorAll('.admin-station-btn').forEach(btn => {
    btn.addEventListener('click', handleAdminStationToggle);
  });
}

/* Leaderboard editor (local branch) */
function renderAdminLbEditor() {
  const el = document.getElementById('adminLbEditor');
  const branchTag = document.getElementById('adminLbBranchLabel');
  if (!el) return;

  if (branchTag) branchTag.textContent = branchLabel(currentBranch);

  const players = APP_STATE.branches[currentBranch].leaderboard;
  el.innerHTML = players.map((p, i) => /* html */`
    <div class="lb-editor-row" data-idx="${i}" data-scope="local">
      <span class="lb-editor-row__rank">${p.rank}</span>
      <input
        class="lb-editor__input"
        type="text"
        data-field="name"
        value="${escapeHtml(p.name)}"
        placeholder="Player name"
        maxlength="30"
        aria-label="Player name rank ${p.rank}"
      />
      <div class="lb-editor__pct-wrap lb-editor-row__pct">
        <input
          class="lb-editor__input"
          type="number"
          data-field="pct"
          value="${p.pct}"
          min="0" max="100"
          aria-label="Story % rank ${p.rank}"
        />
        <span class="lb-editor__pct-symbol">%</span>
      </div>
      <button class="lb-editor__save-btn lb-editor-row__action" data-idx="${i}" data-scope="local">SAVE</button>
    </div>
  `).join('');

  el.querySelectorAll('.lb-editor__save-btn').forEach(btn => {
    btn.addEventListener('click', handleLbSave);
  });
}

/* Global record holder editor */
function renderAdminGlobalLbEditor() {
  const el = document.getElementById('adminGlobalLbEditor');
  if (!el) return;

  el.innerHTML = APP_STATE.globalRecords.map((p, i) => /* html */`
    <div class="lb-editor-row" data-idx="${i}" data-scope="global">
      <span class="lb-editor-row__rank">${MEDAL[p.rank] || p.rank}</span>
      <input
        class="lb-editor__input"
        type="text"
        data-field="name"
        value="${escapeHtml(p.name)}"
        placeholder="Player name"
        maxlength="30"
        aria-label="Global record player name rank ${p.rank}"
      />
      <div class="lb-editor__pct-wrap lb-editor-row__pct">
        <input
          class="lb-editor__input"
          type="number"
          data-field="pct"
          value="${p.pct}"
          min="0" max="100"
          aria-label="Story % rank ${p.rank}"
        />
        <span class="lb-editor__pct-symbol">%</span>
      </div>
      <button class="lb-editor__save-btn lb-editor-row__action" data-idx="${i}" data-scope="global">SAVE</button>
    </div>
  `).join('');

  el.querySelectorAll('.lb-editor__save-btn').forEach(btn => {
    btn.addEventListener('click', handleLbSave);
  });
}

/** Master admin render */
function renderAdmin() {
  renderAdminStats();
  renderAdminStationGrid(APP_STATE.branches[currentBranch].ps5, 'adminPs5Grid', 'ps5');
  renderAdminStationGrid(APP_STATE.branches[currentBranch].pc,  'adminPcGrid',  'pc');
  renderAdminLbEditor();
  renderAdminGlobalLbEditor();

  const lbl = document.getElementById('adminBranchLabel');
  if (lbl) lbl.textContent = `● MANAGING: ${branchLabel(currentBranch)}`;
}


/* ═══════════════════════════════════════════════════════
   ADMIN: STATION TOGGLE HANDLER
═══════════════════════════════════════════════════════ */

/* Pending toggle state (waiting for time modal) */
let _pendingToggle = null;

function handleAdminStationToggle(e) {
  const btn    = e.currentTarget;
  const type   = btn.dataset.type;      // 'ps5' | 'pc'
  const idx    = parseInt(btn.dataset.idx, 10);
  const branch = btn.dataset.branch;
  const station = APP_STATE.branches[branch][type][idx];

  if (station.status === 'available') {
    // Going → booked: ask for end time
    _pendingToggle = { type, idx, branch };
    openTimeModal(station.id);
  } else {
    // Going → available
    station.status = 'available';
    station.time   = null;
    renderAdmin();
    showToast(`✅ ${station.id} marked as AVAILABLE`);
    // 🔥 Firebase write point: set(ref(db, `branches/${branch}/${type}/${idx}`), station);
  }
}

function openTimeModal(stationId) {
  const overlay = document.getElementById('timeModalOverlay');
  const title   = document.getElementById('timeModalTitle');
  const input   = document.getElementById('timeModalInput');
  if (!overlay) return;

  if (title) title.textContent = `📌 Mark ${stationId} as Booked`;
  if (input) { input.value = ''; input.focus(); }
  overlay.classList.add('open');
}

function closeTimeModal() {
  const overlay = document.getElementById('timeModalOverlay');
  if (overlay) overlay.classList.remove('open');
  _pendingToggle = null;
}

function confirmTimeModal() {
  if (!_pendingToggle) return;

  const input   = document.getElementById('timeModalInput');
  const rawTime = input ? input.value.trim() : '';
  const time    = rawTime || 'TBD';

  const { type, idx, branch } = _pendingToggle;
  const station = APP_STATE.branches[branch][type][idx];
  station.status = 'booked';
  station.time   = time;

  closeTimeModal();
  renderAdmin();
  showToast(`🔒 ${station.id} marked BOOKED until ${time}`);
  // 🔥 Firebase write point: set(ref(db, `branches/${branch}/${type}/${idx}`), station);
}

/* ═══════════════════════════════════════════════════════
   ADMIN: LEADERBOARD SAVE HANDLER
═══════════════════════════════════════════════════════ */
function handleLbSave(e) {
  const btn   = e.currentTarget;
  const scope = btn.dataset.scope; // 'local' | 'global'
  const idx   = parseInt(btn.dataset.idx, 10);
  const row   = btn.closest('.lb-editor-row');

  const nameInput = row.querySelector('input[data-field="name"]');
  const pctInput  = row.querySelector('input[data-field="pct"]');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newPct  = pctInput  ? Math.min(100, Math.max(0, parseInt(pctInput.value, 10) || 0)) : 0;

  if (!newName) { showToast('⚠️ Player name cannot be empty.', true); return; }

  if (scope === 'local') {
    APP_STATE.branches[currentBranch].leaderboard[idx].name = newName;
    APP_STATE.branches[currentBranch].leaderboard[idx].pct  = newPct;
    // 🔥 Firebase write point: set(ref(db, `branches/${currentBranch}/leaderboard/${idx}`), {...});
  } else {
    APP_STATE.globalRecords[idx].name = newName;
    APP_STATE.globalRecords[idx].pct  = newPct;
    // 🔥 Firebase write point: set(ref(db, `globalRecords/${idx}`), {...});
  }

  // Flash the button
  btn.textContent = '✓ SAVED';
  btn.classList.add('saved');
  setTimeout(() => { btn.textContent = 'SAVE'; btn.classList.remove('saved'); }, 2000);

  showToast(`✅ Rank ${idx + 1} updated: ${newName} — ${newPct}%`);
}


/* ═══════════════════════════════════════════════════════
   BRANCH TOGGLE (shared — works on both pages)
═══════════════════════════════════════════════════════ */
function initBranchToggle() {
  const buttons = document.querySelectorAll('.branch-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const branch = btn.dataset.branch;
      if (branch === currentBranch) return;

      currentBranch = branch;
      buttons.forEach(b => {
        b.classList.toggle('active', b.dataset.branch === branch);
        b.setAttribute('aria-pressed', b.dataset.branch === branch ? 'true' : 'false');
      });

      PAGE_MODE === 'admin' ? renderAdmin() : renderDashboard();
    });
  });
}

/* ═══════════════════════════════════════════════════════
   BOOKING FORM (public only)
═══════════════════════════════════════════════════════ */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearFormMsg();

    const gamerTag    = document.getElementById('gamerTag').value.trim();
    const stationType = document.getElementById('stationType').value;
    const duration    = document.getElementById('duration').value;
    const branch      = branchLabel(currentBranch);

    const errors = [];
    if (!gamerTag)    errors.push('Enter your Gamer Tag.');
    if (!stationType) errors.push('Select a Station Type.');
    if (!duration)    errors.push('Select a Duration.');

    if (errors.length) {
      showFormMsg(errors.join(' '), 'error');
      if (!gamerTag)    document.getElementById('gamerTag').classList.add('error');
      if (!stationType) document.getElementById('stationType').classList.add('error');
      if (!duration)    document.getElementById('duration').classList.add('error');
      return;
    }

    const msg = [
      `🎮 *G.O.A.T Gaming Cafe — VIP Booking Request*`,
      ``,
      `👾 *Gamer Tag:*  ${gamerTag}`,
      `📍 *Branch:*     ${branch}`,
      `🕹️ *Station:*    ${stationType}`,
      `⏱️ *Duration:*   ${duration}`,
      ``,
      `Please confirm my slot! GGz 🔥`,
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showFormMsg(`Booking request sent as ${gamerTag}! 🎉`, 'success');
    setTimeout(() => { form.reset(); clearFormMsg(); }, 4500);
  });

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input',  () => { el.classList.remove('error'); clearFormMsg(); });
    el.addEventListener('change', () => { el.classList.remove('error'); clearFormMsg(); });
  });
}

function showFormMsg(msg, type) {
  const el = document.getElementById('formError');
  if (!el) return;
  el.style.color = type === 'error' ? 'var(--goat-red)' : 'var(--goat-accent)';
  el.textContent = type === 'error' ? `⚠️ ${msg}` : `✅ ${msg}`;
}
function clearFormMsg() {
  const el = document.getElementById('formError');
  if (el) el.textContent = '';
}


/* ═══════════════════════════════════════════════════════
   ADMIN TOAST NOTIFICATION
═══════════════════════════════════════════════════════ */
let _toastTimer = null;
function showToast(msg, isWarn = false) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;

  toast.textContent = msg;
  toast.style.borderColor = isWarn ? 'var(--goat-red)' : 'var(--goat-accent)';
  toast.style.color       = isWarn ? 'var(--goat-red)' : 'var(--goat-accent)';
  toast.classList.add('show');

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}


/* ═══════════════════════════════════════════════════════
   TIME MODAL EVENT LISTENERS (admin)
═══════════════════════════════════════════════════════ */
function initTimeModal() {
  const overlay = document.getElementById('timeModalOverlay');
  const cancel  = document.getElementById('timeModalCancel');
  const confirm = document.getElementById('timeModalConfirm');
  const input   = document.getElementById('timeModalInput');
  if (!overlay) return;

  cancel.addEventListener('click', closeTimeModal);
  confirm.addEventListener('click', confirmTimeModal);

  // Enter key in input = confirm
  input && input.addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmTimeModal();
    if (e.key === 'Escape') closeTimeModal();
  });

  // Click outside modal = cancel
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeTimeModal();
  });
}


/* ═══════════════════════════════════════════════════════
   MOBILE NAV (public)
═══════════════════════════════════════════════════════ */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const nav    = document.querySelector('.goat-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    if (open) {
      Object.assign(nav.style, {
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: '68px', left: '0', right: '0', background: 'rgba(10,10,10,0.97)',
        padding: '1.5rem', gap: '1.2rem', borderBottom: '1px solid #242424',
        zIndex: '999', backdropFilter: 'blur(14px)',
      });
    } else {
      nav.removeAttribute('style');
    }
  });

  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('mobile-open');
      nav.removeAttribute('style');
    }
  });
}


/* ═══════════════════════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════════════════════ */
function initLiveClock() {
  const badge = document.getElementById('liveBadge');
  if (!badge) return;
  const tick = () => {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    badge.textContent = `⚡ LIVE NOW — ${hh}:${mm}`;
  };
  tick();
  setInterval(tick, 60_000);
}


/* ═══════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Detect which page we're on
  const isAdmin  = !!document.getElementById('adminContainer');
  const isPublic = !!document.getElementById('publicContainer');
  PAGE_MODE = isAdmin ? 'admin' : 'public';

  // Always init
  initBranchToggle();
  initMobileNav();

  if (isPublic) {
    initBookingForm();
    initLiveClock();
    renderDashboard();
  }

  if (isAdmin) {
    initTimeModal();
    renderAdmin();
  }

});
