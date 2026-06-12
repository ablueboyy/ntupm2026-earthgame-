// ===== Game Constants =====

const LIMITS = { '🎤': 10, '🎸': 6, '🪕': 6, '🎹': 5, '🥁': 3, '📻': 2 };

const NAMES_AND_SIZES = {
    '🎤': '麥克風 (1x1)',
    '🎸': '電吉他 (2x1)',
    '🪕': '貝斯 (1x2)',
    '🎹': '電子琴 (3x1)',
    '🥁': '爵士鼓 (2x2)',
    '📻': '監聽音箱 (2x3)',
    '👾': '怪盜的陷阱 (8格連鎖)'
};

const POINTS_MAP = { 1: 1, 2: 3, 3: 6, 4: 10, 6: 15, 8: 18, 10: 20 };

const SIZE = 16;
const SAVE_KEY = 'earthgame_save_data';
const DEFAULT_MOVES = 0;

const ICON_TO_CHAR = { '🎤':'A', '🎸':'B', '🪕':'C', '🎹':'D', '🥁':'E', '📻':'F', '👾':'G' };
const CHAR_TO_ICON = { 'A':'🎤', 'B':'🎸', 'C':'🪕', 'D':'🎹', 'E':'🥁', 'F':'📻', 'G':'👾' };

const SHAPE_MAP = {
    '🎤': { w: 1, h: 1 },
    '🎸': { w: 2, h: 1 },
    '🪕': { w: 1, h: 2 },
    '🎹': { w: 3, h: 1 },
    '🥁': { w: 2, h: 2 },
    '📻': { w: 2, h: 3 }
};
