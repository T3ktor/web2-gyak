const mongoose = require("mongoose");

const arSchema = new mongoose.Schema(
    {
        arId: {
            type: Number,
            required: true,
            unique: true
        },
        sutiId: {
            type: Number,
            required: true,
            index: true
        },
        ertek: {
            type: Number,
            required: [true, "Az ár értékének megadása kötelező!"],
            min: [0, "Az ár nem lehet negatív!"]
        },
        egyseg: {
            type: String,
            required: [true, "Az egység megadása kötelező!"],
            trim: true
        }
    },
    {
        collection: "arak",
        versionKey: false
    }
);

module.exports = mongoose.model("Ar", arSchema);
