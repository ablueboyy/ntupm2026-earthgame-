// ===== UI Update Functions =====

function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}

function updateInventoryUI() {
    if (phase !== 'setup') return;
    const inventoryDiv = document.getElementById('inventory-list');
    inventoryDiv.innerHTML = '<div class="inventory-header">📋 怪盜贓物清單（庫存）</div>';

    for (let icon in LIMITS) {
        const limit = LIMITS[icon];
        const currentCount = treasures.filter(t => t.icon === icon).length;
        const nameStr = NAMES_AND_SIZES[icon];

        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        if (currentCount >= limit) itemDiv.classList.add('limit-reached');
        itemDiv.innerHTML = `<span>${icon} ${nameStr}</span><span>${currentCount} / ${limit}</span>`;
        inventoryDiv.appendChild(itemDiv);
    }
}

function updatePlayReferenceUI() {
    if (phase !== 'play') return;
    const refDiv = document.getElementById('play-reference');
    refDiv.innerHTML = '<div class="inventory-header">📡 探測器分析：遺失物列表</div>';

    let hiddenCounts = {};
    let foundCounts = {};

    treasures.forEach(t => {
        hiddenCounts[t.icon] = (hiddenCounts[t.icon] || 0) + 1;
        if (t.foundCount === t.size) {
            foundCounts[t.icon] = (foundCounts[t.icon] || 0) + 1;
        }
    });

    for (let icon in hiddenCounts) {
        const total = hiddenCounts[icon];
        const found = foundCounts[icon] || 0;
        const nameStr = NAMES_AND_SIZES[icon];
        const pt = POINTS_MAP[treasures.find(t => t.icon === icon).size];

        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        if (found === total) {
            itemDiv.style.color = '#2ecc71';
            itemDiv.style.fontWeight = 'bold';
        }
        itemDiv.innerHTML = `<span>${icon} ${nameStr} <small>(${pt}分)</small></span><span>${found} / ${total}</span>`;
        refDiv.appendChild(itemDiv);
    }
}

function updateGMStatsUI() {
    document.getElementById('stat-win').innerText = gmStats.win;
    document.getElementById('stat-lose').innerText = gmStats.lose;
    document.getElementById('stat-secret').innerText = gmStats.secret;
    document.getElementById('stat-total').innerText = gmStats.total;
}

function renderUpdateLogs() {
    if (typeof UPDATE_LOGS === 'undefined') return;
    const container = document.getElementById('log-list-container');
    container.innerHTML = '';
    UPDATE_LOGS.forEach(log => {
        let html = `<span class="log-version-badge" style="background:${log.color};">Ver：${log.version} (${log.date})</span><ul class="log-items">`;
        log.items.forEach(item => { html += `<li>${item}</li>`; });
        html += `</ul>`;
        container.innerHTML += html;
    });
}

function renderEggList() {
    const container = document.getElementById('egg-list-container');
    container.innerHTML = '';
    for (let key in easterEggs) {
        const egg = easterEggs[key];
        const stylizedName = egg.name.replace(/《(.)(.*?)》/, '《<span class="acrostic-letter">$1</span>$2》');

        const div = document.createElement('div');
        div.className = `egg-item ${egg.unlocked ? 'egg-unlocked' : ''}`;

        if (egg.unlocked) {
            div.innerHTML = `<div class="egg-title">💿 ${stylizedName}</div>
                             <div class="egg-desc">達成條件：${egg.unlockcond || 'X'}</div>`;
        } else {
            div.innerHTML = `<div class="egg-title" style="color:#6b7280;">🔒 曲目未解鎖</div>
                             <div class="egg-desc">提示：${egg.hint || 'X'}</div>`;
        }
        container.appendChild(div);
    }
}

// ===== Instrument Selection Panel =====

function buildInstrumentPanel() {
    const panel = document.getElementById('instrument-panel');
    panel.innerHTML = '';
    INSTRUMENTS.forEach(inst => {
        const btn = document.createElement('button');
        btn.className = 'instrument-btn';
        btn.dataset.value = inst.value;
        btn.innerHTML = `
            <span class="inst-icon">${inst.icon}</span>
            <span class="inst-info">
                <span class="inst-name">${inst.name}</span>
                <span class="inst-detail">${inst.detail}</span>
            </span>
            <span class="inst-count">0/${LIMITS[inst.icon]}</span>`;
        btn.onclick = () => selectInstrument(inst.value);
        panel.appendChild(btn);
    });
    updateInstrumentButtons();
}

function selectInstrument(value) {
    selectedTreasureType = value;
    updateInstrumentButtons();
    clearPreview();
}

function updateInstrumentButtons() {
    // If the selected instrument is now maxed, auto-switch to first available
    const selIcon = selectedTreasureType.split(',')[2];
    if (treasures.filter(t => t.icon === selIcon).length >= LIMITS[selIcon]) {
        for (const inst of INSTRUMENTS) {
            const ic = inst.value.split(',')[2];
            if (treasures.filter(t => t.icon === ic).length < LIMITS[ic]) {
                selectedTreasureType = inst.value;
                break;
            }
        }
    }

    document.querySelectorAll('.instrument-btn').forEach(btn => {
        const val = btn.dataset.value;
        const icon = val.split(',')[2];
        const count = treasures.filter(t => t.icon === icon).length;
        const limit = LIMITS[icon];

        const countEl = btn.querySelector('.inst-count');
        if (countEl) countEl.textContent = `${count}/${limit}`;

        btn.classList.toggle('selected', val === selectedTreasureType);
        btn.classList.toggle('maxed', count >= limit);
    });
}

// ===== Modal Controls =====

function openLog() {
    renderUpdateLogs();
    document.getElementById('logModal').style.display = 'block';
}
function closeLog() {
    document.getElementById('logModal').style.display = 'none';
}

function openEggLog() {
    renderEggList();
    document.getElementById('eggModal').style.display = 'block';
}
function closeEggLog() {
    document.getElementById('eggModal').style.display = 'none';
}
