const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        nev: {
            type: String,
            required: [true, "A név megadása kötelező!"],
            trim: true,
            minlength: [3, "A név legalább 3 karakter hosszú legyen!"]
        },
        email: {
            type: String,
            required: [true, "Az e-mail cím megadása kötelező!"],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Kérjük, érvényes e-mail címet adjon meg!"]
        },
        targy: {
            type: String,
            required: [true, "A tárgy megadása kötelező!"],
            trim: true,
            minlength: [3, "A tárgy legalább 3 karakter hosszú legyen!"]
        },
        uzenet: {
            type: String,
            required: [true, "Az üzenet szövegének megadása kötelező!"],
            trim: true,
            minlength: [10, "Az üzenet legalább 10 karakter hosszú legyen!"]
        },
        kuldesIdeje: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "messages",
        versionKey: false
    }
);

module.exports = mongoose.model("Message", messageSchema);
