const Message = require("../models/Message");

exports.contactGet = (req, res) => {
    res.render("contact", { formData: {}, errors: {} });
};

exports.contactPost = async (req, res) => {
    try {
        await Message.create({
            nev: req.body.nev,
            email: req.body.email,
            targy: req.body.targy,
            uzenet: req.body.uzenet
        });

        req.session.message = "Köszönjük! Üzenetét sikeresen elmentettük az adatbázisba.";
        req.session.messageType = "success";
        return res.redirect("/kapcsolat");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).render("contact", {
                formData: req.body,
                errors: err.errors
            });
        }
        console.error("Uzenet mentesi hiba:", err);
        req.session.message = "Váratlan szerverhiba történt az üzenet mentésekor.";
        req.session.messageType = "error";
        return res.redirect("/kapcsolat");
    }
};
