const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// データベースの接続（ファイルとして保存）
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
    } else {
        console.log('📦 SQLiteデータベースに接続しました。');
    }
});

// テーブルの作成（ユーザー情報保存用）
db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT,
    data TEXT,
    isBanned INTEGER DEFAULT 0,
    isBlocked INTEGER DEFAULT 0
)`);

// 1. 全ユーザー一覧の取得（/api/users）
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const usersObj = {};
        rows.forEach(row => {
            try {
                let parsedData = JSON.parse(row.data || '{}');
                parsedData.password = row.password;
                parsedData.isBanned = !!row.isBanned;
                parsedData.isBlocked = !!row.isBlocked;
                usersObj[row.username] = parsedData;
            } catch (e) {
                usersObj[row.username] = { password: row.password, isBanned: !!row.isBanned, isBlocked: !!row.isBlocked };
            }
        });
        res.json(usersObj);
    });
});

// 2. ユーザーデータの保存・新規登録（POST /api/users/:username）
app.post('/api/users/:username', (req, res) => {
    const username = req.params.username;
    const userData = req.body;
    const password = userData.password || '';
    const isBanned = userData.isBanned ? 1 : 0;
    const isBlocked = userData.isBlocked ? 1 : 0;
    const dataString = JSON.stringify(userData);

    db.run(
        `INSERT INTO users (username, password, data, isBanned, isBlocked) 
         VALUES (?, ?, ?, ?, ?) 
         ON CONFLICT(username) 
         DO UPDATE SET password=excluded.password, data=excluded.data, isBanned=excluded.isBanned, isBlocked=excluded.isBlocked`,
        [username, password, dataString, isBanned, isBlocked],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: '保存しました。' });
        }
    );
});

// 3. 管理者用：BAN・ブロック状態の更新（POST /api/admin/status/:username）
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

    if (fields.length === 0) {
        return res.status(400).json({ error: '更新する項目がありません。' });
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE username = ?`;

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'ステータスを更新しました。' });
    });
});

// 4. ユーザーの削除（DELETE /api/users/:username）
app.delete('/api/users/:username', (req, res) => {
    const username = req.params.username;
    db.run(`DELETE FROM users WHERE username = ?`, [username], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: '削除しました。' });
    });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 サーバーが起動しました（ポート: ${PORT}）`);
});
// ==========================
// オンライン対戦（ルーム管理）機能
// ==========================
const rooms = {}; // 部屋のデータを一時保存するメモリ

// 部屋の作成
app.post('/api/rooms/create', (req, res) => {
    const roomId = Math.random().toString(36.substring(2, 8)).toUpperCase(); // ランダムな6桁の部屋番号
    rooms[roomId] = {
        host: req.body.username || 'Host',
        players: [req.body.username || 'Host'],
        status: 'waiting', // waiting, playing, finished
        gameData: {}
    };
    res.json({ success: true, roomId: roomId });
});

// 部屋に参加
app.post('/api/rooms/join', (req, res) => {
    const { roomId, username } = req.body;
    if (!rooms[roomId]) {
        return res.status(404).json({ error: '指定されたサーバー番号の部屋が見つかりません。' });
    }
    if (!rooms[roomId].players.includes(username)) {
        rooms[roomId].players.push(username);
    }
    res.json({ success: true, room: rooms[roomId] });
});

// 部屋の状況確認
app.get('/api/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    if (!rooms[roomId]) {
        return res.status(404).json({ error: '部屋が見つかりません。' });
    }
    res.json(rooms[roomId]);
});
