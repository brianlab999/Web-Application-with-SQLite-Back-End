# Web-Application-with-SQLite-Back-End

A full-stack reservation system built with Node.js and Express as the core backend and SQLite as the storage layer, integrated with the existing Mövenpick Café front-end. This project demonstrates end-to-end front-end / back-end integration, database design, RESTful API endpoints, and form submission handling.

Front-end source: [brianlab999/Movenpick](https://github.com/brianlab999/Movenpick) — the `views/` directory of this project reuses all HTML / CSS / JS files from that project and serves them directly as static assets via Express.<br/>
**Demo Video:** [Demo Vedio](https://www.youtube.com/watch?v=-8x2bmUEOtM)

---

## Overview

This project extends the original front-end-only Mövenpick Café website by upgrading the previously read-only reservation form into a fully functional database-backed application:

- An Express server provides the back-end and listens on `http://localhost:3000` by default.
- A lightweight local SQLite database (`user.db`) stores reservation records in the `reservations` table.
- Submitted form data is written to the database in real time, and historical reservations can be browsed on the reservation list page.
- A RESTful endpoint `/api/bookings` is provided so the front-end JavaScript can fetch and render bookings asynchronously.<br/>

---

## Architecture

```
Browser (Movenpick frontend)
        |
        v
Express server (app.js)
        |
        v
SQLite database (user.db, table: reservations)
```

- Front-end pages are served from the `views/` directory using `express.static`.
- The reservation form submits data to the back-end via `POST /submit_reservation`.
- The back-end uses parameterized SQL statements (protecting against SQL injection) to insert records.
- After a successful write, the user is redirected to the reservation list page `/list`.

---

## Tech Stack

- Node.js
- Express 4.21.2
- SQLite3 5.1.7
- HTML / CSS / JavaScript (Vanilla, sourced from the Movenpick front-end)

---

## Database Schema

Columns of the `reservations` table:

| Column | Type | Description |
| --- | --- | --- |
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Reservation ID. |
| `customer_id` | TEXT | Customer identifier. |
| `customer_name` | TEXT | Customer name. |
| `customer_phone` | TEXT | Contact phone number. |
| `customer_email` | TEXT | Email address. |
| `reservation_date` | TEXT | Reservation date. |
| `people_count` | INTEGER | Number of guests. |
| `special_requests` | TEXT | Special requests or notes. |

Table creation logic lives in `setupDatabase.js` and runs automatically on first execution.

---

## API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/reservation` | Returns the reservation form page `15.reservation.html`. |
| `POST` | `/submit_reservation` | Receives the reservation form payload, writes it to SQLite, and redirects to the list page. |
| `GET` | `/list` | Returns the reservation list page `mvp_list.html`. |
| `GET` | `/api/bookings` | Returns all reservations as JSON for the front-end list page to render asynchronously. |

---

## Project Structure

```
Web-Application-with-SQLite-Back-End/
  app.js               Main Express server and route logic
  setupDatabase.js     Initializes the SQLite database and the reservations table
  package.json         Project dependencies
  user.db              SQLite database file (created automatically at runtime)
  views/               Front-end pages (reused from the Movenpick front-end)
```

---

## How to Run

1. Make sure Node.js (version 18 or above is recommended) is installed locally.
2. Install dependencies:

```bash
npm install
```

3. Initialize the database (required on the first run):

```bash
node setupDatabase.js
```

4. Start the Express server:

```bash
node app.js
```

5. Open `http://localhost:3000/reservation` in your browser to start using the reservation form. After submission, navigate to `/list` to view all stored reservations.

---

## Highlights

- Complete end-to-end integration: front-end form, back-end routes, database persistence, and the list page are fully wired together.
- Uses parameterized SQL statements to mitigate the risk of SQL injection.
- RESTful API design: the front-end can fetch JSON data dynamically via `GET /api/bookings`.
- Clear separation of concerns: server logic (`app.js`), database initialization (`setupDatabase.js`), and static front-end (`views/`) are decoupled.
