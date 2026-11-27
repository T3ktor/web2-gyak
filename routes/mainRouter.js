const router = require("express").Router();
const authController = require("../controllers/authController");
const cukraszdaController = require("../controllers/cukraszdaController");
const messageController = require("../controllers/messageController");
const crudController = require("../controllers/crudController");

function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.session.message = "Az oldal megtekintéséhez bejelentkezés szükséges!";
    req.session.messageType = "error";
    return res.redirect("/login");
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    req.session.message = "Ehhez a művelethez adminisztrátori jogosultság szükséges!";
    req.session.messageType = "error";
    return res.redirect("/");
}

// Publikus oldalak
router.get("/", cukraszdaController.homeIndex);
router.get("/adatbazis", cukraszdaController.databaseIndex);
router.get("/diagram", cukraszdaController.diagramIndex);
router.get("/kapcsolat", messageController.contactGet);
router.post("/kapcsolat", messageController.contactPost);

// Autentikacio
router.get("/register", authController.registerGet);
router.post("/register", authController.registerPost);
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);
router.get("/logout", authController.logout);

// Szerepkor alapu iranyitopultok (07b alapjan)
router.get("/user", isLoggedIn, authController.userIndex);
router.get("/admin", isAdmin, authController.adminIndex);

// Bejelentkezett felhasznalo: Uzenetek
router.get("/uzenetek", isLoggedIn, messageController.messagesIndex);

// Admin: CRUD
router.get("/crud", isAdmin, crudController.index);
router.get("/crud/new", isAdmin, crudController.newForm);
router.post("/crud/insert", isAdmin, crudController.insert);
router.get("/crud/edit/:id", isAdmin, crudController.editForm);
router.post("/crud/update/:id", isAdmin, crudController.update);
router.post("/crud/delete/:id", isAdmin, crudController.remove);

module.exports = router;
