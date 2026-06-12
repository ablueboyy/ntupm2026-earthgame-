// ===== Core Game Logic =====

function initData() {
    if (typeof EASTER_EGGS !== 'undefined') {
        easterEggs = JSON.parse(JSON.stringify(EASTER_EGGS));
    }
}

// ===== Mode Toggle =====

function toggleMode() {
    isFlagMode = !isFlagMode;
    const btn = document.getElementById('mode-toggle-btn');
    if (isFlagMode) {
        btn.innerText = '目前狀態：🚩 空地標記模式';
        btn.style.background = 'linear-gradient(135deg, #c0392b, #922b21)';
    } else {
        btn.innerText = '目前狀態：⛏️ 挖掘探測模式';
        btn.style.background = '';
    }

    if (phase === 'play') {
        const now = Date.now();
        if (!window._toggleTimestamps) window._toggleTimestamps = [];
        window._toggleTimestamps.push(now);
        window._toggleTimestamps = window._toggleTimestamps.filter(t => now - t <= 30000);
        if (window._toggleTimestamps.length >= 10 && easterEggs['egg6'] && !easterEggs['egg6'].unlocked) {
            window._toggleTimestamps = [];
            unlockEgg('egg6');
        }
    }
}

// ===== Import / Export =====

function exportCode() {
    if (treasures.length === 0) {
        showMessage('⚠️ 請至少藏匿一個樂器再匯出！');
        return;
    }
    try {
        const compressedString = treasures.map(t => {
            const charId = ICON_TO_CHAR[t.icon];
            const coords = t.cells.map(pos => pos.r.toString(16) + pos.c.toString(16)).join('');
            return charId + coords;
        }).join('-');

        const codeString = 'NTU-' + btoa(compressedString);

        navigator.clipboard.writeText(codeString).then(() => {
            alert('✅ 藏匿密報已成功複製！\n請傳送給你要挑戰的對手。');
            showMessage('📤 藏匿密報已複製，等待對手匯入...');
        }).catch(() => {
            prompt('請手動複製以下代碼，並傳給對手：', codeString);
        });
    } catch (e) {
        console.error('匯出失敗:', e);
        alert('❌ 匯出失敗，請確認瀏覽器支援。');
    }
}

function importCode() {
    let codeString = prompt('📥 請貼上對手傳給你的藏匿密報：');
    if (!codeString) return;
    codeString = codeString.trim();

    try {
        if (!codeString.startsWith('NTU-')) throw new Error('Invalid Code');

        const decodedString = atob(codeString.substring(4));
        const parts = decodedString.split('-');

        const importedTreasures = parts.map((part, index) => {
            const icon = CHAR_TO_ICON[part[0]];
            const cells = [];
            for (let i = 1; i < part.length; i += 2) {
                cells.push({ r: parseInt(part[i], 16), c: parseInt(part[i + 1], 16) });
            }
            return { id: index + 1, icon: icon, cells: cells, size: cells.length, foundCount: 0 };
        });

        if (importedTreasures.length === 0 || !importedTreasures[0].icon) throw new Error('Format Error');

        initBoard();
        treasures = importedTreasures;
        treasureIdCounter = treasures.length > 0 ? Math.max(...treasures.map(t => t.id)) + 1 : 1;
        totalTreasureCells = 0;

        treasures.forEach(treasure => {
            totalTreasureCells += treasure.size;
            treasure.cells.forEach(pos => {
                board[pos.r][pos.c].treasureId = treasure.id;
            });
        });

        const b1 = placeRandomBlob(8, '👾');
        const b2 = placeRandomBlob(8, '👾');
        let blobCount = (b1 ? 1 : 0) + (b2 ? 1 : 0);

        movesLeft = DEFAULT_MOVES;
        gmStats = { win: 0, lose: 0, secret: 0, total: 0, authorUnlocked: false };
        executePlayPhase(blobCount, '🚨 對手陣型匯入成功！任務開始！');

    } catch (e) {
        alert('❌ 匯入失敗！代碼無效。請確認對手提供的是「NTU-」開頭的新版代碼。');
        console.error('匯入錯誤:', e);
    }
}

