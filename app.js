require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const connectDB = require("./config/db");
const { seedDatabase } = require("./seed");
const mainRouter = require("./routes/mainRouter");

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionMongoUrl = process.env.SESSION_MONGO_URI || process.env.MONGO_URI;

app.use(
    session({
        secret: process.env.SESSION_SECRET || "cukraszda-fallback-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: sessionMongoUrl,
            collectionName: "sessions"
        })
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message || "";
    res.locals.messageType = req.session.messageType || "success";
    res.locals.currentPath = req.path;
    req.session.message = "";
    req.session.messageType = "";
    next();
});

app.use("/", mainRouter);

app.use((req, res) => {
    res.status(404).send("<h2>404 - A keresett oldal nem található!</h2><p><a href='/'>Vissza a főoldalra</a></p>");
});

async function startServer() {
    await connectDB();
    await seedDatabase({ force: false });
    app.listen(port, () => {
        console.log(`Szerver fut: http://localhost:${port}`);
    });
}

startServer();
