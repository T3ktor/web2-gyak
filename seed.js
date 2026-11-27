require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Suti = require("./models/Suti");
const Ar = require("./models/Ar");
const Tartalom = require("./models/Tartalom");
const User = require("./models/User");
const Message = require("./models/Message");

function cleanText(val) {
    return String(val || "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();
}

function parseTabFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw
        .split(/\r?\n/)
        .map((line) => line.replace(/\r$/, ""))
        .filter((line) => line.trim().length > 0);
    return lines.slice(1).map((line) => line.split("\t"));
}

async function seedDatabase({ force = false } = {}) {
    const dataDir = path.join(__dirname, "data");

    const sutiCount = await Suti.countDocuments();
    if (force || sutiCount === 0) {
        const sutiRows = parseTabFile(path.join(dataDir, "suti.txt")).map((cols) => ({
            sutiId: parseInt(cleanText(cols[0]), 10),
            nev: cleanText(cols[1]),
            tipus: cleanText(cols[2]),
            dijazott: cleanText(cols[3]) === "-1"
        }));

        const arRows = parseTabFile(path.join(dataDir, "ar.txt")).map((cols) => ({
            arId: parseInt(cleanText(cols[0]), 10),
            sutiId: parseInt(cleanText(cols[1]), 10),
            ertek: parseInt(cleanText(cols[2]), 10) || 0,
            egyseg: cleanText(cols[3]) || "db"
        }));

        const tartalomRows = parseTabFile(path.join(dataDir, "tartalom.txt")).map((cols) => ({
            tartalomId: parseInt(cleanText(cols[0]), 10),
            sutiId: parseInt(cleanText(cols[1]), 10),
            mentes: cleanText(cols[2])
        }));

        await Suti.deleteMany({});
        await Ar.deleteMany({});
        await Tartalom.deleteMany({});

        await Suti.insertMany(sutiRows);
        await Ar.insertMany(arRows);
        await Tartalom.insertMany(tartalomRows);

        console.log(
            `Adatbazis feltoltve: ${sutiRows.length} suti, ${arRows.length} ar, ${tartalomRows.length} tartalom.`
        );
    }

    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
        const adminHash = await bcrypt.hash("Admin123!", 10);
        await User.create({ username: "admin", password: adminHash, role: "admin" });
        console.log("Alap admin felhasznalo letrehozva (admin / Admin123!).");
    }

    const userExists = await User.findOne({ username: "latogato" });
    if (!userExists) {
        const userHash = await bcrypt.hash("User123!", 10);
        await User.create({ username: "latogato", password: userHash, role: "user" });
        console.log("Alap teszt felhasznalo letrehozva (latogato / User123!).");
    }

    const messageCount = await Message.countDocuments();
    if (force || messageCount === 0) {
        if (force) await Message.deleteMany({});
        await Message.insertMany([
            {
                nev: "Kiss Eszter",
                email: "eszter.kiss@example.com",
                targy: "Gluténmentes torta rendelés",
                uzenet: "Érdeklődnék, hogy 16 szeletes gluténmentes tortát mennyi idővel előre érdemes megrendelni?",
                kuldesIdeje: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
            },
            {
                nev: "Nagy Péter",
                email: "peter.nagy@example.com",
                targy: "Díjazott torták kóstolója",
                uzenet: "Gratulálok a kínálathoz! A hétvégén kapható lesz az Ország Tortája szeletben is?",
                kuldesIdeje: new Date(Date.now() - 1000 * 60 * 60 * 5)
            }
        ]);
        console.log("Minta uzenetek feltoltve.");
    }
}

if (require.main === module) {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB csatlakozas sikeres a seedeleshez.");
            await seedDatabase({ force: true });
            await mongoose.connection.close();
            console.log("Seedeles befejezve.");
        } catch (err) {
            console.error("Seedelesi hiba:", err);
            process.exit(1);
        }
    })();
}

module.exports = { seedDatabase };
