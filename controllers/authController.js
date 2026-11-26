const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.userIndex = (req, res) => {
    res.render("user");
};

exports.adminIndex = (req, res) => {
    res.render("admin");
};

exports.registerGet = (req, res) => {
    res.render("register", { formData: {}, errors: {} });
};

exports.registerPost = async (req, res) => {
    try {
        const username = (req.body.username || "").trim();
        const password = req.body.password || "";
        const errors = {};

        if (username.length < 3) {
            errors.username = { message: "A felhasználónév legalább 3 karakter legyen!" };
        }
        if (password.length < 4) {
            errors.password = { message: "A jelszó legalább 4 karakter legyen!" };
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("register", {
                formData: { username },
                errors
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.session.message = "Ez a felhasználónév már foglalt!";
            req.session.messageType = "error";
            return res.redirect("/register");
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, password: hash, role: "user" });

        req.session.message = "Sikeres regisztráció! Most már bejelentkezhet.";
        req.session.messageType = "success";
        return res.redirect("/login");
    } catch (err) {
        console.error("Regisztracios hiba:", err);
        req.session.message = "Hiba történt a regisztráció során.";
        req.session.messageType = "error";
        return res.redirect("/register");
    }
};

exports.loginGet = (req, res) => {
    res.render("login");
};

exports.loginPost = async (req, res) => {
    try {
        const username = (req.body.username || "").trim();
        const password = req.body.password || "";

        const user = await User.findOne({ username });
        if (!user) {
            req.session.message = "Sikertelen bejelentkezés: hibás felhasználónév vagy jelszó!";
            req.session.messageType = "error";
            return res.redirect("/login");
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            req.session.message = "Sikertelen bejelentkezés: hibás felhasználónév vagy jelszó!";
            req.session.messageType = "error";
            return res.redirect("/login");
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        req.session.message = `Sikeres bejelentkezés, üdvözöljük ${user.username}!`;
        req.session.messageType = "success";

        if (user.role === "admin") {
            return res.redirect("/admin");
        }
        return res.redirect("/user");
    } catch (err) {
        console.error("Bejelentkezesi hiba:", err);
        req.session.message = "Hiba történt a bejelentkezés során.";
        req.session.messageType = "error";
        return res.redirect("/login");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
