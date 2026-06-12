// ===== Board Initialization & Cell Interaction =====

function initBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    board = [];
    treasures = [];
    treasureIdCounter = 1;
    totalTreasureCells = 0;
    document.getElementById('flag-controls').style.display = 'none';

    isFlagMode = false;
    modeToggleCount = 0;
    const toggleBtn = document.getElementById('mode-toggle-btn');
    if (toggleBtn) {
        toggleBtn.innerText = '目前狀態：⛏️ 挖掘探測模式';
        toggleBtn.style.background = '';
    }

    for (let r = 0; r < SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < SIZE; c++) {
            board[r][c] = { treasureId: 0, revealed: false, flagged: false };
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            cell.onclick = () => handleCellClick(r, c);
            cell.onmouseenter = () => handleCellHover(r, c);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                if (phase === 'play') toggleFlag(r, c);
            };
            boardDiv.appendChild(cell);
        }
    }
    updateInventoryUI();
}

function clearPreview() {
    document.querySelectorAll('.preview-valid, .preview-invalid').forEach(el => {
        el.classList.remove('preview-valid', 'preview-invalid');
    });
}

function handleCellHover(r, c) {
    if (phase !== 'setup') return;
    clearPreview();

    if (board[r][c].treasureId !== 0) {
        const treasure = treasures.find(t => t.id === board[r][c].treasureId);
        if (treasure) {
            treasure.cells.forEach(pos => {
                document.getElementById(`cell-${pos.r}-${pos.c}`).classList.add('preview-invalid');
            });
        }
        return;
    }

    const typeInfo = document.getElementById('treasure-type').value.split(',');
    const w = parseInt(typeInfo[0]);
    const h = parseInt(typeInfo[1]);
    const icon = typeInfo[2];

    let isValid = true;
    let cellsToPreview = [];

    if (treasures.filter(t => t.icon === icon).length >= LIMITS[icon]) isValid = false;
    if (r + h > SIZE || c + w > SIZE) isValid = false;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (r + i < SIZE && c + j < SIZE) {
                cellsToPreview.push({ r: r + i, c: c + j });
                if (board[r + i][c + j].treasureId !== 0) isValid = false;
            }
        }
    }

    cellsToPreview.forEach(pos => {
        document.getElementById(`cell-${pos.r}-${pos.c}`)
            .classList.add(isValid ? 'preview-valid' : 'preview-invalid');
    });
}

function handleCellClick(r, c) {
    if (phase === 'setup') {
        if (board[r][c].treasureId !== 0) removeTreasure(r, c);
        else placeTreasure(r, c);
    } else if (phase === 'play') {
        if (isFlagMode) toggleFlag(r, c);
        else revealCell(r, c);
    }
}
