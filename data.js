// 這裡維護所有的更新日誌
const UPDATE_LOGS = [
    {
        version: "v1.3.0",
        date: "6/12",
        color: "#322488", // 紫色
        items: [
            "Redesign the game art"
        ]
    },
    {
        version: "v1.2.2",
        date: "5/31",
        color: "#8e44ad", // 紫色
        items: [
            "Modify the hint of Easter eggs"
        ]
    },
    {
        version: "v1.2.1",
        date: "5/3",
        color: "#8e44ad", // 紫色
        items: [
            "Modify some detail of Easter eggs","Change the randomize item into two and lessen its score."
        ]
    },
    {
        version: "v1.2.0",
        date: "5/3",
        color: "#8e44ad", // 紫色
        items: [
            "You can now view the button click count and the total step distribution history.",
            "Added an Easter Egg system; enter specific secret codes or meet certain conditions to earn steps.",
            "Added an Easter Egg Gallery to view all unlocked secrets and it's an easter egg here: enter \"ablueboyy\" to get 10 moves."
        ]
    },
    {
        version: "v1.1.0",
        date: "4/20",
        color: "#27ae60", // Green
        items: [
            "Added 'Random Generation & Single Player' mode: automatically place all instruments and set steps to 90 with one click.",
            "Added marking functionality and optimized the positioning of the toggle buttons."
        ]
    },
    {
        version: "v1.0.0",
        date: "4/19",
        color: "#e67e22", // Orange
        items: [
            "Implemented the Formation Code system.",
            "Adjusted the map to 16x16 and updated the inventory limits for each instrument."
        ]
    }
];

// 這裡維護所有的隱藏彩蛋 (曲目)
const EASTER_EGGS = {
    'egg0': { 
        id: 'egg0', 
        name: 'Track 00.《XxstartpointxX》', 
        code: 'song-sample', 
        steps: 1, 
        hint: null,
        unlockcond: '認真聽講！'
    },
    'egg1': { 
        id: 'egg1', 
        name: 'Track 01.《navigate》', 
        code: 'song-onmap', 
        steps: 2, 
        hint: '仔細看！',
        unlockcond: '找到地圖上的祕密'
    },
    'egg2': { 
        id: 'egg2', 
        name: 'Track 02.《timetraveler》', 
        code: 'song-inorder', 
        steps: 5, 
        hint: '努力排！',
        unlockcond: '歌曲年代一題完全正確'
    },
    'egg3': { 
        id: 'egg3', 
        name: 'Track 03.《unlimited》', 
        code: 'song-battt', 
        steps: 3, 
        hint: '用力打！',
        unlockcond: '找到藏在軟棒裡的暗號'
    },
    'egg4': { 
        id: 'egg4', 
        name: 'Track 04.《parody》', 
        code: 'song-jaychouu', 
        steps: 5, 
        hint: '國文滿級分！',
        unlockcond: '周杰倫歌詞正確率高'
    },
    'egg5': { 
        id: 'egg5', 
        name: 'Track 05.《monovision》', 
        code: 'song-imsingle', 
        steps: 3, 
        hint: '眼力考驗',
        unlockcond: '戴錐子找到題目卡上的暗號'
    },
    'egg6': { 
        id: 'egg6', 
        name: 'Track 06.《change》', 
        code: null, 
        steps: 3, 
        hint: '吃飽太閒？',
        unlockcond: '點擊旗標功能十次' 
    },
    'egg7': { 
        id: 'egg7', 
        name: 'Track 07.《auspicious》', 
        code: 'song-fortune', 
        steps: 2, 
        hint: '可遇不可求...' ,
        unlockcond: '駭客任務抽到指定的籤'
    },
    'egg8': { 
        id: 'egg8', 
        name: 'Track 08.《melody》', 
        code: 'song-peaches', 
        steps: 3, 
        hint: '認真聽！',
        unlockcond: '有注意到戰鬥西洋棋播放的歌曲'
    },
    'egg9': { 
        id: 'egg9', 
        name: 'Track 09.《password》', 
        code: '密碼', 
        steps: 2, 
        hint: '請輸入密碼' ,
        unlockcond: '有輸入密碼'
    },
    'egg10': { 
        id: 'egg10', 
        name: 'Track 10.《XxendpointxX》', 
        code: 'song-final', 
        steps: 1, 
        hint: '關主好' ,
        unlockcond: '有注意看場控關主'
    }
};