// 這裡維護所有的更新日誌
const UPDATE_LOGS = [
    {
        version: "v1.2.0",
        date: "5/3",
        color: "#8e44ad", // 紫色
        items: [
            "對帳紀錄看板：隨隊關主現在可以看到按鈕點擊次數與總步數發放紀錄。",
            "密語彩蛋系統：「破解彩蛋」需輸入指定密語。",
            "新增彩蛋圖鑑系統，解鎖條件後即可點亮成就並獲得相對應的步數獎勵！"
        ]
    },
    {
        version: "v1.1.0",
        date: "4/20",
        color: "#27ae60", // 綠色
        items: [
            "新增「隨機生成滿載並單機遊玩」按鈕，一鍵自動佈置所有樂器並給予 90 步。",
            "新增「空地標記 (❌)」功能，並優化切換按鈕位置。"
        ]
    },
    {
        version: "v1.0.0",
        date: "4/19",
        color: "#e67e22", // 橘色
        items: [
            "導入超壓縮陣型代碼 (NTU-xxx)，移除舊版長代碼系統。",
            "地圖調整為 16x16，並優化各樂器庫存上限。"
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
        code: 'song-密碼', 
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