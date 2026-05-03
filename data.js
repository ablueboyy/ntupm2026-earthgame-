// 這裡維護所有的更新日誌
const UPDATE_LOGS = [
    {
        version: "v1.2.1",
        date: "5/3",
        color: "#8e44ad", // 紫色
        items: [
            "Modify some detail of Easter eggs","Change the randomize item into two and less its score."
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
        hint: null
    },
    'egg1': { 
        id: 'egg1', 
        name: 'Track 01.《navigate》', 
        code: 'song-onmap', 
        steps: 2, 
        hint: null
    },
    'egg2': { 
        id: 'egg2', 
        name: 'Track 02.《timetraveler》', 
        code: 'song-inorder', 
        steps: 5, 
        hint: '活的音樂史...'
    },
    'egg3': { 
        id: 'egg3', 
        name: 'Track 03.《unlimited》', 
        code: 'song-battt', 
        steps: 3, 
        hint: null
    },
    'egg4': { 
        id: 'egg4', 
        name: 'Track 04.《parody》', 
        code: 'song-jaychouu', 
        steps: 5, 
        hint: null
    },
    'egg5': { 
        id: 'egg5', 
        name: 'Track 05.《monovision》', 
        code: 'song-imsingle', 
        steps: 3, 
        hint: '眼力考驗'
    },
    'egg6': { 
        id: 'egg6', 
        name: 'Track 06.《change》', 
        code: null, 
        steps: 3, 
        hint: '吃飽太閒？' 
    },
    'egg7': { 
        id: 'egg7', 
        name: 'Track 07.《auspicious》', 
        code: 'song-fortune', 
        steps: 2, 
        hint: '運氣好自然會解到' 
    },
    'egg8': { 
        id: 'egg8', 
        name: 'Track 08.《melody》', 
        code: 'song-peaches', 
        steps: 3, 
        hint: 'bgm'
    },
    'egg9': { 
        id: 'egg9', 
        name: 'Track 09.《password》', 
        code: '密碼', 
        steps: 2, 
        hint: '請輸入密碼' 
    },
    'egg10': { 
        id: 'egg10', 
        name: 'Track 10.《XxendpointxX》', 
        code: 'song-final', 
        steps: 1, 
        hint: '關主好' 
    }
};