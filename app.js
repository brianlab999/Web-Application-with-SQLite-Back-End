const express = require('express'); // 引入 Express 框架
const path = require('path'); // 引入 Node.js 的 path 模組
const sqlite3 = require('sqlite3').verbose(); // 引入 SQLite3 模組

const app = express(); // 建立 Express 應用程式物件
const port = 3000; // 指定應用程式監聽的埠號

app.use(express.json()); // 設定 Express 使用 JSON 解析中間件
app.use(express.urlencoded({ extended: true })); // 設定 Express 使用 URL 編碼解析中間件

const dbPath = path.join(__dirname, 'user.db'); // 資料庫檔案的路徑
const db = new sqlite3.Database(dbPath); // 建立 SQLite 資料庫物件

// 提供靜態檔案 (如 HTML 表單頁面)
app.use(express.static(path.join(__dirname, 'views')));

// 處理 GET /reservation 請求，回傳 reservation.html 檔案
app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '15.reservation.html'));
});

// 處理 POST /submit_reservation 請求，將新訂位資料新增至資料庫
app.post('/submit_reservation', (req, res) => {
  const newReservation = req.body; // 從請求中取得新訂位資料

  // 準備 SQL 指令
  const query = `INSERT INTO reservations 
                (customer_id, customer_name, customer_phone, customer_email, reservation_date, people_count, special_requests) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    newReservation.customer_id, 
    newReservation.customer_name,
    newReservation.customer_phone,
    newReservation.customer_email,
    newReservation.reservation_date,
    newReservation.people_count,
    newReservation.special_requests
  ];

  // 執行 SQL 指令，將資料插入資料庫
  db.run(query, values, function(err) {
    if (err) {
      console.error('Error adding booking to SQLite:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    } else {
      // 插入成功後，重新導向到 mvp_list.html 頁面
      res.redirect('/list');
    }
  });
});

// 處理 GET /list 請求，回傳 mvp_list.html 檔案
app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mvp_list.html'));
});

// 新的 API 端點，用於獲取預訂列表
app.get('/api/bookings', (req, res) => {
  const query = `SELECT * FROM reservations`;

  // 查詢資料庫中的所有訂位資料
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving bookings from SQLite:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    } else {
      res.json({ bookings: rows });
    }
  });
});

// 監聽應用程式的 exit 事件，在應用程式結束時關閉 SQLite 連線
process.on('exit', () => {
  db.close(); // 關閉 SQLite 資料庫連線
  console.log('SQLite connection closed');
});

// 啟動 Express 應用程式，開始監聽指定埠號上的 HTTP 請求
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
