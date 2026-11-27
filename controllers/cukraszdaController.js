const Suti = require("../models/Suti");
const Ar = require("../models/Ar");
const Tartalom = require("../models/Tartalom");

const MENTES_LEIRAS = {
    G: "Gluténmentes",
    L: "Laktózmentes",
    HC: "Hozzáadott cukormentes",
    Te: "Tejmentes",
    To: "Tojásmentes",
    É: "Édesítőszerrel készült"
};

exports.homeIndex = async (req, res) => {
    try {
        const [sutiCount, arCount, tartalomCount, dijazottCount] = await Promise.all([
            Suti.countDocuments(),
            Ar.countDocuments(),
            Tartalom.countDocuments(),
            Suti.countDocuments({ dijazott: true })
        ]);

        res.render("home", {
            stats: { sutiCount, arCount, tartalomCount, dijazottCount }
        });
    } catch (err) {
        console.error("Fooldal hiba:", err);
        res.status(500).send("Szerver hiba a főoldal betöltésekor.");
    }
};

exports.databaseIndex = async (req, res) => {
    try {
        const kereses = (req.query.kereses || "").trim();
        const tipus = (req.query.tipus || "").trim();
        const mentes = (req.query.mentes || "").trim();
        const dijazott = (req.query.dijazott || "").trim();

        const [allSutik, allArak, allTartalmak] = await Promise.all([
            Suti.find().sort({ sutiId: 1 }).lean(),
            Ar.find().sort({ ertek: 1 }).lean(),
            Tartalom.find().lean()
        ]);

        const arakBySuti = new Map();
        allArak.forEach((a) => {
            if (!arakBySuti.has(a.sutiId)) arakBySuti.set(a.sutiId, []);
            arakBySuti.get(a.sutiId).push(a);
        });

        const tartalomBySuti = new Map();
        allTartalmak.forEach((t) => {
            if (!tartalomBySuti.has(t.sutiId)) tartalomBySuti.set(t.sutiId, []);
            tartalomBySuti.get(t.sutiId).push(t.mentes);
        });

        const tipusok = [...new Set(allSutik.map((s) => s.tipus))].sort((a, b) =>
            a.localeCompare(b, "hu")
        );
        const mentesOpcio = [...new Set(allTartalmak.map((t) => t.mentes))].sort((a, b) =>
            a.localeCompare(b, "hu")
        );

        let joined = allSutik.map((s) => ({
            ...s,
            arak: arakBySuti.get(s.sutiId) || [],
            tartalmak: tartalomBySuti.get(s.sutiId) || []
        }));

        if (kereses) {
            const q = kereses.toLowerCase();
            joined = joined.filter(
                (s) => s.nev.toLowerCase().includes(q) || s.tipus.toLowerCase().includes(q)
            );
        }
        if (tipus) {
            joined = joined.filter((s) => s.tipus === tipus);
        }
        if (mentes) {
            joined = joined.filter((s) => s.tartalmak.includes(mentes));
        }
        if (dijazott === "1") {
            joined = joined.filter((s) => s.dijazott);
        }

        res.render("database", {
            sutik: joined,
            tipusok,
            mentesOpcio,
            mentesLeiras: MENTES_LEIRAS,
            searchQuery: kereses,
            filters: { kereses, tipus, mentes, dijazott },
            counts: {
                sutik: allSutik.length,
                arak: allArak.length,
                tartalmak: allTartalmak.length
            }
        });
    } catch (err) {
        console.error("Adatbazis oldal hiba:", err);
        res.status(500).send("Szerver hiba az adatbázis lekérdezésekor.");
    }
};