// ===== GM Controls =====

function addMoves(amount, type) {
    if (amount < 0 && movesLeft === 0) {
        showMessage('⏪ 已經是 0 步了，無法再扣除電量！');
        return;
    }

    let actualAmount = amount;
    if (movesLeft + amount < 0) actualAmount = -movesLeft;

    movesLeft += actualAmount;
    document.getElementById('moves-display').innerText = movesLeft;

    if (type === 'win') gmStats.win++;
    else if (type === 'lose') gmStats.lose++;

    gmStats.total += actualAmount;

    updateGMStatsUI();
    saveGame();

    if (actualAmount > 0) {
        showMessage(`🔋 充電成功！獲得 ${actualAmount} 單位電量，目前共有 ${movesLeft} 步可以掃描。`);
    } else {
        showMessage(`⏪ 已收回 ${Math.abs(actualAmount)} 單位電量！目前剩下 ${movesLeft} 步。`);
    }
}

function manualSettle() {
    if (confirm('確定要立刻結算並公開所有怪盜藏匿點嗎？結算後將無法繼續搜索！')) {
        movesLeft = 0;
        document.getElementById('moves-display').innerText = movesLeft;
        showMessage(`🛑 搜索行動結束！本次小隊共尋回價值 ${score} 分的樂器！`);
        endGameDisplay();
        clearSave();
    }
}

// ===== Save / Load =====

function saveGame() {
    const gameState = {
        board, treasures, phase, score, movesLeft, treasureIdCounter, totalTreasureCells,
        gmStats, easterEggs
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function clearSave() {
    localStorage.removeItem(SAVE_KEY);
}

function restartGame() {
    if (!confirm('確定要重新一局嗎？這將清除小隊目前的所有進度！')) return;
    if (!confirm('再次確認：真的要清除存檔並重新開始嗎？')) return;
    clearSave();
    location.reload();
}

// ===== Treasure Placement =====

function placeTreasure(r, c) {
    const typeInfo = selectedTreasureType.split(',');
    const w = parseInt(typeInfo[0]);
    const h = parseInt(typeInfo[1]);
    const icon = typeInfo[2];

    if (treasures.filter(t => t.icon === icon).length >= LIMITS[icon]) {
        showMessage(`❗ ${icon} 的數量已經達到上限！`);
        return;
    }
    if (r + h > SIZE || c + w > SIZE) {
        showMessage('❗ 超出荒野範圍了！');
        return;
    }

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (board[r + i][c + j].treasureId !== 0) {
                showMessage('❗ 這裡已經埋了其他東西！');
                return;
            }
        }
    }

    const newTreasure = { id: treasureIdCounter, icon: icon, cells: [], size: w * h, foundCount: 0 };
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            board[r + i][c + j].treasureId = treasureIdCounter;
            newTreasure.cells.push({ r: r + i, c: c + j });
            const cellDiv = document.getElementById(`cell-${r + i}-${c + j}`);
            cellDiv.classList.add('setup-treasure');
            cellDiv.innerText = icon;
        }
    }

    treasures.push(newTreasure);
    treasureIdCounter++;
    totalTreasureCells += w * h;
    showMessage(`✅ 成功隱藏 ${icon}！`);
    updateInventoryUI();
    updateInstrumentButtons();
    saveGame();
    clearPreview();
    handleCellHover(r, c);
}

function removeTreasure(r, c) {
    const treasureIndex = treasures.findIndex(t => t.id === board[r][c].treasureId);
    if (treasureIndex === -1) return;

    const treasure = treasures[treasureIndex];
    treasure.cells.forEach(pos => {
        board[pos.r][pos.c].treasureId = 0;
        const cellDiv = document.getElementById(`cell-${pos.r}-${pos.c}`);
        cellDiv.classList.remove('setup-treasure');
        cellDiv.innerText = '';
    });

    totalTreasureCells -= treasure.size;
    treasures.splice(treasureIndex, 1);
    showMessage(`🗑️ 已挖出 ${treasure.icon}，請重新選擇掩埋地點！`);
    updateInventoryUI();
    updateInstrumentButtons();
    saveGame();
    clearPreview();
    handleCellHover(r, c);
}

