# Édes Harmónia Cukrászda – Web-programozás II. Beadandó

Készítették: **Kovács Ákos (FIY9TP)** & **Jónás Attila (Q7CJ2Z)**

## Alkalmazás áttekintése
Szerver oldali webalkalmazás **Node.js**, **Express**, **EJS**, **Mongoose (ODM)** és **MongoDB Atlas** segítségével, a `1-14-Cukrászda-3 táblás` adatbázisra építve, az **HTML5 UP – Editorial** reszponzív sablon felhasználásával.

## Főbb funkciók
- **Főoldal (`/`)**: Cukrászda bemutatóoldal statisztikákkal és kiemelt kategóriákkal.
- **Adatbázis (`/adatbazis`)**: A 3 kollekció (`sutik`, `arak`, `tartalmak`) összekapcsolt megjelenítése szűréssel és kereséssel Mongoose ODM-mel.
- **Diagram (`/diagram`)**: Interaktív Chart.js diagramok az adatbázis adatai alapján.
- **Kapcsolat (`/kapcsolat`)**: Kapcsolatfelvételi űrlap szerver oldali Mongoose validációval.
- **Üzenetek (`/uzenetek`)**: Csak bejelentkezett felhasználóknak, fordított időrendi sorrendben.
- **Autentikáció (`/login`, `/register`, `/logout`)**: Session-alapú (`express-session` + `connect-mongo` + `bcrypt`), `látogató`, `user` és `admin` szerepkörökkel.
- **CRUD (`/crud`)**: Csak `admin` szerepkörrel elérhető teljes létrehozás / módosítás / törlés felület a `sutik` kollekcióhoz.

## Telepítés és futtatás
```bash
npm install
# .env beállítása a .env.example alapján
npm run seed   # opcionális kézi seedelés (az app.js üres DB esetén automatikusan is seedel)
npm start
```
