const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "A felhasználónév megadása kötelező!"],
            unique: true,
            trim: true,
            minlength: [3, "A felhasználónév legalább 3 karakter legyen!"]
        },
        password: {
            type: String,
            required: [true, "A jelszó megadása kötelező!"]
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