function placeRandomTreasure(w, h, icon) {
    for (let attempt = 0; attempt < 100; attempt++) {
        let r = Math.floor(Math.random() * (SIZE - h + 1));
        let c = Math.floor(Math.random() * (SIZE - w + 1));
        let canPlace = true;

        for (let i = 0; i < h && canPlace; i++) {
            for (let j = 0; j < w; j++) {
                if (board[r + i][c + j].treasureId !== 0) { canPlace = false; break; }
            }
        }

        if (canPlace) {
            const newTreasure = { id: treasureIdCounter, icon: icon, cells: [], size: w * h, foundCount: 0 };
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    board[r + i][c + j].treasureId = treasureIdCounter;
                    newTreasure.cells.push({ r: r + i, c: c + j });
                }
            }
            treasures.push(newTreasure);
            treasureIdCounter++;
            totalTreasureCells += w * h;
            return true;
        }
    }
    return false;
}

// ===== Blob Placement (for 👾 traps) =====

function getValidNeighbors(r, c, currentBlob) {
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return dirs
        .map(d => ({ r: r + d[0], c: c + d[1] }))
        .filter(p =>
            p.r >= 0 && p.r < SIZE && p.c >= 0 && p.c < SIZE &&
            board[p.r][p.c].treasureId === 0 &&
            !currentBlob.some(b => b.r === p.r && b.c === p.c)
        );
}

function findMostEmptyCell() {
    let dist = Array.from({ length: SIZE }, () => Array(SIZE).fill(Infinity));
    let queue = [];

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c].treasureId !== 0) {
                dist[r][c] = 0;
                queue.push({ r, c });
            }
        }
    }

    if (queue.length === 0) return { r: Math.floor(SIZE / 2), c: Math.floor(SIZE / 2) };

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let head = 0;
    while (head < queue.length) {
        let { r, c } = queue[head++];
        for (let d of dirs) {
            let nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && dist[r][c] + 1 < dist[nr][nc]) {
                dist[nr][nc] = dist[r][c] + 1;
                queue.push({ r: nr, c: nc });
            }
        }
    }

    let maxDist = -1;
    let candidates = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c].treasureId === 0) {
                if (dist[r][c] > maxDist) { maxDist = dist[r][c]; candidates = [{ r, c }]; }
                else if (dist[r][c] === maxDist) { candidates.push({ r, c }); }
            }
        }
    }
    return candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : null;
}

function placeRandomBlob(targetSize, icon) {
    for (let attempt = 0; attempt < 100; attempt++) {
        let startR, startC;

        if (attempt < 20) {
            const startCell = findMostEmptyCell();
            if (!startCell) return false;
            const rOffset = Math.floor(Math.random() * 3) - 1;
            const cOffset = Math.floor(Math.random() * 3) - 1;
            startR = Math.max(0, Math.min(SIZE - 1, startCell.r + rOffset));
            startC = Math.max(0, Math.min(SIZE - 1, startCell.c + cOffset));
            if (board[startR][startC].treasureId !== 0) { startR = startCell.r; startC = startCell.c; }
        } else {
            startR = Math.floor(Math.random() * SIZE);
            startC = Math.floor(Math.random() * SIZE);
            if (board[startR][startC].treasureId !== 0) continue;
        }

        let blobCells = [{ r: startR, c: startC }];
        let candidates = getValidNeighbors(startR, startC, blobCells);

        while (blobCells.length < targetSize && candidates.length > 0) {
            const randIdx = Math.floor(Math.random() * candidates.length);
            const nextCell = candidates[randIdx];
            blobCells.push(nextCell);
            candidates.splice(randIdx, 1);
            for (let nn of getValidNeighbors(nextCell.r, nextCell.c, blobCells)) {
                if (!candidates.some(c => c.r === nn.r && c.c === nn.c)) candidates.push(nn);
            }
        }

        if (blobCells.length === targetSize) {
            const mysteryTreasure = { id: treasureIdCounter, icon: icon, cells: [], size: targetSize, foundCount: 0 };
            blobCells.forEach(pos => {
                board[pos.r][pos.c].treasureId = treasureIdCounter;
                mysteryTreasure.cells.push({ r: pos.r, c: pos.c });
            });
            treasures.push(mysteryTreasure);
            treasureIdCounter++;
            totalTreasureCells += targetSize;
            return true;
        }
    }
    return false;
}

