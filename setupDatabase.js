const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'user.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    reservation_date TEXT,
    people_count INTEGER,
    special_requests TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
