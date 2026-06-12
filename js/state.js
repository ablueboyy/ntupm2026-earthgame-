// ===== Mutable Game State =====
// All variables here are modified at runtime by the game logic.

let board = [];
let treasures = [];
let phase = 'setup';
let score = 0;
let movesLeft = DEFAULT_MOVES;
let treasureIdCounter = 1;
let totalTreasureCells = 0;

let isFlagMode = false;
let modeToggleCount = 0;

let gmStats = { win: 0, lose: 0, secret: 0, total: 0, authorUnlocked: false };
let easterEggs = {};