// ===== Game Phase Transitions =====

function startGame() {
    if (treasures.length === 0) { showMessage('⚠️ 請至少藏匿一個樂器！'); return; }

    const b1 = placeRandomBlob(8, '👾');
    const b2 = placeRandomBlob(8, '👾');
    const blobCount = (b1 ? 1 : 0) + (b2 ? 1 : 0);

    gmStats = { win: 0, lose: 0, secret: 0, total: 0, authorUnlocked: false };
    updateGMStatsUI();

    executePlayPhase(blobCount, '🚨 任務開始！小隊必須解鎖步數才能開始尋寶。');
}

function randomStartGame() {
    if (!confirm('確定要隨機生成地圖並以 90 步開始嗎？原本的配置將會被清除！')) return;

    initBoard();
    for (let icon in LIMITS) {
        const shape = SHAPE_MAP[icon];
        for (let i = 0; i < LIMITS[icon]; i++) {
            placeRandomTreasure(shape.w, shape.h, icon);
        }
    }

    const b1 = placeRandomBlob(8, '👾');
    const b2 = placeRandomBlob(8, '👾');
    const blobCount = (b1 ? 1 : 0) + (b2 ? 1 : 0);

    movesLeft = 90;
    gmStats = { win: 0, lose: 0, secret: 0, total: 90, authorUnlocked: false };
    updateGMStatsUI();

    executePlayPhase(blobCount, '🎲 隨機地圖生成完畢！已提供 90 步雷達電量，開始尋寶！');
}

function executePlayPhase(blobCount, defaultMsg) {
    phase = 'play';
    score = 0;

    document.getElementById('setup-panel').style.display = 'none';
    document.getElementById('play-panel').style.display = 'block';
    document.getElementById('flag-controls').style.display = 'block';
    document.getElementById('instrument-panel').style.display = 'none';
    document.getElementById('moves-display').innerText = movesLeft;
    document.getElementById('score-display').innerText = score;

    updatePlayReferenceUI();

    showMessage(blobCount > 0
        ? defaultMsg + ` (已產生 ${blobCount} 個 👾 神秘彩蛋)`
        : defaultMsg
    );

    clearPreview();
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cellDiv = document.getElementById(`cell-${r}-${c}`);
            cellDiv.classList.remove('setup-treasure');
            cellDiv.innerText = '';
        }
    }
    saveGame();
}

// ===== Gameplay Actions =====

function toggleFlag(r, c) {
    if (phase !== 'play' || board[r][c].revealed) return;
    board[r][c].flagged = !board[r][c].flagged;
    const cellDiv = document.getElementById(`cell-${r}-${c}`);
    if (board[r][c].flagged) {
        cellDiv.innerText = '🚩';
        cellDiv.classList.add('flagged');
    } else {
        cellDiv.innerText = '';
        cellDiv.classList.remove('flagged');
    }
    saveGame();
}

function countAdjacentTreasures(r, c) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nr = r + i, nc = c + j;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].treasureId !== 0) count++;
        }
    }
    return count;
}

