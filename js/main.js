// ===== Entry Point =====

function loadGameAndInit() {
    initData();
    const savedData = localStorage.getItem(SAVE_KEY);

    if (savedData) {
        const state = JSON.parse(savedData);
        if (!state.board || state.board.length !== SIZE) { initBoard(); return; }

        board = state.board;
        treasures = state.treasures;
        phase = state.phase;
        score = state.score;
        movesLeft = state.movesLeft;
        treasureIdCounter = state.treasureIdCounter;
        totalTreasureCells = state.totalTreasureCells || 0;

        if (state.gmStats) gmStats = state.gmStats;
        if (state.easterEggs) {
            for (let key in easterEggs) {
                if (state.easterEggs[key]) {
                    easterEggs[key].unlocked = state.easterEggs[key].unlocked;
                }
            }
        }

        const boardDiv = document.getElementById('board');
        boardDiv.innerHTML = '';

        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${r}-${c}`;
                cell.onclick = () => handleCellClick(r, c);
                cell.onmouseenter = () => handleCellHover(r, c);
                cell.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (phase === 'play') toggleFlag(r, c);
                };

                const cellData = board[r][c];

                if (phase === 'setup' && cellData.treasureId !== 0) {
                    cell.classList.add('setup-treasure');
                    const treasure = treasures.find(t => t.id === cellData.treasureId);
                    if (treasure) cell.innerText = treasure.icon;
                }

                if (cellData.revealed) {
                    cell.classList.add('revealed');
                    if (cellData.treasureId === 0) {
                        cell.classList.add('miss');
                        const count = countAdjacentTreasures(r, c);
                        if (count > 0) {
                            cell.innerText = count;
                            cell.classList.add(`n${count}`);
                        }
                    } else {
                        cell.classList.add('hit');
                        const treasure = treasures.find(t => t.id === cellData.treasureId);
                        cell.innerText = treasure.icon;
                        if (treasure.foundCount === treasure.size) cell.classList.add('completed');
                    }
                } else if (cellData.flagged && phase === 'play') {
                    cell.innerText = '🚩';
                    cell.classList.add('flagged');
                }

                boardDiv.appendChild(cell);
            }
        }

        if (phase === 'play') {
            document.getElementById('setup-panel').style.display = 'none';
            document.getElementById('play-panel').style.display = 'block';
            document.getElementById('flag-controls').style.display = 'block';
            document.getElementById('score-display').innerText = score;
            document.getElementById('moves-display').innerText = movesLeft;
            updatePlayReferenceUI();
            updateGMStatsUI();
            showMessage('📡 系統連線成功！自動恢復先前的搜索進度。');
        } else {
            document.getElementById('flag-controls').style.display = 'none';
            updateInventoryUI();
            showMessage('🎵 歡迎回來！請繼續掩埋樂器。');
        }
    } else {
        initBoard();
    }
}

// Close modals when clicking the overlay background
window.onclick = function (event) {
    const logModal = document.getElementById('logModal');
    const eggModal = document.getElementById('eggModal');
    if (event.target === logModal) closeLog();
    if (event.target === eggModal) closeEggLog();
};

loadGameAndInit();
