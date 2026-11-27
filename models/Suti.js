const mongoose = require("mongoose");

const sutiSchema = new mongoose.Schema(
    {
        sutiId: {
            type: Number,
            required: true,
            unique: true
        },
        nev: {
            type: String,
            required: [true, "A sütemény nevének megadása kötelező!"],
            trim: true,
            minlength: [2, "A sütemény neve legalább 2 karakter legyen!"]
        },
        tipus: {
            type: String,
            required: [true, "A sütemény típusának megadása kötelező!"],
            trim: true,
            minlength: [2, "A típus legalább 2 karakter legyen!"]
        },
        dijazott: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: "sutik",
        versionKey: false
    }
);

module.exports = mongoose.model("Suti", sutiSchema);
