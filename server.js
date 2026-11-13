const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// 🗄️ SQLiteデータベースの初期化（users.db ファイルに保存）
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
    } else {
        console.log('📦 SQLiteデータベースに接続しました。');
    }
});

// ユーザーテーブルの作成
db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    hint TEXT,
    hintAnswer TEXT,
    score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    money INTEGER DEFAULT 100,
    bestTime REAL,
    ownedCars TEXT,
    currentCar TEXT,
    ownedItems TEXT,
    unlockedTrophies TEXT,
    clearCount INTEGER DEFAULT 0,
    stagesCleared TEXT,
    isBanned INTEGER DEFAULT 0,
    isBlocked INTEGER DEFAULT 0
)`);

// --- 🌐 API エンドポイント ---

// 1. 全ユーザー一覧の取得（管理者用：パスワードやBAN状態を網羅）
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const users = {};
        rows.forEach(row => {
            users[row.username] = {
                name: row.username,
                password: row.password,
                hint: row.hint,
                hintAnswer: row.hintAnswer,
                score: row.score,
                level: row.level,
                money: row.money,
                bestTime: row.bestTime,
                ownedCars: JSON.parse(row.ownedCars || '["crown210"]'),
                currentCar: row.currentCar || 'crown210',
                ownedItems: JSON.parse(row.ownedItems || '[]'),
                unlockedTrophies: JSON.parse(row.unlockedTrophies || '[]'),
                clearCount: row.clearCount,
                stagesCleared: JSON.parse(row.stagesCleared || '[]'),
                isBanned: row.isBanned === 1,
                isBlocked: row.isBlocked === 1
            };
        });
        res.json(users);
    });
});

// 2. ユーザー登録 / データ保存 (Upsert)
app.post('/api/users/:username', (req, res) => {
    const username = req.params.username;
    const u = req.body;

    const query = `
        INSERT INTO users (username, password, hint, hintAnswer, score, level, money, bestTime, ownedCars, currentCar, ownedItems, unlockedTrophies, clearCount, stagesCleared, isBanned, isBlocked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
            password=excluded.password,
            hint=excluded.hint,
            hintAnswer=excluded.hintAnswer,
            score=excluded.score,
            level=excluded.level,
            money=excluded.money,
            bestTime=excluded.bestTime,
            ownedCars=excluded.ownedCars,
            currentCar=excluded.currentCar,
            ownedItems=excluded.ownedItems,
            unlockedTrophies=excluded.unlockedTrophies,
            clearCount=excluded.clearCount,
            stagesCleared=excluded.stagesCleared,
            isBanned=excluded.isBanned,
            isBlocked=excluded.isBlocked
    `;

    const params = [
        username,
        u.password,
        u.hint || '',
        u.hintAnswer || '',
        u.score || 0,
        u.level || 1,
        u.money || 100,
        u.bestTime !== undefined ? u.bestTime : null,
        JSON.stringify(u.ownedCars || ['crown210']),
        u.currentCar || 'crown210',
        JSON.stringify(u.ownedItems || []),
        JSON.stringify(u.unlockedTrophies || []),
        u.clearCount || 0,
        JSON.stringify(u.stagesCleared || []),
        u.isBanned ? 1 : 0,
        u.isBlocked ? 1 : 0
    ];

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'データを保存しました。' });
    });
});

// 3. 管理者用：アカウントのBAN / ブロック状態の更新
app.post('/api/admin/status/:username', (req, res) => {
    const username = req.params.username;
    const { isBanned, isBlocked } = req.body;

    let fields = [];
    let params = [];
    if (isBanned !== undefined) {
        fields.push("isBanned = ?");
        params.push(isBanned ? 1 : 0);
    }
    if (isBlocked !== undefined) {
        fields.push("isBlocked = ?");
        params.push(isBlocked ? 1 : 0);
    }
    params.push(username);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE username = ?`;

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'ステータスを更新しました。' });
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 機捜210 管理サーバーがポート ${PORT} で起動しました`);
});
