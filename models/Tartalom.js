const mongoose = require("mongoose");

const tartalomSchema = new mongoose.Schema(
    {
        tartalomId: {
            type: Number,
            required: true,
            unique: true
        },
        sutiId: {
            type: Number,
            required: true,
            index: true
        },
        mentes: {
            type: String,
            required: [true, "A mentes jelölés megadása kötelező!"],
            trim: true
        }
    },
    {
        collection: "tartalmak",
        versionKey: false
    }
);

module.exports = mongoose.model("Tartalom", tartalomSchema);
