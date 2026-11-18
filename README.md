# Úkolníček (To-Do List)

Fullstack webová aplikace v Node.js s architekturou Klient – Server – Databáze.
Úkoly se přidávají, zobrazují, označují za splněné a mažou asynchronně
(`fetch`, `async/await`) bez znovunačtení stránky a trvale se ukládají do MongoDB.

## Technologie
- Node.js, Express.js
- MongoDB + Mongoose
- HTML, CSS, JavaScript (frontend)

## Struktura projektu
```
server.js          # Express server, API a model Mongoose
public/
  index.html       # formulář a výpis úkolů
  script.js        # komunikace s API (fetch, async/await, try/catch)
  style.css        # responzivní vzhled
.env.example       # vzor proměnných prostředí
```

## API
| Metoda | Cesta | Popis |
|--------|-------|-------|
| GET | `/api/todos` | vrátí všechny úkoly ve formátu JSON |
| POST | `/api/todos` | ověří data a uloží nový úkol (`title`, `priority`) |
| PATCH | `/api/todos/:id` | změní stav splnění (`done`: true/false) |
| DELETE | `/api/todos/:id` | smaže úkol |

## Lokální spuštění
1. Nainstalujte Node.js a mějte přístup k MongoDB
   (lokální MongoDB, nebo bezplatný cluster na MongoDB Atlas).
2. Nainstalujte závislosti:
   ```
   npm install
   ```
3. Vytvořte soubor `.env` podle vzoru `.env.example` a doplňte připojení k databázi:
   ```
   MONGODB_URI=mongodb+srv://UZIVATEL:HESLO@cluster0.xxxxx.mongodb.net/todo-app?retryWrites=true&w=majority
   PORT=3000
   ```
   Pro lokální MongoDB: `MONGODB_URI=mongodb://127.0.0.1:27017/todo-app`
4. Spusťte aplikaci:
   ```
   npm start
   ```
5. Otevřete v prohlížeči http://localhost:3000

## Bonusy
- Mazání (DELETE) a označení za splněný (PATCH)
- Indikátor načítání „Načítám data...“
- Vlastní responzivní CSS

Složka `node_modules/` není součástí repozitáře (viz `.gitignore`);
vytvoří se příkazem `npm install`.