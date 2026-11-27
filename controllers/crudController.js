const Suti = require("../models/Suti");
const Ar = require("../models/Ar");
const Tartalom = require("../models/Tartalom");

async function getTipusok() {
    const tipusok = await Suti.distinct("tipus");
    return tipusok.sort((a, b) => a.localeCompare(b, "hu"));
}

exports.index = async (req, res) => {
    try {
        const sutik = await Suti.find().sort({ sutiId: -1 }).lean();
        res.render("crud/index", { sutik });
    } catch (err) {
        console.error("CRUD lista hiba:", err);
        res.status(500).send("Szerver hiba a sütemények listázásakor.");
    }
};

exports.newForm = async (req, res) => {
    try {
        const tipusok = await getTipusok();
        res.render("crud/new", { formData: {}, errors: {}, tipusok });
    } catch (err) {
        console.error("CRUD uj urlap hiba:", err);
        res.status(500).send("Szerver hiba.");
    }
};

exports.insert = async (req, res) => {
    try {
        const last = await Suti.findOne().sort({ sutiId: -1 }).lean();
        const nextId = last ? last.sutiId + 1 : 1;

        await Suti.create({
            sutiId: nextId,
            nev: req.body.nev,
            tipus: req.body.tipus,
            dijazott: req.body.dijazott === "1"
        });

        req.session.message = "Új sütemény sikeresen hozzáadva!";
        req.session.messageType = "success";
        return res.redirect("/crud");
    } catch (err) {
        if (err.name === "ValidationError") {
            const tipusok = await getTipusok();
            return res.status(400).render("crud/new", {
                formData: req.body,
                errors: err.errors,
                tipusok
            });
        }
        console.error("CRUD beszuras hiba:", err);
        req.session.message = "Hiba történt a sütemény létrehozásakor.";
        req.session.messageType = "error";
        return res.redirect("/crud");
    }
};

exports.editForm = async (req, res) => {
    try {
        const suti = await Suti.findById(req.params.id).lean();
        if (!suti) {
            req.session.message = "A keresett sütemény nem található.";
            req.session.messageType = "error";
            return res.redirect("/crud");
        }
        const tipusok = await getTipusok();
        res.render("crud/edit", { suti, formData: {}, errors: {}, tipusok });
    } catch (err) {
        console.error("CRUD szerkesztes betoltesi hiba:", err);
        req.session.message = "Érvénytelen sütemény azonosító.";
        req.session.messageType = "error";
        return res.redirect("/crud");
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await Suti.findByIdAndUpdate(
            req.params.id,
            {
                nev: req.body.nev,
                tipus: req.body.tipus,
                dijazott: req.body.dijazott === "1"
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            req.session.message = "A módosítandó sütemény nem található.";
            req.session.messageType = "error";
            return res.redirect("/crud");
        }

        req.session.message = "A sütemény adatai sikeresen módosítva!";
        req.session.messageType = "success";
        return res.redirect("/crud");
    } catch (err) {
        if (err.name === "ValidationError") {
            const suti = await Suti.findById(req.params.id).lean();
            const tipusok = await getTipusok();
            return res.status(400).render("crud/edit", {
                suti: suti || { _id: req.params.id, sutiId: "?" },
                formData: req.body,
                errors: err.errors,
                tipusok
            });
        }
        console.error("CRUD modositasi hiba:", err);
        req.session.message = "Hiba történt a módosítás során.";
        req.session.messageType = "error";
        return res.redirect("/crud");
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Suti.findByIdAndDelete(req.params.id);
        if (deleted) {
            await Promise.all([
                Ar.deleteMany({ sutiId: deleted.sutiId }),
                Tartalom.deleteMany({ sutiId: deleted.sutiId })
            ]);
            req.session.message = `A(z) "${deleted.nev}" sütemény törölve lett.`;
            req.session.messageType = "success";
        } else {
            req.session.message = "A törlendő sütemény nem található.";
            req.session.messageType = "error";
        }
        return res.redirect("/crud");
    } catch (err) {
        console.error("CRUD torlesi hiba:", err);
        req.session.message = "Hiba történt a törlés során.";
        req.session.messageType = "error";
        return res.redirect("/crud");
    }
};
