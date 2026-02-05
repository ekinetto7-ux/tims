/* ===============================
   Train Vision Simulator Config
   ※ 構造変更禁止 / 値のみ変更可
================================ */

const TrainConfig = {

    /* ===== 基本設定 ===== */
    line: {
        name: "横須賀線",
        color: "#0070c0"
    },

    service: {
        type: "各駅停車",
        type_en: "Local",
        destination: "久里浜",
        destination_en: "Kurihama",
        time: "12:00"
    },

    /* ===== 表示言語設定 ===== */
    display: {
        jp: true,
        hira: true,
        en: true
    },

    /* ===== メイン停車駅（8駅固定） ===== */
    mainStations: 8,

    /* ===== 駅データ ===== */
    stations: [
        {
            jp: "東京",
            hira: "とうきょう",
            en: "Tokyo",
            numbering: "JO-01",
            numberColor: "#0070c0",
            transfer: [
                { name: "山手線", color: "#9acd32" },
                { name: "中央線", color: "#ff7f00" }
            ],
            time: "12:00"
        },
        {
            jp: "新橋",
            hira: "しんばし",
            en: "Shimbashi",
            numbering: "JO-02",
            numberColor: "#0070c0",
            transfer: [
                { name: "銀座線", color: "#ff9500" }
            ],
            time: "12:03"
        },
        {
            jp: "品川",
            hira: "しながわ",
            en: "Shinagawa",
            numbering: "JO-03",
            numberColor: "#0070c0",
            transfer: [
                { name: "京急線", color: "#00bfff" },
                { name: "山手線", color: "#9acd32" }
            ],
            time: "12:07"
        },
        {
            jp: "西大井",
            hira: "にしおおい",
            en: "Nishi-Oi",
            numbering: "JO-04",
            numberColor: "#0070c0",
            transfer: [],
            time: "12:12"
        },
        {
            jp: "武蔵小杉",
            hira: "むさしこすぎ",
            en: "Musashi-Kosugi",
            numbering: "JO-05",
            numberColor: "#0070c0",
            transfer: [
                { name: "東横線", color: "#da0442" }
            ],
            time: "12:18"
        },
        {
            jp: "新川崎",
            hira: "しんかわさき",
            en: "Shin-Kawasaki",
            numbering: "JO-06",
            numberColor: "#0070c0",
            transfer: [],
            time: "12:23"
        },
        {
            jp: "横浜",
            hira: "よこはま",
            en: "Yokohama",
            numbering: "JO-07",
            numberColor: "#0070c0",
            transfer: [
                { name: "東海道線", color: "#f68b1e" },
                { name: "京浜東北線", color: "#00bfff" }
            ],
            time: "12:30"
        },
        {
            jp: "大船",
            hira: "おおふな",
            en: "Ofuna",
            numbering: "JO-08",
            numberColor: "#0070c0",
            transfer: [
                { name: "湘南モノレール", color: "#00cc99" }
            ],
            time: "12:40"
        },

        /* ===== サブ停車駅（制限なし） ===== */
        {
            jp: "北鎌倉",
            hira: "きたかまくら",
            en: "Kita-Kamakura",
            numbering: "JO-09",
            numberColor: "#0070c0",
            transfer: [],
            time: "12:45"
        },
        {
            jp: "鎌倉",
            hira: "かまくら",
            en: "Kamakura",
            numbering: "JO-10",
            numberColor: "#0070c0",
            transfer: [
                { name: "江ノ電", color: "#009944" }
            ],
            time: "12:50"
        },
        {
            jp: "逗子",
            hira: "ずし",
            en: "Zushi",
            numbering: "JO-11",
            numberColor: "#0070c0",
            transfer: [],
            time: "12:55"
        },
        {
            jp: "久里浜",
            hira: "くりはま",
            en: "Kurihama",
            numbering: "JO-12",
            numberColor: "#0070c0",
            transfer: [
                { name: "京急久里浜線", color: "#00bfff" }
            ],
            time: "13:05"
        }
    ],

    /* ===== 路線図用停車駅 ===== */
    routeMap: {
        enabled: true,
        showStations: "all"  // "main" or "all"
    }

};

/* グローバル公開（固定） */
window.TrainConfig = TrainConfig;
