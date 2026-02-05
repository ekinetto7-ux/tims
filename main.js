/* =========================
   Train Vision Simulator
   main.js
========================= */

// ===== データ構造 =====
const TrainState = {
    currentIndex: 0,   // 現在駅index
    status: "stop",    // stop | depart
};

const TrainConfig = {
    maxMainStations: 8,     // メイン表示上限
    stations: [],           // 全駅データ（無制限）
    numberingColor: "#00aa66",
    lineColor: "#00aa66",
};

// ===== 駅データ構造 =====
/*
station = {
    jp: "東京",
    hira: "とうきょう",
    en: "Tokyo",
    numbering: "JA-01",
    numberColor: "#00aa66",
    transfer: ["JR山手線", "東京メトロ丸ノ内線"]
}
*/

// ===== 初期化 =====
function initTrainVision(stationData) {
    TrainConfig.stations = stationData;
    TrainState.currentIndex = 0;
    TrainState.status = "stop";
    render();
}

// ===== 描画 =====
function render() {
    renderMainDisplay();
    renderStationList();
}

// ===== メイン表示 =====
function renderMainDisplay() {
    const current = TrainConfig.stations[TrainState.currentIndex];
    const next = TrainConfig.stations[TrainState.currentIndex + 1] || null;

    // 次駅表示
    if (next) {
        setText("next-jp", next.jp);
        setText("next-hira", next.hira);
        setText("next-en", next.en);
        setText("next-number", next.numbering);
        setColor("next-number", next.numberColor || TrainConfig.numberingColor);

        // 乗換表示
        setTransfer("transfer", next.transfer || []);
    }

    // 状態表示
    setText("train-status", TrainState.status === "stop" ? "停車中" : "走行中");
}

// ===== 停車駅リスト =====
function renderStationList() {
    const container = document.getElementById("station-list");
    if (!container) return;

    container.innerHTML = "";

    const start = TrainState.currentIndex;
    const end = Math.min(start + TrainConfig.maxMainStations, TrainConfig.stations.length);

    for (let i = start; i < end; i++) {
        const st = TrainConfig.stations[i];
        const div = document.createElement("div");
        div.className = "station-item";

        if (i === TrainState.currentIndex) {
            div.classList.add("current");
        }

        div.innerHTML = `
            <div class="st-name">${st.jp}</div>
            <div class="st-num" style="color:${st.numberColor || TrainConfig.numberingColor}">
                ${st.numbering || ""}
            </div>
        `;

        container.appendChild(div);
    }
}

// ===== 状態操作 =====

// 停車
function setStop() {
    TrainState.status = "stop";
    render();
}

// 発車
function setDepart() {
    TrainState.status = "depart";
    render();
}

// 次駅へ（チェック方式）
function goNextStation() {
    if (TrainState.status !== "depart") {
        alert("発車後でないと次駅へ進めません");
        return;
    }

    if (TrainState.currentIndex < TrainConfig.stations.length - 1) {
        TrainState.currentIndex++;
        TrainState.status = "stop";
        render();
    }
}

// 前駅へ
function goPrevStation() {
    if (TrainState.currentIndex > 0) {
        TrainState.currentIndex--;
        TrainState.status = "stop";
        render();
    }
}

// ===== ユーティリティ =====
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text || "";
}

function setColor(id, color) {
    const el = document.getElementById(id);
    if (el) el.style.color = color;
}

function setTransfer(id, list) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = "";
    list.forEach(line => {
        const span = document.createElement("span");
        span.className = "transfer-line";
        span.innerText = line;
        el.appendChild(span);
    });
}

// ===== 外部操作API =====
window.TrainAPI = {
    init: initTrainVision,
    stop: setStop,
    depart: setDepart,
    next: goNextStation,
    prev: goPrevStation,
    config: TrainConfig,
    state: TrainState
};