function revealCell(r, c) {
    if (board[r][c].revealed || board[r][c].flagged) return;

    if (movesLeft <= 0) {
        showMessage('⚠️ 雷達電量不足！請小隊先去完成關卡任務充電。');
        return;
    }

    board[r][c].revealed = true;
    movesLeft--;
    document.getElementById('moves-display').innerText = movesLeft;

    const cellDiv = document.getElementById(`cell-${r}-${c}`);
    cellDiv.classList.add('revealed');
    const tId = board[r][c].treasureId;

    if (tId === 0) {
        cellDiv.classList.add('miss');
        const count = countAdjacentTreasures(r, c);
        if (count > 0) {
            cellDiv.innerText = count;
            cellDiv.classList.add(`n${count}`);
        } else {
            cellDiv.innerText = '';
        }
        showMessage('這裡只是一片空蕩蕩的草地...');
    } else {
        const treasure = treasures.find(t => t.id === tId);
        cellDiv.classList.add('hit');
        cellDiv.innerText = treasure.icon;
        treasure.foundCount++;

        if (treasure.foundCount === treasure.size) {
            const pt = POINTS_MAP[treasure.size];
            score += pt;
            document.getElementById('score-display').innerText = score;

            if (treasure.icon === '👾') {
                showMessage(`🔥 驚人發現！破解了 👾 怪盜的陷阱，一口氣奪回 ${pt} 分！`);
            } else {
                showMessage(`✨ 太棒了！順利尋回 ${treasure.icon} (+${pt} 分)`);
            }

            treasure.cells.forEach(pos => {
                document.getElementById(`cell-${pos.r}-${pos.c}`).classList.add('completed');
            });
            updatePlayReferenceUI();
        } else {
            showMessage(`📡 雷達有反應！掃描到 ${treasure.icon} 的一部分了，繼續挖！`);
        }
    }

    checkGameOver();
}

function checkGameOver() {
    const allFound = treasures.every(t => t.foundCount === t.size);
    if (allFound) {
        showMessage(`🎊 奇蹟！所有樂器都找回來了！演唱會準備開始！最終得分：${score} 分！`);
        movesLeft = 0;
        endGameDisplay();
        clearSave();
    } else {
        saveGame();
    }
}

function endGameDisplay() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c].revealed && board[r][c].treasureId !== 0) {
                const cellDiv = document.getElementById(`cell-${r}-${c}`);
                const treasure = treasures.find(t => t.id === board[r][c].treasureId);
                cellDiv.innerText = treasure.icon;
                cellDiv.style.backgroundColor = 'rgba(241,196,15,0.08)';
                cellDiv.style.border = '1px dashed rgba(241,196,15,0.3)';
                cellDiv.style.color = 'rgba(255,255,255,0.5)';
            }
        }
    }
    document.getElementById('flag-controls').style.display = 'none';
}

// ===== Easter Eggs =====

function unlockEgg(eggId) {
    const egg = easterEggs[eggId];
    if (egg && !egg.unlocked) {
        egg.unlocked = true;
        gmStats.secret++;
        movesLeft += egg.steps;
        gmStats.total += egg.steps;

        document.getElementById('moves-display').innerText = movesLeft;
        updateGMStatsUI();
        saveGame();

        showMessage(`🎉 曲目解鎖！播放了【${egg.name}】！獲得 ${egg.steps} 步。`);
        alert(`💿 恭喜解鎖隱藏曲目！\n曲目：【${egg.name}】\n系統已發放 ${egg.steps} 步額外電量！`);
    }
}

function promptEasterEgg() {
    let code = prompt('🕵️ 請輸入破解曲目的密語：');
    if (!code) return;
    code = code.trim();

    // Developer hidden easter egg — never shown in the gallery
    if (code === 'ablueboyy') {
        if (gmStats.authorUnlocked) {
            alert('⚠️ 作者已經感謝過你啦！');
            return;
        }
        alert('作者感謝你的遊玩 偷偷給你10步 很多喔 然後這個密碼是我的哀居 如果你有找到這個彩蛋可以加我讓我知道你很厲害');
        gmStats.authorUnlocked = true;
        movesLeft += 10;
        gmStats.total += 10;
        gmStats.secret++;
        document.getElementById('moves-display').innerText = movesLeft;
        updateGMStatsUI();
        saveGame();
        showMessage('🎉 觸發開發者專屬隱藏彩蛋！獲得 10 步。');
        return;
    }

    let foundEgg = null;
    for (let key in easterEggs) {
        if (easterEggs[key].code === code) { foundEgg = easterEggs[key]; break; }
    }

    if (foundEgg) {
        if (foundEgg.unlocked) {
            alert('⚠️ 這首曲目已經被解鎖過囉！');
        } else {
            unlockEgg(foundEgg.id);
        }
    } else {
        alert('❌ 密語錯誤或不存在，請再試試！');
    }
}
