const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("Hiba: A MONGO_URI kornyezeti valtozo nincs beallitva!");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB sikeresen csatlakozott.");
    } catch (err) {
        console.error("MongoDB kapcsolodasi hiba:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
